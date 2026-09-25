import customtkinter as ctk
import requests
import threading
import time
import json
import random
import os
import sys
from PIL import Image

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
        self.geometry("1100x700")
        
        # Grid layout
        self.grid_rowconfigure(0, weight=1)
        self.grid_columnconfigure(1, weight=1)

        # ─── SIDEBAR ───
        self.sidebar = ctk.CTkFrame(self, width=220, corner_radius=0, fg_color="#111111")
        self.sidebar.grid(row=0, column=0, sticky="nsew")
        self.sidebar.grid_rowconfigure(7, weight=1)

        # Logo Image
        try:
            logo_path = get_asset_path("logo.png")
            pil_img = Image.open(logo_path)
            self.logo_img = ctk.CTkImage(light_image=pil_img, dark_image=pil_img, size=(120, 90))
            self.logo = ctk.CTkLabel(self.sidebar, text="", image=self.logo_img)
        except Exception:
            self.logo = ctk.CTkLabel(self.sidebar, text="EXODIA", font=ctk.CTkFont(size=24, weight="bold"))
        self.logo.grid(row=0, column=0, padx=20, pady=(30, 30))

        # Navigation Buttons
        self.btn_dash = ctk.CTkButton(self.sidebar, text="Dashboard", fg_color="#222222", hover_color="#333333", anchor="w", command=lambda: self.select_tab("dashboard"))
        self.btn_dash.grid(row=1, column=0, padx=20, pady=10, sticky="ew")
        
        self.btn_agents = ctk.CTkButton(self.sidebar, text="AI Agents", fg_color="transparent", hover_color="#333333", anchor="w", command=lambda: self.select_tab("agents"))
        self.btn_agents.grid(row=2, column=0, padx=20, pady=10, sticky="ew")
        
        self.btn_graph = ctk.CTkButton(self.sidebar, text="Threat Graph", fg_color="transparent", hover_color="#333333", anchor="w", command=lambda: self.select_tab("graph"))
        self.btn_graph.grid(row=3, column=0, padx=20, pady=10, sticky="ew")
        
        self.btn_playbooks = ctk.CTkButton(self.sidebar, text="SOAR Playbooks", fg_color="transparent", hover_color="#333333", anchor="w", command=lambda: self.select_tab("playbooks"))
        self.btn_playbooks.grid(row=4, column=0, padx=20, pady=10, sticky="ew")

        self.btn_settings = ctk.CTkButton(self.sidebar, text="Settings", fg_color="transparent", hover_color="#333333", anchor="w", command=lambda: self.select_tab("settings"))
        self.btn_settings.grid(row=5, column=0, padx=20, pady=10, sticky="ew")

        # API Status
        self.api_status = ctk.CTkLabel(self.sidebar, text="● Gateway Offline", text_color="#FF4444", font=ctk.CTkFont(size=12, weight="bold"))
        self.api_status.grid(row=8, column=0, padx=20, pady=20, sticky="s")

        # ─── MAIN CONTENT CONTAINER ───
        self.main_container = ctk.CTkFrame(self, fg_color="#181818", corner_radius=0)
        self.main_container.grid(row=0, column=1, sticky="nsew")
        self.main_container.grid_rowconfigure(0, weight=1)
        self.main_container.grid_columnconfigure(0, weight=1)
        
        # Dictionary to store all frames
        self.frames = {}
        
        # Build views
        self.build_dashboard_view()
        self.build_placeholder_view("agents", "Autonomous AI Agents", "Manage the Threat Analyst, Remediation, and Compliance agents. View LLM reasoning logs here.")
        self.build_placeholder_view("graph", "Neo4j Threat Graph", "Visualize IP -> ASN -> APT -> CVE relationships mapped by the knowledge graph.")
        self.build_placeholder_view("playbooks", "SOAR Playbooks", "View active auto-remediation rules (Cloudflare WAF bans, CrowdStrike host isolation).")
        self.build_placeholder_view("settings", "Configuration", "System settings, LLM temperature controls, and Kafka broker endpoints.")

        # Show Dashboard initially
        self.select_tab("dashboard")

        # Background processes
        self.running = True
        threading.Thread(target=self.poll_gateway, daemon=True).start()
        threading.Thread(target=self.simulate_stream, daemon=True).start()

    def select_tab(self, tab_name):
        # Reset button colors
        buttons = {"dashboard": self.btn_dash, "agents": self.btn_agents, "graph": self.btn_graph, "playbooks": self.btn_playbooks, "settings": self.btn_settings}
        for name, btn in buttons.items():
            if name == tab_name:
                btn.configure(fg_color="#222222")
            else:
                btn.configure(fg_color="transparent")
        
        # Show correct frame
        for frame in self.frames.values():
            frame.grid_forget()
        self.frames[tab_name].grid(row=0, column=0, sticky="nsew", padx=20, pady=20)

    def build_dashboard_view(self):
        dash_frame = ctk.CTkFrame(self.main_container, fg_color="transparent")
        self.frames["dashboard"] = dash_frame
        
        dash_frame.grid_columnconfigure((0, 1, 2, 3), weight=1)
        dash_frame.grid_rowconfigure(2, weight=1)

        self.header = ctk.CTkLabel(dash_frame, text="Autonomous Defense Dashboard", font=ctk.CTkFont(size=28, weight="bold"))
        self.header.grid(row=0, column=0, columnspan=4, sticky="w", pady=(0, 20))

        # Metric Cards
        self.card1 = self.create_metric_card(dash_frame, "Kafka Stream", "0 MB/s", 1, 0)
        self.card2 = self.create_metric_card(dash_frame, "AI Confidence", "0%", 1, 1)
        self.card3 = self.create_metric_card(dash_frame, "Processed", "0", 1, 2)
        self.card4 = self.create_metric_card(dash_frame, "MTTR", "340ms", 1, 3)

        # Console Stream
        self.console_frame = ctk.CTkFrame(dash_frame, fg_color="#111111", corner_radius=10)
        self.console_frame.grid(row=2, column=0, columnspan=4, sticky="nsew", pady=(20, 0))
        self.console_frame.grid_columnconfigure(0, weight=1)
        self.console_frame.grid_rowconfigure(1, weight=1)

        self.console_title = ctk.CTkLabel(self.console_frame, text="LIVE NEURAL STREAM", font=ctk.CTkFont(size=12, weight="bold"), text_color="#555555")
        self.console_title.grid(row=0, column=0, sticky="w", padx=15, pady=(10, 0))

        self.console_box = ctk.CTkTextbox(self.console_frame, fg_color="#111111", text_color="#00FF41", font=ctk.CTkFont(family="Consolas", size=13))
        self.console_box.grid(row=1, column=0, sticky="nsew", padx=10, pady=10)
        self.console_box.configure(state="disabled")

    def build_placeholder_view(self, name, title, desc):
        frame = ctk.CTkFrame(self.main_container, fg_color="transparent")
        self.frames[name] = frame
        
        title_lbl = ctk.CTkLabel(frame, text=title, font=ctk.CTkFont(size=28, weight="bold"))
        title_lbl.pack(anchor="w", pady=(0, 10))
        
        desc_lbl = ctk.CTkLabel(frame, text=desc, font=ctk.CTkFont(size=14), text_color="#888888")
        desc_lbl.pack(anchor="w")

    def create_metric_card(self, parent, title, val, row, col):
        frame = ctk.CTkFrame(parent, fg_color="#222222", corner_radius=15)
        frame.grid(row=row, column=col, sticky="nsew", padx=5, pady=5)
        
        lbl_title = ctk.CTkLabel(frame, text=title.upper(), font=ctk.CTkFont(size=11, weight="bold"), text_color="#777777")
        lbl_title.pack(anchor="w", padx=15, pady=(15, 0))
        
        lbl_val = ctk.CTkLabel(frame, text=val, font=ctk.CTkFont(size=28, weight="bold"))
        lbl_val.pack(anchor="w", padx=15, pady=(0, 15))
        
        return lbl_val

    def log_console(self, msg, color="#00FF41"):
        self.console_box.configure(state="normal")
        timestamp = time.strftime("%H:%M:%S")
        self.console_box.insert("end", f"[{timestamp}] {msg}\n")
        self.console_box.see("end")
        self.console_box.configure(state="disabled")

    def poll_gateway(self):
        """Polls the FastAPI backend for system metrics."""
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
            event_type = random.choice(types)
            ip = f"{random.randint(10,255)}.{random.randint(0,255)}.{random.randint(0,255)}.{random.randint(1,255)}"
            action = random.choice(actions)
            
            log_msg = f"[AGENT:REMEDIATION] Threat: {event_type} | Source: {ip} | Decision: {action}"
            self.after(0, self.log_console, log_msg)

if __name__ == "__main__":
    app = ExodiaDesktop()
    app.mainloop()
