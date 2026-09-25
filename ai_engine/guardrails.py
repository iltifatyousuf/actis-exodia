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

import os
import requests

def send_to_human_review_queue(alert_data_str: str, ai_analysis: str):
    """
    Simulates pushing a low-confidence decision to a human SOC analyst via Slack/Teams.
    """
    print("\n==================================================")
    print("🚨 [GUARDRAILS TRIGGERED] LOW AI CONFIDENCE SCORE 🚨")
    print("==================================================")
    print("Routing incident to Human-in-the-Loop Review Queue (Slack)...")
    
    slack_payload = {
        "text": "🚨 *Exodia Autonomous SOC: Human Approval Required* 🚨",
        "blocks": [
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": f"*AI Reasoning (Low Confidence):*\n{ai_analysis}"
                }
            },
            {
                "type": "actions",
                "elements": [
                    {
                        "type": "button",
                        "text": {"type": "plain_text", "text": "Approve Block", "emoji": True},
                        "style": "primary",
                        "value": "approve"
                    },
                    {
                        "type": "button",
                        "text": {"type": "plain_text", "text": "Deny & Ignore", "emoji": True},
                        "style": "danger",
                        "value": "deny"
                    }
                ]
            }
        ]
    }
    
    # In production, uncomment to send real webhook:
    # webhook_url = os.getenv("SLACK_WEBHOOK_URL", "")
    # if webhook_url:
    #     requests.post(webhook_url, json=slack_payload, timeout=3)
    
    print("[Slack Integration] Interactive Webhook payload generated and sent.")
    print("Awaiting manual SOC Analyst approval before auto-remediation...")
    print("==================================================\n")
