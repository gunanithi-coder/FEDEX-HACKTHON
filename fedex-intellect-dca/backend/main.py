from fastapi import FastAPI
from backend.models.priority_engine import FedExPriorityAI
from blockchain_audit.ledger_audit import AuditGuard # Assuming your file name

app = FastAPI(title="FedEx Intellect-DCA API")
ai_engine = FedExPriorityAI()
guard = AuditGuard()

@app.get("/")
def health_check():
    return {"status": "active", "system": "FedEx Intellect-DCA"}

@app.post("/process_debt")
def process_new_debt(case_id: str, amount: float, age: int, dca_name: str):
    """
    1. AI Prioritizes
    2. Blockchain Logs
    3. Returns Data for Dashboard
    """
    # 1. AI Logic
    priority_score = ai_engine.predict_priority({"amount": amount, "age": age})
    
    # 2. Blockchain Audit Trail
    audit_log = guard.create_block(case_id, dca_name, "ALLOCATED")
    
    return {
        "case_id": case_id,
        "priority_score": priority_score,
        "audit_trail": audit_log
    }