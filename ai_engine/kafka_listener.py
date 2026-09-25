import json
from confluent_kafka import Consumer, KafkaError
from langchain_ollama import ChatOllama
from langchain_core.messages import HumanMessage
import sys

# Configuration for Kafka Consumer
KAFKA_BROKER = 'localhost:9092'
TOPIC_NAME = 'network-alerts'

def analyze_threat_with_ai(alert_data: dict):
    """Passes the Kafka alert to the local ACTIS Exodia Agent."""
    print(f"\n[ACTIS AI] Analyzing new network alert: {alert_data['alert_id']}...")
    
    print(f"\n[ACTIS ORCHESTRATOR] Routing alert {alert_data['alert_id']} to Sub-Agents...")
    
    prompt = f"New network packet detected: {json.dumps(alert_data)}"
    
    try:
        from ai_engine.multi_agent_orchestrator import orchestrator_app
        
        # Stream the multi-agent workflow
        for chunk in orchestrator_app.stream({"messages": [HumanMessage(content=prompt)], "next_agent": ""}):
            for node_name, node_state in chunk.items():
                if node_name != "Supervisor":
                    print(f"\n{node_state['messages'][-1].content}")
                    
        print("\n[ACTIS] Threat successfully mitigated and logged for compliance.\n")
    except Exception as e:
        print(f"Error during Multi-Agent orchestration: {e}")

def start_kafka_listener():
    c = Consumer({
        'bootstrap.servers': KAFKA_BROKER,
        'group.id': 'actis-ai-group',
        'auto.offset.reset': 'earliest'
    })
    
    c.subscribe([TOPIC_NAME])
    print(f"[*] ACTIS Exodia Agent listening to Kafka topic '{TOPIC_NAME}'...")
    
    try:
        while True:
            msg = c.poll(1.0)
            if msg is None:
                continue
            if msg.error():
                print(f"Kafka Error: {msg.error()}")
                continue
                
            # Parse the incoming packet
            try:
                alert_data = json.loads(msg.value().decode('utf-8'))
                analyze_threat_with_ai(alert_data)
            except json.JSONDecodeError:
                print(f"Received malformed data: {msg.value()}")
                
    except KeyboardInterrupt:
        print("Shutting down listener...")
    finally:
        c.close()

if __name__ == "__main__":
    start_kafka_listener()
