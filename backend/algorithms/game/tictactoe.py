import math
import uuid
from typing import List, Tuple, Dict, Any, Optional
from schemas.game import GameState, TreeNode, AnalyzeResponse, Board

# Helper to check for a winner
def check_winner(board: Board) -> Optional[str]:
    winning_combinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], # rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], # cols
        [0, 4, 8], [2, 4, 6]             # diagonals
    ]
    for combo in winning_combinations:
        a, b, c = combo
        if board[a] and board[a] == board[b] == board[c] and board[a] != "":
            return board[a]
    return None

def is_draw(board: Board) -> bool:
    return "" not in board

def evaluate(board: Board, maximizing_player: str) -> int:
    winner = check_winner(board)
    if winner == maximizing_player:
        return 10
    elif winner:
        return -10
    return 0

def get_available_moves(board: Board) -> List[int]:
    return [i for i, val in enumerate(board) if val == ""]

class GameIntelligence:
    def __init__(self, state: GameState):
        self.state = state
        self.maximizing_player = state.player
        self.minimizing_player = "O" if state.player == "X" else "X"
        self.nodes_evaluated = 0
        self.nodes_pruned = 0

    def analyze(self) -> AnalyzeResponse:
        self.nodes_evaluated = 0
        self.nodes_pruned = 0
        
        root_id = str(uuid.uuid4())
        
        if self.state.algorithm == "MINIMAX":
            score, best_move, tree = self.minimax(
                self.state.board, 
                0, 
                True, 
                self.state.max_depth or 9, 
                root_id
            )
        else:
            score, best_move, tree = self.alphabeta(
                self.state.board, 
                0, 
                -math.inf, 
                math.inf, 
                True, 
                self.state.max_depth or 9, 
                root_id
            )
            
        tree.move = best_move # set the root move to the best move for UI convenience
            
        return AnalyzeResponse(
            best_move=best_move if best_move is not None else -1,
            score=score,
            nodes_evaluated=self.nodes_evaluated,
            nodes_pruned=self.nodes_pruned,
            tree=tree
        )

    def minimax(self, board: Board, depth: int, is_maximizing: bool, max_depth: int, node_id: str, move: Optional[int] = None) -> Tuple[int, Optional[int], TreeNode]:
        self.nodes_evaluated += 1
        current_player = self.maximizing_player if is_maximizing else self.minimizing_player
        
        node = TreeNode(
            id=node_id,
            board=board.copy(),
            player=current_player,
            move=move,
            children=[]
        )
        
        score = evaluate(board, self.maximizing_player)
        if score == 10:
            node.score = score - depth # Prefer winning faster
            return node.score, None, node
        if score == -10:
            node.score = score + depth # Prefer losing slower
            return node.score, None, node
        if is_draw(board) or depth == max_depth:
            node.score = 0
            return 0, None, node
            
        moves = get_available_moves(board)
        best_move = None
        
        if is_maximizing:
            best_score = -math.inf
            for m in moves:
                new_board = board.copy()
                new_board[m] = self.maximizing_player
                child_id = str(uuid.uuid4())
                eval_score, _, child_node = self.minimax(new_board, depth + 1, False, max_depth, child_id, m)
                node.children.append(child_node)
                
                if eval_score > best_score:
                    best_score = eval_score
                    best_move = m
            node.score = int(best_score)
            return int(best_score), best_move, node
        else:
            best_score = math.inf
            for m in moves:
                new_board = board.copy()
                new_board[m] = self.minimizing_player
                child_id = str(uuid.uuid4())
                eval_score, _, child_node = self.minimax(new_board, depth + 1, True, max_depth, child_id, m)
                node.children.append(child_node)
                
                if eval_score < best_score:
                    best_score = eval_score
                    best_move = m
            node.score = int(best_score)
            return int(best_score), best_move, node

    def alphabeta(self, board: Board, depth: int, alpha: float, beta: float, is_maximizing: bool, max_depth: int, node_id: str, move: Optional[int] = None) -> Tuple[int, Optional[int], TreeNode]:
        self.nodes_evaluated += 1
        current_player = self.maximizing_player if is_maximizing else self.minimizing_player
        
        node = TreeNode(
            id=node_id,
            board=board.copy(),
            player=current_player,
            move=move,
            alpha=alpha,
            beta=beta,
            children=[]
        )
        
        score = evaluate(board, self.maximizing_player)
        if score == 10:
            node.score = score - depth
            return node.score, None, node
        if score == -10:
            node.score = score + depth
            return node.score, None, node
        if is_draw(board) or depth == max_depth:
            node.score = 0
            return 0, None, node
            
        moves = get_available_moves(board)
        best_move = None
        
        if is_maximizing:
            best_score = -math.inf
            for i, m in enumerate(moves):
                new_board = board.copy()
                new_board[m] = self.maximizing_player
                child_id = str(uuid.uuid4())
                
                eval_score, _, child_node = self.alphabeta(new_board, depth + 1, alpha, beta, False, max_depth, child_id, m)
                node.children.append(child_node)
                
                if eval_score > best_score:
                    best_score = eval_score
                    best_move = m
                    
                alpha = max(alpha, eval_score)
                node.alpha = alpha
                
                if beta <= alpha:
                    # Prune remaining moves
                    self.nodes_pruned += (len(moves) - 1 - i)
                    # We can add dummy pruned nodes to the tree for visualization
                    for pruned_m in moves[i+1:]:
                        pruned_board = board.copy()
                        pruned_board[pruned_m] = self.maximizing_player
                        node.children.append(TreeNode(
                            id=str(uuid.uuid4()),
                            board=pruned_board,
                            player=self.minimizing_player, # next turn player
                            move=pruned_m,
                            is_pruned=True
                        ))
                    break
                    
            node.score = int(best_score)
            return int(best_score), best_move, node
        else:
            best_score = math.inf
            for i, m in enumerate(moves):
                new_board = board.copy()
                new_board[m] = self.minimizing_player
                child_id = str(uuid.uuid4())
                
                eval_score, _, child_node = self.alphabeta(new_board, depth + 1, alpha, beta, True, max_depth, child_id, m)
                node.children.append(child_node)
                
                if eval_score < best_score:
                    best_score = eval_score
                    best_move = m
                    
                beta = min(beta, eval_score)
                node.beta = beta
                
                if beta <= alpha:
                    self.nodes_pruned += (len(moves) - 1 - i)
                    for pruned_m in moves[i+1:]:
                        pruned_board = board.copy()
                        pruned_board[pruned_m] = self.minimizing_player
                        node.children.append(TreeNode(
                            id=str(uuid.uuid4()),
                            board=pruned_board,
                            player=self.maximizing_player, # next turn player
                            move=pruned_m,
                            is_pruned=True
                        ))
                    break
                    
            node.score = int(best_score)
            return int(best_score), best_move, node
