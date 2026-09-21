from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class ExperimentHistoryBase(BaseModel):
    algorithm_type: str
    algorithm_name: str
    parameters: str
    result: str

class ExperimentHistoryCreate(ExperimentHistoryBase):
    pass

class ExperimentHistory(ExperimentHistoryBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
