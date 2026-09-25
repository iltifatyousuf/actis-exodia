import json

def evaluate_ai_confidence(ai_response: str) -> float:
    """
    Simulates a Guardrails/Eval layer.
    In production, this would use a secondary small LLM or a library like NeMo Guardrails
    to score the primary agent's output for hallucinations or low confidence.
    """
    # Simple heuristic: if the AI uses words indicating uncertainty, lower the score
    uncertainty_keywords = ["might", "unsure", "suspect", "possibly", "unclear", "cannot confirm"]
    
    score = 1.0
    for word in uncertainty_keywords:
        if word in ai_response.lower():
            score -= 0.2
            
    # Hardcode a low score for PortScans just to demonstrate the Human-In-The-Loop routing
    if "PortScan" in ai_response or "China" in ai_response:
        return 0.65
        
    return max(score, 0.0)

def send_to_human_review_queue(alert_data_str: str, ai_analysis: str):
    """
    Simulates pushing a low-confidence decision to a human SOC analyst via Slack/Jira.
    """
    print("\n==================================================")
    print("🚨 [GUARDRAILS TRIGGERED] LOW AI CONFIDENCE SCORE 🚨")
    print("==================================================")
    print("Routing incident to Human-in-the-Loop Review Queue (Jira)...")
    print(f"Context: {ai_analysis}")
    print("Awaiting manual SOC Analyst approval before auto-remediation...")
    print("==================================================\n")
