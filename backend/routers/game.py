from fastapi import APIRouter, HTTPException
from schemas.game import GameState, AnalyzeResponse
from algorithms.game.tictactoe import GameIntelligence

router = APIRouter(prefix="/game", tags=["Game Intelligence"])

@router.post("/analyze", response_model=AnalyzeResponse)
def analyze_game_state(state: GameState):
    try:
        ai = GameIntelligence(state)
        return ai.analyze()
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
