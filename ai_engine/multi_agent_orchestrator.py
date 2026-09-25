import os
import sys
import operator
from typing import Annotated, Sequence, TypedDict
from langchain_core.messages import BaseMessage, HumanMessage, AIMessage
from langchain_ollama import ChatOllama
from langgraph.graph import StateGraph, END
from langgraph.prebuilt import create_react_agent

# Ensure project root is on sys.path for package imports
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

from ai_engine.tools.playbook_tools import block_ip_address, isolate_host
from ai_engine.tools.qdrant_tools import search_past_breaches
from ai_engine.tools.suricata_tools import generate_suricata_rule
from ai_engine.guardrails import evaluate_ai_confidence, send_to_human_review_queue

# --- 1. Define the Shared State ---
class AgentState(TypedDict):
    messages: Annotated[Sequence[BaseMessage], operator.add]
    next_agent: str

# --- 2. Initialize Models (The Gateway) ---
MODEL_NAME = os.getenv("EXODIA_LLM_MODEL", "llama3.2")
MODEL_TEMP = float(os.getenv("EXODIA_LLM_TEMPERATURE", "0"))
llm = ChatOllama(model=MODEL_NAME, temperature=MODEL_TEMP)

# --- 3. Define the Sub-Agents ---
threat_tools = [search_past_breaches]
threat_agent_node = create_react_agent(
    llm, tools=threat_tools,
    state_modifier="You are the Threat Analysis Agent. Use the Qdrant vector database to search for historical CVEs and past breaches matching this attack pattern. Return a structured threat assessment."
)

remediation_tools = [block_ip_address, isolate_host, generate_suricata_rule]
remediation_agent_node = create_react_agent(
    llm, tools=remediation_tools,
    state_modifier="You are the Remediation Agent. Based on the threat analysis, execute the appropriate SOAR playbook to block malicious IPs or isolate compromised hosts. If the attack is novel, generate a Suricata rule to block the specific payload pattern permanently."
)

compliance_agent_node = create_react_agent(
    llm, tools=[],
    state_modifier="You are the Compliance Agent. Map every remediation action to the relevant SOC2 (CC6.1 Logical Access) or ISO27001 control requirement. Return the compliance log entry."
)

# --- 4. Define the Node Wrappers ---
def threat_node(state: AgentState):
    result = threat_agent_node.invoke({"messages": state["messages"]})
    return {
        "messages": [AIMessage(content=f"[Threat Agent]: {result['messages'][-1].content}")],
        "next_agent": "Guardrails"
    }

def guardrails_node(state: AgentState):
    """Eval layer: Checks if the AI is confident enough to allow auto-remediation."""
    last_response = state["messages"][-1].content
    confidence_score = evaluate_ai_confidence(last_response)

    if confidence_score < 0.80:
        send_to_human_review_queue("Alert Data", last_response)
        return {
            "messages": [AIMessage(content="[Guardrails]: Confidence below threshold. Incident paused. Sent to Human-in-the-loop review queue.")],
            "next_agent": "Compliance"
        }
    else:
        return {"next_agent": "Remediation"}

def remediation_node(state: AgentState):
    result = remediation_agent_node.invoke({"messages": state["messages"]})
    return {
        "messages": [AIMessage(content=f"[Remediation Agent]: {result['messages'][-1].content}")],
        "next_agent": "Compliance"
    }

def compliance_node(state: AgentState):
    result = compliance_agent_node.invoke({"messages": state["messages"]})
    return {
        "messages": [AIMessage(content=f"[Compliance Agent]: {result['messages'][-1].content}")],
        "next_agent": "Supervisor"
    }

# --- 5. Define the Supervisor (Router) ---
def supervisor_node(state: AgentState):
    """The supervisor decides who goes first or if the job is done."""
    last_message = state["messages"][-1].content

    if "Compliance Agent" in last_message or "Human-in-the-loop" in last_message:
        return {"next_agent": "FINISH"}

    return {"next_agent": "Threat"}

# --- 6. Build the Graph ---
graph = StateGraph(AgentState)

graph.add_node("Supervisor", supervisor_node)
graph.add_node("Threat", threat_node)
graph.add_node("Guardrails", guardrails_node)
graph.add_node("Remediation", remediation_node)
graph.add_node("Compliance", compliance_node)

graph.set_entry_point("Supervisor")

graph.add_conditional_edges(
    "Supervisor",
    lambda state: state["next_agent"],
    {"Threat": "Threat", "FINISH": END}
)

graph.add_conditional_edges(
    "Guardrails",
    lambda state: state["next_agent"],
    {"Remediation": "Remediation", "Compliance": "Compliance"}
)

graph.add_edge("Threat", "Guardrails")
graph.add_edge("Remediation", "Compliance")
graph.add_edge("Compliance", "Supervisor")

# Compile - this is the single export used by kafka_listener.py
workflow = graph.compile()
