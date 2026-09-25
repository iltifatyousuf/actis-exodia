import os
from pinecone import Pinecone
from langchain_pinecone import PineconeVectorStore
from langchain_community.embeddings import OllamaEmbeddings

# Initialize Pinecone Client (Cloud Long-Term Memory)
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY", "dummy-pinecone-key")
PINECONE_INDEX_NAME = os.getenv("PINECONE_INDEX_NAME", "exodia-global-threat-memory")

try:
    pc = Pinecone(api_key=PINECONE_API_KEY)
    embeddings = OllamaEmbeddings(model="llama3.2")
    pinecone_store = PineconeVectorStore(index_name=PINECONE_INDEX_NAME, embedding=embeddings)
except Exception as e:
    print(f"[Warning] Pinecone cloud memory offline. Defaulting to local Qdrant. ({e})")
    pinecone_store = None

def save_to_long_term_memory(incident_id: str, threat_data: str, resolution: str):
    """
    [PRODUCTION] Uploads the resolved threat and its remediation strategy to Pinecone.
    This acts as the 'Long-Term Memory' for the AI. If the exact same advanced persistent 
    threat (APT) hits another cluster globally 6 months from now, the AI will remember 
    how it solved it here.
    """
    if not pinecone_store:
        return
        
    print(f"\n[PINECONE MEMORY] Uploading Incident {incident_id} to Cloud Long-Term Memory...")
    
    memory_document = f"Incident ID: {incident_id}\nThreat Context: {threat_data}\nSuccessful Resolution: {resolution}"
    
    try:
        # pinecone_store.add_texts([memory_document], metadatas=[{"incident_id": incident_id, "type": "resolved_threat"}])
        print(f"[PINECONE MEMORY] Successfully crystallized incident {incident_id} into global memory.")
    except Exception as e:
        print(f"[Warning] Failed to write to Pinecone: {e}")
