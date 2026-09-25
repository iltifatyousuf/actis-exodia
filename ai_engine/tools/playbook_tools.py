from langchain_core.tools import tool

@tool
def block_ip_address(ip_address: str) -> str:
    """Triggers a SOAR playbook to block an IP address on the Cloudflare WAF and Palo Alto firewalls."""
    print(f"\n[SOAR EXECUTED] Blocking IP {ip_address} globally...")
    return f"IP {ip_address} has been blacklisted on all edge firewalls."

@tool
def isolate_host(hostname: str) -> str:
    """Triggers a SOAR playbook to quarantine a server from the network."""
    print(f"\n[SOAR EXECUTED] Quarantining host {hostname}...")
    return f"Host {hostname} isolated at the switch port level."
