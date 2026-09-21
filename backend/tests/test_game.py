import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_minimax_winning_move():
    # Board where X can win immediately by playing at index 2
    # X O .
    # X . .
    # . O .
    payload = {
        "board": ["X", "O", "", "X", "", "", "", "O", ""],
        "player": "X",
        "algorithm": "MINIMAX",
        "max_depth": 9
    }
    
    response = client.post("/api/game/analyze", json=payload)
    assert response.status_code == 200
    data = response.json()
    
    assert data["best_move"] == 6 # Wait, index 6 is bottom left, X would win on left col. Let's trace it: 0, 3 are X. 6 makes 0,3,6 a win!
    assert data["score"] > 0 # Winning score

def test_alphabeta_pruning():
    # Empty board should evaluate much faster with AlphaBeta
    payload_mm = {
        "board": ["", "", "", "", "", "", "", "", ""],
        "player": "X",
        "algorithm": "MINIMAX",
        "max_depth": 4 # limit depth so test is fast
    }
    
    payload_ab = {
        "board": ["", "", "", "", "", "", "", "", ""],
        "player": "X",
        "algorithm": "ALPHABETA",
        "max_depth": 4
    }
    
    res_mm = client.post("/api/game/analyze", json=payload_mm).json()
    res_ab = client.post("/api/game/analyze", json=payload_ab).json()
    
    assert res_mm["best_move"] == res_ab["best_move"]
    # AlphaBeta should evaluate fewer nodes
    assert res_ab["nodes_evaluated"] < res_mm["nodes_evaluated"]
    assert res_ab["nodes_pruned"] > 0
