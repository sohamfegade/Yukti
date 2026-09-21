from pydantic import BaseModel
from typing import List, Optional

class BayesianNode(BaseModel):
    id: str
    label: str
    probability: float # Current marginal probability

class BayesianEdge(BaseModel):
    source: str
    target: str
    label: str # e.g. "Likelihood P(E|D)"

class BayesianNetwork(BaseModel):
    nodes: List[BayesianNode]
    edges: List[BayesianEdge]

class InferenceRequest(BaseModel):
    prior: float # P(D)
    true_positive_rate: float # P(E|D)
    false_positive_rate: float # P(E|~D)
    evidence_observed: bool # Did E occur?

class InferenceResponse(BaseModel):
    prior: float
    likelihood: float # P(E|D) or P(~E|D)
    marginal_evidence: float # P(E) or P(~E)
    posterior: float # P(D|E) or P(D|~E)
    network: BayesianNetwork
    calculation_steps: List[str]
