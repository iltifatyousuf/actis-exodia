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
    
    # Initialize our local, offline Llama 3.2 model
    llm = ChatOllama(model="llama3.2", temperature=0)
    
    prompt = f"""
    You are ACTIS Exodia, an elite cybersecurity threat hunter.
    Analyze the following network packet alert and determine if it is a threat:
    {json.dumps(alert_data, indent=2)}
    
    Output a short threat assessment.
    """
    
    # In a full LangGraph setup, we would route this to tools (Qdrant, Pinecone) here.
    try:
        response = llm.invoke([HumanMessage(content=prompt)])
        print(f"\n[ACTIS ASSESSMENT]\n{response.content}\n")
    except Exception as e:
        print(f"Error during AI analysis: {e}")

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
