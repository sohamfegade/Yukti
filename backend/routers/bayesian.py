from fastapi import APIRouter, HTTPException
from schemas.bayesian import InferenceRequest, InferenceResponse
from algorithms.bayesian.inference import BayesianEngine

router = APIRouter(prefix="/bayesian", tags=["Probabilistic Intelligence"])

@router.post("/infer", response_model=InferenceResponse)
def infer_probabilities(req: InferenceRequest):
    try:
        return BayesianEngine.infer(req)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
