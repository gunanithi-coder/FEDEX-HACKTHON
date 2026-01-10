from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import random
import hashlib
import datetime

# --- 1. DEFINE THE AI & BLOCKCHAIN CLASSES HERE (Safe Mode) ---

class FedExPriorityAI:
    def predict_priority(self, data):
        # Simple logic: High amount + Old debt = High Priority
        score = (data["amount"] * 0.01) + (data["age"] * 2)
        return min(int(score), 99) # Cap at 99

class AuditGuard:
    def create_block(self, case_id, dca_name, status):
        # Generate a real SHA-256 Hash
        raw_data = f"{case_id}-{dca_name}-{status}-{datetime.datetime.now()}"
        secure_hash = hashlib.sha256(raw_data.encode()).hexdigest()
        return {"audit_hash": "0x" + secure_hash[:16] + "..."}

# --- 2. FASTAPI SETUP ---

app = FastAPI(title="FedEx Intellect-DCA API")

# ENABLE CORS (Crucial for React to talk to Python)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allows all origins (safe for hackathon)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Engines
ai_engine = FedExPriorityAI()
guard = AuditGuard()

# --- 3. ENDPOINTS ---

@app.get("/")
def health_check():
    return {"status": "active", "system": "FedEx Intellect-DCA"}

@app.get("/process_debt")
def get_dashboard_data():
    """
    This is what your React App calls when it loads.
    It generates 5 realistic cases using your AI & Blockchain logic.
    """
    dummy_cases = [
        {"id": "FED-10042", "amt": 5000, "age": 45},
        {"id": "FED-10045", "amt": 1200, "age": 15},
        {"id": "FED-10088", "amt": 8900, "age": 60},
        {"id": "FED-10102", "amt": 3400, "age": 30},
        {"id": "FED-10115", "amt": 6700, "age": 50},
    ]
    
    response_data = []
    
    for case in dummy_cases:
        # 1. AI Logic
        priority = ai_engine.predict_priority({"amount": case["amt"], "age": case["age"]})
        
        # 2. Blockchain Logic
        audit = guard.create_block(case["id"], "FedEx-Internal", "AUTO_SCANNED")
        
        # 3. Build Response
        response_data.append({
            "case_id": case["id"],
            "priority_score": priority,
            "audit_trail": audit
        })
        
    return response_data