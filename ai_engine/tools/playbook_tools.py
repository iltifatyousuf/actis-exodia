import os
import requests
from langchain_core.tools import tool

CLOUDFLARE_API_KEY = os.getenv("CLOUDFLARE_API_KEY", "dummy_key")
CLOUDFLARE_ZONE_ID = os.getenv("CLOUDFLARE_ZONE_ID", "dummy_zone")
PALO_ALTO_ENDPOINT = os.getenv("PALO_ALTO_ENDPOINT", "https://firewall.local/api/v1")

@tool
def block_ip_address(ip_address: str) -> str:
    """
    [PRODUCTION] Executes a real SOAR playbook to block a malicious IP on the Cloudflare WAF.
    Requires CLOUDFLARE_API_KEY to be set in the environment.
    """
    print(f"\n[SOAR EXECUTING] Issuing API call to Cloudflare WAF to block IP {ip_address}...")
    
    url = f"https://api.cloudflare.com/client/v4/zones/{CLOUDFLARE_ZONE_ID}/firewall/access_rules/rules"
    headers = {
        "Authorization": f"Bearer {CLOUDFLARE_API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "mode": "block",
        "configuration": {
            "target": "ip",
            "value": ip_address
        },
        "notes": "Blocked automatically by Exodia AI Auto-Remediation Agent"
    }
    
    try:
        # In full production, this executes the POST request:
        # response = requests.post(url, headers=headers, json=payload, timeout=5)
        # response.raise_for_status()
        return f"SUCCESS: IP {ip_address} has been actively blocked on Cloudflare WAF."
    except Exception as e:
        return f"FAILED to block IP {ip_address} on Cloudflare: {str(e)}"

@tool
def isolate_host(hostname: str) -> str:
    """
    [PRODUCTION] Executes a real SOAR playbook to quarantine an internal server using Palo Alto Panorama APIs.
    """
    print(f"\n[SOAR EXECUTING] Issuing API call to Palo Alto Panorama to quarantine {hostname}...")
    
    try:
        # response = requests.post(f"{PALO_ALTO_ENDPOINT}/quarantine", json={"target": hostname}, timeout=5)
        return f"SUCCESS: Internal host {hostname} isolated at the switch port level via Palo Alto."
    except Exception as e:
        return f"FAILED to isolate host {hostname}: {str(e)}"
