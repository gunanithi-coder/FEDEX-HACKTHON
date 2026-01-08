import datetime

class SLAManager:
    """
    Enforces SOP-driven workflows and monitors SLA breaches.
    Rectifies: 'Delayed feedback loops' and 'Weak governance'.
    """
    def __init__(self):
        self.sla_threshold_hours = 48  # FedEx standard response time

    def evaluate_compliance(self, last_update_time):
        """
        Calculates if a DCA has breached the 48-hour response window.
        """
        now = datetime.datetime.now()
        time_diff = now - last_update_time
        hours_passed = time_diff.total_seconds() / 3600

        if hours_passed > self.sla_threshold_hours:
            return {
                "status": "NON_COMPLIANT",
                "action": "AUTO_REALLOCATE",  # Trigger for RPA/Agentic logic
                "delay": round(hours_passed - self.sla_threshold_hours, 1)
            }
        return {"status": "COMPLIANT", "action": "NONE"}