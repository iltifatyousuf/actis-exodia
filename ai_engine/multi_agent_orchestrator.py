import operator
from typing import Annotated, Sequence, TypedDict, List
from langchain_core.messages import BaseMessage, HumanMessage, AIMessage
from langchain_ollama import ChatOllama
from langgraph.graph import StateGraph, END
from langgraph.prebuilt import create_react_agent
from ai_engine.tools.playbook_tools import block_ip_address, isolate_host
from ai_engine.tools.qdrant_tools import search_past_breaches

# --- 1. Define the Shared State ---
class AgentState(TypedDict):
    messages: Annotated[Sequence[BaseMessage], operator.add]
    next_agent: str  # Determines routing

# --- 2. Initialize Models (The Gateway) ---
# In production, this can route to Claude or GPT-4. We use local Llama3.2.
llm = ChatOllama(model="llama3.2", temperature=0)

# --- 3. Define the Sub-Agents ---
# Agent A: Threat Analysis
threat_tools = [search_past_breaches]
threat_agent_node = create_react_agent(llm, tools=threat_tools, state_modifier="You are the Threat Analysis Agent. Use Qdrant to find historical context. Then return the analysis.")

# Agent B: Auto-Remediation
remediation_tools = [block_ip_address, isolate_host]
remediation_agent_node = create_react_agent(llm, tools=remediation_tools, state_modifier="You are the Remediation Agent. Use SOAR playbooks to block IPs or isolate hosts based on threats.")

# Agent C: Compliance Mapping
compliance_agent_node = create_react_agent(llm, tools=[], state_modifier="You are the Compliance Agent. Map the threat to SOC2 or ISO27001 requirements (e.g. CC6.1 Logical Access).")

from ai_engine.guardrails import evaluate_ai_confidence, send_to_human_review_queue

# --- 4. Define the Node Wrappers ---
def threat_node(state: AgentState):
    result = threat_agent_node.invoke({"messages": state["messages"]})
    return {"messages": [AIMessage(content=f"[Threat Agent]: {result['messages'][-1].content}")], "next_agent": "Guardrails"}

def guardrails_node(state: AgentState):
    """Eval layer: Checks if the AI is confident enough to allow auto-remediation."""
    last_response = state["messages"][-1].content
    confidence_score = evaluate_ai_confidence(last_response)
    
    if confidence_score < 0.80:
        send_to_human_review_queue("Alert Data", last_response)
        return {"messages": [AIMessage(content="[Guardrails]: Incident paused. Sent to Human-in-the-loop.")], "next_agent": "Compliance"}
    else:
        return {"next_agent": "Remediation"}

def remediation_node(state: AgentState):
    result = remediation_agent_node.invoke({"messages": state["messages"]})
    return {"messages": [AIMessage(content=f"[Remediation Agent]: {result['messages'][-1].content}")], "next_agent": "Compliance"}

def compliance_node(state: AgentState):
    result = compliance_agent_node.invoke({"messages": state["messages"]})
    return {"messages": [AIMessage(content=f"[Compliance Agent]: {result['messages'][-1].content}")], "next_agent": "Supervisor"}

# --- 5. Define the Supervisor (Router) ---
def supervisor_node(state: AgentState):
    """The supervisor decides who goes first or if the job is done."""
    last_message = state["messages"][-1].content
    
    if "Compliance Agent" in last_message or "Human-in-the-loop" in last_message:
        return {"next_agent": "FINISH"}
    
    # Otherwise, kick off the analysis chain
    return {"next_agent": "Threat"}

# --- 6. Build the Graph ---
workflow = StateGraph(AgentState)

workflow.add_node("Supervisor", supervisor_node)
workflow.add_node("Threat", threat_node)
workflow.add_node("Guardrails", guardrails_node)
workflow.add_node("Remediation", remediation_node)
workflow.add_node("Compliance", compliance_node)

# Routing logic
workflow.set_entry_point("Supervisor")

workflow.add_conditional_edges(
    "Supervisor",
    lambda state: state["next_agent"],
    {
        "Threat": "Threat",
        "FINISH": END
    }
)

workflow.add_conditional_edges(
    "Guardrails",
    lambda state: state["next_agent"],
    {
        "Remediation": "Remediation",
        "Compliance": "Compliance"
    }
)

# Linear flow
workflow.add_edge("Threat", "Guardrails")
workflow.add_edge("Remediation", "Compliance")
workflow.add_edge("Compliance", "Supervisor")

# Compile the machine
orchestrator_app = workflow.compile()
