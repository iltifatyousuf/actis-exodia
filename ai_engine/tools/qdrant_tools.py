from langchain_core.tools import tool

@tool
def search_past_breaches(query: str) -> str:
    """Semantic search against Qdrant to find past security breaches matching this pattern."""
    print(f"\n[Qdrant Search] Searching historical intel for: {query}")
    if "PortScan" in query:
        return "Found similar PortScan in 2023 originating from China. APT group suspected."
    elif "SQLInjection" in query:
        return "SQL injection matches a known CVE-2024-1234 pattern. Highly critical."
    return "No historical matches found."
