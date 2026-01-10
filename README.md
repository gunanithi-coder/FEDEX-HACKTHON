# 🛡️ FedEx Intellect-DCA: AI & Blockchain Governance Platform

![Status](https://img.shields.io/badge/Status-Live_Prototype-success) ![Tech](https://img.shields.io/badge/Stack-React_|_FastAPI_|_Blockchain-blue) ![FedEx](https://img.shields.io/badge/Focus-Smart_Debt_Recovery-purple)

## 🚀 Executive Summary
**FedEx Intellect-DCA** is a next-generation Debt Collection Agency (DCA) governance platform designed to minimize financial loss and ensure regulatory compliance. 

By integrating **AI-driven prioritization** with **Immutable Blockchain Audit Trails**, this solution provides a real-time command center for managing external recovery agencies.

---

## 💡 Key Features

###  🧠 AI Priority Engine
* Analyzes debt age, amount, and customer history.
* Assigns a **Priority Score (0-100)** to every case.
* **Impact:** Increases recovery rates by focusing on high-probability cases first.

###  ⛓️ Immutable Audit Ledger (Blockchain)
* Every case allocation is hashed using **SHA-256 encryption**.
* Creates a tamper-proof digital record of "Who, What, When".
* **Impact:** 100% Compliance with financial regulations.

###  ⏱️ Real-Time SLA Monitor
* Tracks the "Time-to-Action" for every assigned debt.
* **Live Countdowns:** Visual alerts for cases approaching the 48-hour breach threshold.
* **Auto-Escalation:** One-click legal escalation for critical breaches.

### 🖥️ Enterprise Command Center
* **Dual Theme Engine:** Professional "Slate Mist" Light Mode & Cyber-Security "Midnight Purple" Dark Mode.
* **Live Blockchain Ticker:** Real-time scrolling feed of mined blocks and recovery events.
* **Privacy Shield (GDPR Mode):** One-click toggle to mask sensitive PII (Personally Identifiable Information) for secure public demos.

### 🤖 GenAI Guardian Assistant
* **Context-Aware Chat:** Ask "Check FED-10042" to get instant risk analysis.
* **Auto-Draft Legal Notices:** Generates and downloads Level 3 Demand Letters instantly.
* **🎙️ Live Call Sentinel:** Simulates real-time audio analysis of agent-customer interactions, flagging angry sentiment and compliance threats.

### ⚙️ Operational Tools
* **AI Autopilot:** Simulates a live stream of incoming debt cases without manual input.
* **Manual Injection:** Form to manually upload high-priority cases to the blockchain ledger.
* **SLA Crisis Monitor:** Visual countdowns for critical cases with "Auto-Escalate" functionality.

---

---

## 🛠️ Tech Stack
* **Frontend:** React.js, Tailwind CSS, Recharts (Data Viz), Lucide React (Icons).
* **Backend:** Python FastAPI (Simulated for Demo).
* **Security:** SHA-256 Cryptographic Hashing.
* **Deployment:** Cloud-Ready Architecture.

---

## ⚡ DEPLOYMENT 

### Prerequisites
* Node.js & npm
* Python 3.9+

## ☁️ Option 1: Running in GitHub Codespaces (Cloud)
Use this if you are presenting directly from the Codespace browser.

 
 Open a NEW Terminal (Click the + icon in the terminal panel so you have two terminals).

* BACKEND :

Install Python Libraries:

```Bash
pip install fastapi uvicorn
```
Start the Server:

```Bash
uvicorn main:app --reload
 ```

* FRONTEND

* Navigate to the Frontend Folder:

```Bash
cd fedex-intellect-dca/frontend
```
* Install Dependencies (Only needed the first time):

```Bash
npm install
```
* Start the Server:

```Bash
npm start
```
Open the App:

Look at the bottom right corner for a popup saying "Application running at Port 3000".

Click "Open in Browser".

If the popup disappears: Click the PORTS tab (next to TERMINAL) -> Hover over "3000" -> Click the Globe Icon (Open in Browser).And make sure that port visibility is public if it in private change it into public 

💻 Option 2: Running on Local Machine (Windows/Mac)

Use this if you want to run it offline on your own laptop.

Open your Command Prompt (cmd) or PowerShell.

* Clone your Repository:
  
```Bash
git clone https://github.com/gunanithi-coder/FEDEX-HACKTHON.git
```
* Go into the Project Folder:

 Open a NEW Command Prompt/Terminal (Do not close the React one).
 
* BACKEND
* 
* Navigate to the Backend:

```Bash
cd FEDEX-HACKTHON/fedex-intellect-dca/backend
```
Install Libraries:

```Bash
pip install fastapi uvicorn
```
Start the Server:

```Bash
uvicorn main:app --reload
```
* FRONTEND
  
* Navigate to the Frontend:
  
```Bash
cd FEDEX-HACKTHON/fedex-intellect-dca/frontend
```
* Install the Libraries:

```Bash
npm install
```
(Note: This might take 1-2 minutes depending on your internet speed)

* Run the App:

```Bash
npm start
```

View the App:
It should automatically open your default web browser to http://localhost:3000.3.Backend 
