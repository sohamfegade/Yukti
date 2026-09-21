from pydantic import BaseModel, Field
from typing import List, Tuple, Dict, Optional, Any

# A coordinate is represented as [x, y]
Coord = Tuple[int, int]

class GridRequest(BaseModel):
    width: int = Field(default=20, ge=5, le=100)
    height: int = Field(default=20, ge=5, le=100)
    start: Coord
    goal: Coord
    obstacles: List[Coord] = []
    # Using string representation for dict keys because JSON keys must be strings
    # Format: "x,y" -> weight
    weights: Dict[str, float] = {}

class SearchRequest(BaseModel):
    grid: GridRequest
    algorithm: str # "BFS", "DFS", "UCS", "GREEDY", "ASTAR"
    heuristic: Optional[str] = "manhattan" # "manhattan", "euclidean"

class StepTrace(BaseModel):
    step: int
    current_node: Optional[Coord] = None
    frontier: List[Coord] = []
    visited: List[Coord] = []
    action: str
    g_cost: Optional[float] = None
    h_cost: Optional[float] = None
    f_cost: Optional[float] = None

class SearchResult(BaseModel):
    path: List[Coord] = []
    path_cost: float = 0.0
    nodes_explored: int = 0
    execution_time_ms: float = 0.0
    success: bool = False

class SearchResponse(BaseModel):
    algorithm: str
    trace: List[StepTrace]
    result: SearchResult

class CompareRequest(BaseModel):
    grid: GridRequest
    algorithms: List[str] # e.g., ["BFS", "ASTAR"]

class CompareResponse(BaseModel):
    results: Dict[str, SearchResponse]
