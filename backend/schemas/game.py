from pydantic import BaseModel
from typing import List, Optional, Literal

# Board representation: 9 elements. "X", "O", or "" (empty)
Board = List[str]

class GameState(BaseModel):
    board: Board
    player: Literal["X", "O"] # The player whose turn it is to move
    algorithm: Literal["MINIMAX", "ALPHABETA"]
    max_depth: Optional[int] = None

class TreeNode(BaseModel):
    id: str
    board: Board
    player: str
    move: Optional[int] = None # The move that led to this node (0-8)
    score: Optional[int] = None
    is_pruned: bool = False
    alpha: Optional[float] = None
    beta: Optional[float] = None
    children: List['TreeNode'] = []

# Necessary for self-referential Pydantic models
TreeNode.model_rebuild()

class AnalyzeResponse(BaseModel):
    best_move: int
    score: int
    nodes_evaluated: int
    nodes_pruned: int
    tree: TreeNode
