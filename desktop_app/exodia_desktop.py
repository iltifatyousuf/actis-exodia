import customtkinter as ctk
import requests
import threading
import time
import json
import random

# Configure modern dark theme
ctk.set_appearance_mode("Dark")
ctk.set_default_color_theme("green")

class ExodiaDesktop(ctk.CTk):
    def __init__(self):
        super().__init__()

        self.title("Exodia - Autonomous Command Center")
        self.geometry("1100x700")
        
        # Grid layout
        self.grid_rowconfigure(0, weight=1)
        self.grid_columnconfigure(1, weight=1)

        # ─── SIDEBAR ───
        self.sidebar = ctk.CTkFrame(self, width=200, corner_radius=0, fg_color="#111111")
        self.sidebar.grid(row=0, column=0, sticky="nsew")
        self.sidebar.grid_rowconfigure(5, weight=1)

        self.logo = ctk.CTkLabel(self.sidebar, text="EXODIA", font=ctk.CTkFont(size=24, weight="bold"))
        self.logo.grid(row=0, column=0, padx=20, pady=(30, 30))

        self.btn_dash = ctk.CTkButton(self.sidebar, text="Dashboard", fg_color="#222222", hover_color="#333333", anchor="w")
        self.btn_dash.grid(row=1, column=0, padx=20, pady=10)
        self.btn_agents = ctk.CTkButton(self.sidebar, text="AI Agents", fg_color="transparent", hover_color="#333333", anchor="w")
        self.btn_agents.grid(row=2, column=0, padx=20, pady=10)
        self.btn_graph = ctk.CTkButton(self.sidebar, text="Threat Graph", fg_color="transparent", hover_color="#333333", anchor="w")
        self.btn_graph.grid(row=3, column=0, padx=20, pady=10)

        # API Status
        self.api_status = ctk.CTkLabel(self.sidebar, text="● Gateway Offline", text_color="#FF4444", font=ctk.CTkFont(size=12, weight="bold"))
        self.api_status.grid(row=6, column=0, padx=20, pady=20, sticky="s")

        # ─── MAIN CONTENT ───
        self.main_view = ctk.CTkFrame(self, fg_color="#181818", corner_radius=0)
        self.main_view.grid(row=0, column=1, sticky="nsew", padx=20, pady=20)
        self.main_view.grid_columnconfigure((0, 1, 2, 3), weight=1)
        self.main_view.grid_rowconfigure(2, weight=1)

        self.header = ctk.CTkLabel(self.main_view, text="Autonomous Defense Dashboard", font=ctk.CTkFont(size=28, weight="bold"))
        self.header.grid(row=0, column=0, columnspan=4, sticky="w", pady=(0, 20))

        # Metric Cards
        self.card1 = self.create_metric_card(self.main_view, "Kafka Stream", "0 MB/s", 1, 0)
        self.card2 = self.create_metric_card(self.main_view, "AI Confidence", "0%", 1, 1)
        self.card3 = self.create_metric_card(self.main_view, "Processed", "0", 1, 2)
        self.card4 = self.create_metric_card(self.main_view, "MTTR", "340ms", 1, 3)

        # Console Stream
        self.console_frame = ctk.CTkFrame(self.main_view, fg_color="#111111", corner_radius=10)
        self.console_frame.grid(row=2, column=0, columnspan=4, sticky="nsew", pady=(20, 0))
        self.console_frame.grid_columnconfigure(0, weight=1)
        self.console_frame.grid_rowconfigure(1, weight=1)

        self.console_title = ctk.CTkLabel(self.console_frame, text="LIVE NEURAL STREAM", font=ctk.CTkFont(size=12, weight="bold"), text_color="#555555")
        self.console_title.grid(row=0, column=0, sticky="w", padx=15, pady=(10, 0))

        self.console_box = ctk.CTkTextbox(self.console_frame, fg_color="#111111", text_color="#00FF41", font=ctk.CTkFont(family="Consolas", size=13))
        self.console_box.grid(row=1, column=0, sticky="nsew", padx=10, pady=10)
        self.console_box.configure(state="disabled")

        # Start background polling thread
        self.running = True
        threading.Thread(target=self.poll_gateway, daemon=True).start()
        threading.Thread(target=self.simulate_stream, daemon=True).start()

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
                    
                    # Update Cards via main thread
                    self.after(0, self.card1.configure, {"text": f"{data['kafka_ingest_rate_mb']} MB/s"})
                    self.after(0, self.card2.configure, {"text": f"{data['ai_confidence_score']}%"})
                    self.after(0, self.card3.configure, {"text": f"{data['threats_processed']:,}"})
                else:
                    self.api_status.configure(text="● API Error", text_color="#FF4444")
            except Exception:
                self.api_status.configure(text="● Gateway Offline", text_color="#FF4444")
            
            time.sleep(2)

    def simulate_stream(self):
        """Generates fake streaming events since we aren't using websockets here for simplicity"""
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
