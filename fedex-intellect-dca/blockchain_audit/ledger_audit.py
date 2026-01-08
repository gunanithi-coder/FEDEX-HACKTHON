import hashlib
import time

class AuditGuard:
    """
    Ensures 'Stronger governance and compliance'[cite: 28].
    Fixes the 'Minimal audit trail' defect.
    """
    def create_block(self, case_id, dca_name, action):
        timestamp = time.time()
        # Create a unique SHA-256 hash for this transaction
        raw_data = f"{case_id}-{dca_name}-{action}-{timestamp}"
        secure_hash = hashlib.sha256(raw_data.encode()).hexdigest()
        
        return {
            "case_id": case_id,
            "owner": dca_name,
            "status": action,
            "audit_hash": secure_hash,
            "timestamp": timestamp
        }