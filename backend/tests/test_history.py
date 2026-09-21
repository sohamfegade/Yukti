import pytest
from fastapi.testclient import TestClient
from main import app
from database.connection import Base, engine, get_db
from sqlalchemy.orm import sessionmaker

# Use the same database engine as the main app for simplicity in this demo, 
# but wrap in a transaction or clear table if needed.
# Since we are using an in-memory or a local SQLite, we can just clear it.

client = TestClient(app)

def setup_module(module):
    Base.metadata.create_all(bind=engine)

def teardown_module(module):
    # Optionally drop tables or clean up
    pass

def test_create_and_get_history():
    # 1. Create a history entry
    payload = {
        "algorithm_type": "search",
        "algorithm_name": "A*",
        "parameters": '{"grid_size": 10}',
        "result": '{"path": [[0,0], [0,1]]}'
    }
    
    response = client.post("/api/history/", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["algorithm_type"] == "search"
    assert data["algorithm_name"] == "A*"
    history_id = data["id"]
    
    # 2. Get the history list
    response = client.get("/api/history/")
    assert response.status_code == 200
    data_list = response.json()
    assert len(data_list) >= 1
    assert any(item["id"] == history_id for item in data_list)
    
    # 3. Delete the history entry
    response = client.delete(f"/api/history/{history_id}")
    assert response.status_code == 204
    
    # 4. Verify it's deleted
    response = client.get("/api/history/")
    data_list = response.json()
    assert not any(item["id"] == history_id for item in data_list)

def test_delete_nonexistent_history():
    response = client.delete("/api/history/999999")
    assert response.status_code == 404
