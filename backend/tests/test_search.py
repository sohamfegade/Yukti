import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_bfs_unweighted():
    payload = {
        "grid": {
            "width": 10,
            "height": 10,
            "start": [0, 0],
            "goal": [0, 2],
            "obstacles": [[0, 1]],
            "weights": {}
        },
        "algorithm": "BFS"
    }
    
    response = client.post("/api/search/run", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["algorithm"] == "BFS"
    assert data["result"]["success"] == True
    # The shortest path should go around the obstacle: [0,0] -> [1,0] -> [1,1] -> [1,2] -> [0,2] (length 4)
    assert data["result"]["path_cost"] == 4.0

def test_astar_weighted():
    payload = {
        "grid": {
            "width": 10,
            "height": 10,
            "start": [0, 0],
            "goal": [0, 2],
            "obstacles": [],
            "weights": {"0,1": 10.0} # Cell directly between start and goal is very expensive
        },
        "algorithm": "ASTAR"
    }
    
    response = client.post("/api/search/run", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["algorithm"] == "ASTAR"
    assert data["result"]["success"] == True
    # The shortest path goes around the expensive cell, taking 4 steps with cost 4.0
    # Directly going through [0,1] would cost 1 + 10 = 11.0 (actually start to 0,1 is 10, 0,1 to 0,2 is 1 => 11)
    assert data["result"]["path_cost"] == 4.0

def test_no_path():
    payload = {
        "grid": {
            "width": 10,
            "height": 10,
            "start": [0, 0],
            "goal": [0, 2],
            "obstacles": [[0, 1], [1, 0], [1, 1], [1, 2], [-1, 1]], # Surrounded
            "weights": {}
        },
        "algorithm": "DFS"
    }
    
    response = client.post("/api/search/run", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["result"]["success"] == False
    assert len(data["result"]["path"]) == 0
