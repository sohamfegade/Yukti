from sqlalchemy import Column, Integer, String, DateTime, Text
from datetime import datetime, timezone
from database.connection import Base

class ExperimentHistory(Base):
    __tablename__ = "experiment_history"

    id = Column(Integer, primary_key=True, index=True)
    algorithm_type = Column(String, index=True) # e.g., 'search', 'game', 'bayesian'
    algorithm_name = Column(String) # e.g., 'A*', 'Minimax'
    parameters = Column(Text) # JSON string of parameters
    result = Column(Text) # JSON string of results
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
