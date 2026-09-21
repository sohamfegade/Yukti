import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_bayesian_inference_positive_evidence():
    # Example: 1% disease prevalence, 90% true positive, 9% false positive
    payload = {
        "prior": 0.01,
        "true_positive_rate": 0.90,
        "false_positive_rate": 0.09,
        "evidence_observed": True
    }
    
    response = client.post("/api/bayesian/infer", json=payload)
    assert response.status_code == 200
    data = response.json()
    
    # Expected: 
    # P(E) = (0.90 * 0.01) + (0.09 * 0.99) = 0.009 + 0.0891 = 0.0981
    # P(D|E) = 0.009 / 0.0981 = 0.09174...
    
    assert abs(data["marginal_evidence"] - 0.0981) < 0.0001
    assert abs(data["posterior"] - 0.0917) < 0.001
    
def test_bayesian_inference_negative_evidence():
    payload = {
        "prior": 0.01,
        "true_positive_rate": 0.90,
        "false_positive_rate": 0.09,
        "evidence_observed": False
    }
    
    response = client.post("/api/bayesian/infer", json=payload)
    assert response.status_code == 200
    data = response.json()
    
    # Expected:
    # P(~E|D) = 0.10
    # P(~E|~D) = 0.91
    # P(~E) = (0.10 * 0.01) + (0.91 * 0.99) = 0.001 + 0.9009 = 0.9019
    # P(D|~E) = 0.001 / 0.9019 = 0.0011
    
    assert abs(data["posterior"] - 0.0011) < 0.001
