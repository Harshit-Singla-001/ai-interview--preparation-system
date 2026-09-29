#!/usr/bin/env python3
"""
=============================================================================
 AI INTERVIEW PREPARATION SYSTEM
 Single-File Application Launcher (app.py)
=============================================================================
 Usage:
     python app.py

 This script:
  1. Reads configuration from .env (Port, Gemini Key, Model)
  2. Verifies dependencies for server and client
  3. Launches Backend API (Node.js/Express) and Frontend (Vite/React)
  4. Automatically opens your browser to the web application
  5. Provides clean graceful shutdown on Ctrl+C
=============================================================================
"""

import os
import sys
import time
import subprocess
import webbrowser
from pathlib import Path

# Paths
ROOT_DIR = Path(__file__).resolve().parent
SERVER_DIR = ROOT_DIR / "server"
CLIENT_DIR = ROOT_DIR / "client"
ENV_FILE = ROOT_DIR / ".env"

def load_env():
    """Simple parser for root .env file"""
    env_vars = {
        "PORT": "5000",
        "CLIENT_PORT": "5173",
        "GEMINI_MODEL": "gemini-3.6-flash"
    }
    if ENV_FILE.exists():
        with open(ENV_FILE, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    key, val = line.split("=", 1)
                    env_vars[key.strip()] = val.strip()
    return env_vars

def print_banner(server_port, client_port, gemini_model):
    print("\n" + "=" * 68)
    print("  🧠 AI INTERVIEW PREPARATION SYSTEM")
    print("  Search Algorithms (AI Lab Syllabus) & Generative AI")
    print("=" * 68)
    print(f"  ► Client Interface   : http://localhost:{client_port}")
    print(f"  ► Backend API Engine : http://localhost:{server_port}")
    print(f"  ► Health Check URL   : http://localhost:{server_port}/api/health")
    print(f"  ► Active AI Model    : {gemini_model}")
    print("=" * 68)
    print("  Press Ctrl + C at any time to stop the application.")
    print("=" * 68 + "\n")

def check_dependencies():
    """Ensure npm packages exist or install them"""
    if not (SERVER_DIR / "node_modules").exists():
        print("[Launcher] Installing server packages (npm install in /server)...")
        subprocess.run(["npm", "install"], cwd=str(SERVER_DIR), shell=True, check=True)

    if not (CLIENT_DIR / "node_modules").exists():
        print("[Launcher] Installing client packages (npm install in /client)...")
        subprocess.run(["npm", "install"], cwd=str(CLIENT_DIR), shell=True, check=True)

def main():
    env_vars = load_env()
    server_port = env_vars.get("PORT", "5000")
    client_port = env_vars.get("CLIENT_PORT", "5173")
    gemini_model = env_vars.get("GEMINI_MODEL", "gemini-3.6-flash")

    print("[Launcher] Verifying application environment...")
    check_dependencies()

    print_banner(server_port, client_port, gemini_model)

    processes = []
    try:
        # Start Node.js Backend Server
        print(f"[Launcher] Starting Backend Server on port {server_port}...")
        server_proc = subprocess.Popen(
            ["node", "server.js"],
            cwd=str(SERVER_DIR),
            shell=True
        )
        processes.append(server_proc)

        # Start React/Vite Client
        print(f"[Launcher] Starting Vite React Client on port {client_port}...")
        client_proc = subprocess.Popen(
            ["npm", "run", "dev"],
            cwd=str(CLIENT_DIR),
            shell=True
        )
        processes.append(client_proc)

        # Give servers 2 seconds to initialize, then launch browser
        time.sleep(2)
        target_url = f"http://localhost:{client_port}"
        print(f"[Launcher] Opening web application at {target_url} ...")
        webbrowser.open(target_url)

        # Keep launcher running until interrupted
        while True:
            time.sleep(1)

    except KeyboardInterrupt:
        print("\n[Launcher] Shutting down application servers gracefully...")
        for p in processes:
            try:
                p.terminate()
            except Exception:
                pass
        print("[Launcher] AI Interview Preparation System stopped.")
        sys.exit(0)

if __name__ == "__main__":
    main()
