import os
from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
import asyncio
import random
import json

app = FastAPI(title="Exodia API Gateway")

ALLOWED_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:3000,https://actis-exodia.vercel.app").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/v1/health")
def health_check():
    return {"status": "online", "services": ["kafka", "flink", "langgraph", "qdrant"]}

@app.get("/api/v1/metrics")
def get_metrics():
    """Returns the current state of the architecture to the dashboard."""
    return {
        "kafka_ingest_rate_mb": random.randint(1100, 1300),
        "ai_confidence_score": round(random.uniform(85.0, 99.9), 1),
        "threats_processed": 320491,
        "active_nodes": 4,
        "qdrant_vectors": "8.4M"
    }

@app.websocket("/api/v1/stream")
async def websocket_endpoint(websocket: WebSocket):
    """
    Simulates a live WebSocket stream of Kafka network events being processed by the AI.
    The Next.js frontend connects to this to animate the dashboard.
    """
    await websocket.accept()
    try:
        while True:
            # In production, this reads from the 'enriched-alerts' Kafka topic
            event = {
                "type": random.choice(["SQL_INJECTION", "PORT_SCAN", "DDOS_ATTACK", "DATA_EXFILTRATION"]),
                "confidence": round(random.uniform(70.0, 99.9), 1),
                "action": random.choice(["BLOCKED", "ISOLATED", "HUMAN_REVIEW"]),
                "latency_ms": random.randint(120, 850)
            }
            await websocket.send_text(json.dumps(event))
            await asyncio.sleep(2) # Send a new threat every 2 seconds
    except Exception as e:
        print(f"Client disconnected: {e}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8080)
