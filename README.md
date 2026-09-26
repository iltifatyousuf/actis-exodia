<div align="center">
  <img src="desktop_app/logo.png" alt="Exodia Logo" width="200"/>
  <h1>Exodia v2.0</h1>
  <p><b>Enterprise Autonomous Cyber Threat Intelligence System</b></p>
</div>

---

## 🛡️ Overview

Exodia is a military-grade, fully autonomous, AI-driven cybersecurity command center. Originally designed as a web-based prototype, Exodia v2.0 is now a lightning-fast, standalone Windows desktop application. 

It is designed to ingest raw network telemetry, analyze zero-day threats using a localized swarm of AI agents, and execute automated remediation playbooks—all in sub-second response times, and **100% offline** without relying on external cloud LLM providers.

---

## ✨ Key Features

- 🧠 **100% Offline AI Swarm:** Powered by a local **Ollama** instance running Llama 3.2. No data ever leaves your perimeter.
- 🤖 **LangGraph Multi-Agent Pipeline:** Threats are routed through a 4-stage state machine:
  1. **Threat Agent:** Maps IP vectors to known APT groups and queries historical CVEs.
  2. **Guardrails Agent:** Calculates confidence scores. Low-confidence or highly sensitive actions are automatically routed to a human review queue.
  3. **Remediation Agent:** Automatically generates Suricata IDS signatures and executes network isolation playbooks.
  4. **Compliance Agent:** Maps all automated actions to SOC2 (CC6.1) and ISO27001 requirements, maintaining a tamper-proof audit trail.
- 🎯 **"Live Fire" EDR Sensor:** A built-in network monitor that actively scans your host machine's TCP/UDP sockets, flagging suspicious background processes making outbound connections.
- 🕸️ **Embedded Threat Graph:** A native, interactive topology map visualizing attacker IPs, internal assets, CVEs, and APT clusters in real-time.
- ⚡ **Redis Hot-Caching:** Prevents AI hallucination and saves massive compute by instantly dropping duplicate DDOS/Brute-Force IPs.

---

## 🏗️ Architecture

`mermaid
graph TD
    A[Live EDR Sensor] -->|Network Telemetry| B(Apache Kafka Topic: enriched-alerts)
    B --> C{Redis Hot-Cache}
    C -->|Duplicate IP| D[Drop Event]
    C -->|Novel Threat| E[LangGraph Orchestrator]
    
    subgraph Local AI Swarm
    E --> F[Threat Agent]
    F --> G[Guardrails Agent]
    G -->|Confidence < 80%| H[Human Review Queue]
    G -->|Confidence > 80%| I[Remediation Agent]
    I --> J[Compliance Agent]
    end
    
    I --> K[Suricata Rule Gen]
    I --> L[WAF / Host Isolation]
    J --> M[SIEM Audit Log]
    
    N[Exodia Desktop UI] --- B
    N --- E
`

---

## 🚀 Getting Started

### Prerequisites
- Python 3.11+
- Docker Desktop (for Kafka & Redis)
- Ollama (with the llama3.2 model pulled: ollama run llama3.2)

### Installation & Build
Exodia is compiled into a single, portable Windows executable using PyInstaller.

1. **Clone the repository:**
   \\\ash
   git clone https://github.com/iltifatyousuf/exodia.git
   cd exodia
   \\\

2. **Set up the virtual environment:**
   \\\ash
   python -m venv venv
   .\venv\Scripts\activate
   pip install -r requirements.txt
   \\\

3. **Compile the executable:**
   \\\ash
   .\venv\Scripts\python.exe -m PyInstaller --noconsole --onefile --hidden-import PIL --hidden-import PIL._tkinter_finder --hidden-import networkx --hidden-import matplotlib --hidden-import neo4j --add-data "venv\Lib\site-packages\customtkinter;customtkinter\" --add-data "desktop_app\logo.png;desktop_app\" --add-data "desktop_app\logo.ico;desktop_app\" --add-data "config;config\" --icon "desktop_app\logo.ico" --name Exodia desktop_app\exodia_desktop.py
   \\\

4. **Launch:**
   Run the generated dist/Exodia.exe.

---

## 📂 Project Structure

- \i_engine/\: The brains of the operation. Contains the LangGraph agents, Ollama connectors, tool definitions, and the live EDR sensor.
- \pi_gateway/\: FastAPI backend for Prometheus metrics and system health checks.
- \config/\: Persistent configuration (exodia_config.json) for API keys and playbook toggles.
- \desktop_app/\: The CustomTkinter Python source code for the native GUI and threat graph.
- \logs/\: Local storage for compliance audits, generated firewall rules, and human review queues.

---

> **Note:** Exodia v2.0 represents a complete transition from the original "ACTIS" web prototype. All mock functions have been removed, and the system is fully hardened for local, enterprise-grade deployment.
