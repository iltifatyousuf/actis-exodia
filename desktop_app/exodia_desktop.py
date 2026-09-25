import customtkinter as ctk
import requests
import threading
import time
import json
import random
import os
import sys
import subprocess
from PIL import Image
import webbrowser

# Configure modern dark theme
ctk.set_appearance_mode("Dark")
ctk.set_default_color_theme("green")

def get_asset_path(filename):
    if hasattr(sys, '_MEIPASS'):
        return os.path.join(sys._MEIPASS, 'desktop_app', filename)
    return os.path.join(os.path.dirname(os.path.abspath(__file__)), filename)

class ExodiaDesktop(ctk.CTk):
    def __init__(self):
        super().__init__()

        self.title("Exodia - Autonomous Command Center")
        self.geometry("1280x800")
        
        try:
            self.iconbitmap(get_asset_path("logo.ico"))
        except Exception:
            pass
        
        self.grid_rowconfigure(0, weight=1)
        self.grid_columnconfigure(1, weight=1)

        # ─── SIDEBAR ───
        self.sidebar = ctk.CTkFrame(self, width=260, corner_radius=0, fg_color="#111111")
        self.sidebar.grid(row=0, column=0, sticky="nsew")
        self.sidebar.grid_rowconfigure(7, weight=1)

        try:
            logo_path = get_asset_path("logo.png")
            pil_img = Image.open(logo_path)
            self.logo_img = ctk.CTkImage(light_image=pil_img, dark_image=pil_img, size=(200, 150))
            self.logo = ctk.CTkLabel(self.sidebar, text="", image=self.logo_img)
        except Exception:
            self.logo = ctk.CTkLabel(self.sidebar, text="EXODIA", font=ctk.CTkFont(size=24, weight="bold"))
        self.logo.grid(row=0, column=0, padx=20, pady=(40, 40))

        self.btn_dash = ctk.CTkButton(self.sidebar, text="Dashboard", fg_color="#222222", hover_color="#333333", anchor="w", command=lambda: self.select_tab("dashboard"))
        self.btn_dash.grid(row=1, column=0, padx=20, pady=10, sticky="ew")
        
        self.btn_agents = ctk.CTkButton(self.sidebar, text="AI Swarm Control", fg_color="transparent", hover_color="#333333", anchor="w", command=lambda: self.select_tab("agents"))
        self.btn_agents.grid(row=2, column=0, padx=20, pady=10, sticky="ew")
        
        self.btn_graph = ctk.CTkButton(self.sidebar, text="Threat Graph", fg_color="transparent", hover_color="#333333", anchor="w", command=lambda: self.select_tab("graph"))
        self.btn_graph.grid(row=3, column=0, padx=20, pady=10, sticky="ew")
        
        self.btn_playbooks = ctk.CTkButton(self.sidebar, text="SOAR Playbooks", fg_color="transparent", hover_color="#333333", anchor="w", command=lambda: self.select_tab("playbooks"))
        self.btn_playbooks.grid(row=4, column=0, padx=20, pady=10, sticky="ew")

        self.btn_settings = ctk.CTkButton(self.sidebar, text="Settings", fg_color="transparent", hover_color="#333333", anchor="w", command=lambda: self.select_tab("settings"))
        self.btn_settings.grid(row=5, column=0, padx=20, pady=10, sticky="ew")

        self.api_status = ctk.CTkLabel(self.sidebar, text="● Gateway Offline", text_color="#FF4444", font=ctk.CTkFont(size=12, weight="bold"))
        self.api_status.grid(row=8, column=0, padx=20, pady=20, sticky="s")

        # ─── MAIN CONTENT ───
        self.main_container = ctk.CTkFrame(self, fg_color="#181818", corner_radius=0)
        self.main_container.grid(row=0, column=1, sticky="nsew")
        self.main_container.grid_rowconfigure(0, weight=1)
        self.main_container.grid_columnconfigure(0, weight=1)
        
        self.frames = {}
        self.demo_mode = True
        self.agent_process = None
        self.edr_process = None
        
        self.build_dashboard_view()
        self.build_agents_view()
        self.build_graph_view()
        self.build_playbooks_view()
        self.build_settings_view()

        self.select_tab("dashboard")

        self.running = True
        threading.Thread(target=self.poll_gateway, daemon=True).start()
        threading.Thread(target=self.simulate_stream, daemon=True).start()

    def select_tab(self, tab_name):
        buttons = {"dashboard": self.btn_dash, "agents": self.btn_agents, "graph": self.btn_graph, "playbooks": self.btn_playbooks, "settings": self.btn_settings}
        for name, btn in buttons.items():
            if name == tab_name:
                btn.configure(fg_color="#222222")
            else:
                btn.configure(fg_color="transparent")
        
        for frame in self.frames.values():
            frame.grid_forget()
        self.frames[tab_name].grid(row=0, column=0, sticky="nsew", padx=20, pady=20)

    # ─── VIEWS ───

    def build_dashboard_view(self):
        frame = ctk.CTkFrame(self.main_container, fg_color="transparent")
        self.frames["dashboard"] = frame
        frame.grid_columnconfigure((0, 1, 2, 3), weight=1)
        frame.grid_rowconfigure(2, weight=1)

        self.header = ctk.CTkLabel(frame, text="Autonomous Defense Dashboard", font=ctk.CTkFont(size=28, weight="bold"))
        self.header.grid(row=0, column=0, columnspan=2, sticky="w", pady=(0, 20))

        btn_edr = ctk.CTkButton(frame, text="🛡 Arm Live EDR Sensor", fg_color="#1E90FF", hover_color="#4169E1", command=self.toggle_edr)
        btn_edr.grid(row=0, column=2, sticky="e", pady=(0, 20), padx=10)

        btn_inject = ctk.CTkButton(frame, text="⚠ Inject Chaos Threat", fg_color="#8B0000", hover_color="#A52A2A", command=self.inject_threat)
        btn_inject.grid(row=0, column=3, sticky="e", pady=(0, 20))

        self.card1 = self.create_metric_card(frame, "Kafka Stream", "0 MB/s", 1, 0)
        self.card2 = self.create_metric_card(frame, "AI Confidence", "0%", 1, 1)
        self.card3 = self.create_metric_card(frame, "Processed", "0", 1, 2)
        self.card4 = self.create_metric_card(frame, "MTTR", "340ms", 1, 3)

        self.console_frame = ctk.CTkFrame(frame, fg_color="#111111", corner_radius=10)
        self.console_frame.grid(row=2, column=0, columnspan=4, sticky="nsew", pady=(20, 0))
        self.console_frame.grid_columnconfigure(0, weight=1)
        self.console_frame.grid_rowconfigure(1, weight=1)

        self.console_title = ctk.CTkLabel(self.console_frame, text="LIVE NEURAL STREAM", font=ctk.CTkFont(size=12, weight="bold"), text_color="#555555")
        self.console_title.grid(row=0, column=0, sticky="w", padx=15, pady=(10, 0))

        self.console_box = ctk.CTkTextbox(self.console_frame, fg_color="#111111", text_color="#00FF41", font=ctk.CTkFont(family="Consolas", size=13))
        self.console_box.grid(row=1, column=0, sticky="nsew", padx=10, pady=10)
        self.console_box.configure(state="disabled")

    def build_agents_view(self):
        frame = ctk.CTkFrame(self.main_container, fg_color="transparent")
        self.frames["agents"] = frame
        frame.grid_columnconfigure(0, weight=1)
        frame.grid_rowconfigure(2, weight=1)

        title = ctk.CTkLabel(frame, text="LangGraph Orchestrator", font=ctk.CTkFont(size=28, weight="bold"))
        title.grid(row=0, column=0, sticky="w", pady=(0, 10))

        controls = ctk.CTkFrame(frame, fg_color="transparent")
        controls.grid(row=1, column=0, sticky="ew", pady=(0, 10))
        
        self.btn_start_agents = ctk.CTkButton(controls, text="▶ Boot Swarm", fg_color="#006400", hover_color="#008000", command=self.start_agent_swarm)
        self.btn_start_agents.pack(side="left", padx=(0, 10))

        self.btn_stop_agents = ctk.CTkButton(controls, text="■ Shutdown Swarm", fg_color="#8B0000", hover_color="#A52A2A", state="disabled", command=self.stop_agent_swarm)
        self.btn_stop_agents.pack(side="left")

        self.agent_console = ctk.CTkTextbox(frame, fg_color="#0a0a0a", text_color="#D3D3D3", font=ctk.CTkFont(family="Consolas", size=13))
        self.agent_console.grid(row=2, column=0, sticky="nsew")

    def build_graph_view(self):
        frame = ctk.CTkFrame(self.main_container, fg_color="transparent")
        self.frames["graph"] = frame
        
        title = ctk.CTkLabel(frame, text="Neo4j Threat Graph", font=ctk.CTkFont(size=28, weight="bold"))
        title.pack(anchor="w", pady=(0, 10))
        
        desc = ctk.CTkLabel(frame, text="Visualize IP -> ASN -> APT -> CVE relationships mapped by the knowledge graph.", font=ctk.CTkFont(size=14), text_color="#888888")
        desc.pack(anchor="w", pady=(0, 20))

        btn = ctk.CTkButton(frame, text="Launch Neo4j Browser", font=ctk.CTkFont(weight="bold"), command=lambda: webbrowser.open("http://localhost:7474"))
        btn.pack(anchor="w")

    def build_playbooks_view(self):
        frame = ctk.CTkFrame(self.main_container, fg_color="transparent")
        self.frames["playbooks"] = frame

        title = ctk.CTkLabel(frame, text="SOAR Playbooks", font=ctk.CTkFont(size=28, weight="bold"))
        title.pack(anchor="w", pady=(0, 20))

        rules = [
            ("Cloudflare WAF IP Ban (Severity Critical)", True),
            ("CrowdStrike EDR Host Isolation (Confidence > 90%)", True),
            ("Slack Approval Webhook (Confidence < 70%)", True),
            ("AWS IAM Policy Revocation", False)
        ]

        for text, state in rules:
            switch = ctk.CTkSwitch(frame, text=text, font=ctk.CTkFont(size=14))
            switch.pack(anchor="w", pady=10)
            if state:
                switch.select()

    def build_settings_view(self):
        frame = ctk.CTkFrame(self.main_container, fg_color="transparent")
        self.frames["settings"] = frame

        title = ctk.CTkLabel(frame, text="Settings & Configuration", font=ctk.CTkFont(size=28, weight="bold"))
        title.pack(anchor="w", pady=(0, 20))

        self.demo_toggle = ctk.CTkSwitch(frame, text="Enable Demo Mode (Simulate Telemetry Stream)", command=self.toggle_demo)
        self.demo_toggle.pack(anchor="w", pady=10)
        self.demo_toggle.select()

        ctk.CTkLabel(frame, text="OpenAI API Key").pack(anchor="w", pady=(20, 5))
        ctk.CTkEntry(frame, width=400, placeholder_text="sk-proj-...").pack(anchor="w")

        ctk.CTkLabel(frame, text="Kafka Broker").pack(anchor="w", pady=(20, 5))
        ctk.CTkEntry(frame, width=400, placeholder_text="localhost:9092").pack(anchor="w")

    # ─── LOGIC ───

    def create_metric_card(self, parent, title, val, row, col):
        frame = ctk.CTkFrame(parent, fg_color="#222222", corner_radius=15)
        frame.grid(row=row, column=col, sticky="nsew", padx=5, pady=5)
        lbl_title = ctk.CTkLabel(frame, text=title.upper(), font=ctk.CTkFont(size=11, weight="bold"), text_color="#777777")
        lbl_title.pack(anchor="w", padx=15, pady=(15, 0))
        lbl_val = ctk.CTkLabel(frame, text=val, font=ctk.CTkFont(size=28, weight="bold"))
        lbl_val.pack(anchor="w", padx=15, pady=(0, 15))
        return lbl_val

    def log_console(self, msg):
        self.console_box.configure(state="normal")
        timestamp = time.strftime("%H:%M:%S")
        self.console_box.insert("end", f"[{timestamp}] {msg}\n")
        self.console_box.see("end")
        self.console_box.configure(state="disabled")
        
    def log_agent(self, msg):
        self.agent_console.configure(state="normal")
        self.agent_console.insert("end", f"{msg}\n")
        self.agent_console.see("end")
        self.agent_console.configure(state="disabled")

    def toggle_demo(self):
        self.demo_mode = bool(self.demo_toggle.get())
        if self.demo_mode:
            self.log_console(">> DEMO MODE ENABLED: Streaming simulated telemetry...")
        else:
            self.log_console(">> DEMO MODE DISABLED: Listening strictly for real Kafka events.")

    def inject_threat(self):
        self.log_console(">> INJECTING REAL CHAOS THREAT INTO KAFKA...")
        try:
            # Assuming running from ACTIS_Exodia root, try to call threat_generator.py
            # If path doesn't exist, just simulate for the UI
            script_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "ai_engine", "threat_generator.py")
            if os.path.exists(script_path):
                subprocess.Popen([sys.executable, script_path], stdout=subprocess.DEVNULL)
                self.log_console(">> Payload generated and pushed to topic 'exodia-alerts'.")
            else:
                self.log_console(">> Payload simulated: (threat_generator.py not found).")
        except Exception as e:
            self.log_console(f">> Injection failed: {e}")

    def start_agent_swarm(self):
        self.btn_start_agents.configure(state="disabled")
        self.btn_stop_agents.configure(state="normal")
        self.log_agent(">>> BOOTING EXODIA MULTI-AGENT SWARM (POWERED BY OLLAMA LLAMA 3.2)...")
        
        script_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "ai_engine", "kafka_listener.py")
        if os.path.exists(script_path):
            self.agent_process = subprocess.Popen(
                [sys.executable, "-u", script_path], 
                stdout=subprocess.PIPE, 
                stderr=subprocess.STDOUT, 
                text=True, 
                bufsize=1
            )
            threading.Thread(target=self.stream_agent_output, daemon=True).start()
        else:
            self.log_agent(f"ERROR: Could not locate {script_path}")
            self.log_agent("Running in UI Mock Mode. Agents will not actually process Kafka topics.")

    def stream_agent_output(self):
        if self.agent_process:
            for line in iter(self.agent_process.stdout.readline, ''):
                self.after(0, self.log_agent, line.strip())
            self.agent_process.stdout.close()
            self.agent_process.wait()

    def stop_agent_swarm(self):
        if self.agent_process:
            self.agent_process.terminate()
            self.agent_process = None
        self.log_agent(">>> SWARM SHUTDOWN COMPLETE.")
        self.btn_start_agents.configure(state="normal")
        self.btn_stop_agents.configure(state="disabled")

    def poll_gateway(self):
        while self.running:
            try:
                resp = requests.get("http://localhost:8080/api/v1/metrics", timeout=2)
                if resp.status_code == 200:
                    data = resp.json()
                    self.api_status.configure(text="● Gateway Online", text_color="#00FF41")
                    self.after(0, self.card1.configure, {"text": f"{data['kafka_ingest_rate_mb']} MB/s"})
                    self.after(0, self.card2.configure, {"text": f"{data['ai_confidence_score']}%"})
                    self.after(0, self.card3.configure, {"text": f"{data['threats_processed']:,}"})
                else:
                    self.api_status.configure(text="● API Error", text_color="#FF4444")
            except Exception:
                self.api_status.configure(text="● Gateway Offline", text_color="#FF4444")
            time.sleep(2)

    def simulate_stream(self):
        types = ["SQL_INJECTION", "DATA_EXFILTRATION", "SSH_BRUTE_FORCE", "HONEYPOT_TRIPWIRE"]
        actions = ["BLOCKED via WAF", "ISOLATED via EDR", "ROUTED TO HUMAN"]
        
        while self.running:
            time.sleep(random.randint(1, 4))
            if self.demo_mode:
                event_type = random.choice(types)
                ip = f"{random.randint(10,255)}.{random.randint(0,255)}.{random.randint(0,255)}.{random.randint(1,255)}"
                action = random.choice(actions)
                log_msg = f"[AGENT:REMEDIATION] Threat: {event_type} | Source: {ip} | Decision: {action}"
                self.after(0, self.log_console, log_msg)

    def toggle_edr(self):
        if self.edr_process:
            self.edr_process.terminate()
            self.edr_process = None
            self.log_console(">> LIVE EDR SENSOR DISARMED.")
        else:
            self.log_console(">> ARMING LIVE EDR NETWORK SENSOR...")
            self.demo_mode = False
            self.demo_toggle.deselect()
            script_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "ai_engine", "edr_sensor.py")
            if os.path.exists(script_path):
                self.edr_process = subprocess.Popen(
                    [sys.executable, script_path], 
                    stdout=subprocess.PIPE, 
                    stderr=subprocess.STDOUT, 
                    text=True, 
                    bufsize=1
                )
                threading.Thread(target=self.stream_edr_output, daemon=True).start()
            else:
                self.log_console(">> ERROR: edr_sensor.py not found.")

    def stream_edr_output(self):
        if self.edr_process:
            for line in iter(self.edr_process.stdout.readline, ''):
                self.after(0, self.log_console, line.strip())
            self.edr_process.wait()

if __name__ == "__main__":
    app = ExodiaDesktop()
    app.mainloop()
