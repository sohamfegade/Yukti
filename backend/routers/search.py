from fastapi import APIRouter, HTTPException
from schemas.search import SearchRequest, SearchResponse, CompareRequest, CompareResponse
from algorithms.search.core import run_algorithm

router = APIRouter(prefix="/search", tags=["Search Intelligence"])

@router.post("/run", response_model=SearchResponse)
def run_search_algorithm(request: SearchRequest):
    try:
        return run_algorithm(request)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/compare", response_model=CompareResponse)
def compare_algorithms(request: CompareRequest):
    results = {}
    for algo in request.algorithms:
        search_req = SearchRequest(grid=request.grid, algorithm=algo, heuristic="manhattan")
        try:
            results[algo] = run_algorithm(search_req)
        except Exception as e:
            results[algo] = {"error": str(e)}
    
    return CompareResponse(results=results)
