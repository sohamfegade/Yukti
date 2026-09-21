import time
import math
import heapq
from typing import List, Tuple, Dict, Set, Any
from schemas.search import GridRequest, SearchResponse, StepTrace, SearchResult

Coord = Tuple[int, int]

class GridSearch:
    def __init__(self, request: GridRequest):
        self.width = request.width
        self.height = request.height
        self.start = tuple(request.start)
        self.goal = tuple(request.goal)
        self.obstacles = set(tuple(o) for o in request.obstacles)
        self.weights = {tuple(map(int, k.split(','))): v for k, v in request.weights.items()}

    def is_valid(self, node: Coord) -> bool:
        x, y = node
        return (0 <= x < self.width and 
                0 <= y < self.height and 
                node not in self.obstacles)

    def get_neighbors(self, node: Coord) -> List[Coord]:
        # Up, Right, Down, Left (4-way connectivity)
        directions = [(0, -1), (1, 0), (0, 1), (-1, 0)]
        neighbors = []
        for dx, dy in directions:
            nx, ny = node[0] + dx, node[1] + dy
            if self.is_valid((nx, ny)):
                neighbors.append((nx, ny))
        return neighbors

    def get_cost(self, _from: Coord, _to: Coord) -> float:
        # Default cost is 1, override with weights if any
        return self.weights.get(_to, 1.0)

    def heuristic(self, node: Coord, method: str = "manhattan") -> float:
        if method == "euclidean":
            return math.sqrt((node[0] - self.goal[0])**2 + (node[1] - self.goal[1])**2)
        else: # manhattan
            return abs(node[0] - self.goal[0]) + abs(node[1] - self.goal[1])

def reconstruct_path(came_from: Dict[Coord, Coord], current: Coord) -> List[Coord]:
    path = [current]
    while current in came_from:
        current = came_from[current]
        path.append(current)
    path.reverse()
    return path

def run_bfs(grid: GridSearch) -> SearchResponse:
    start_time = time.perf_counter()
    trace: List[StepTrace] = []
    
    frontier = [grid.start]
    frontier_set = {grid.start}
    visited = set()
    came_from = {}
    
    step_count = 0
    trace.append(StepTrace(
        step=step_count, current_node=grid.start, frontier=list(frontier), visited=list(visited),
        action="Initialized BFS"
    ))
    
    success = False
    path = []
    
    while frontier:
        step_count += 1
        current = frontier.pop(0)
        frontier_set.remove(current)
        visited.add(current)
        
        trace.append(StepTrace(
            step=step_count, current_node=current, frontier=list(frontier), visited=list(visited),
            action=f"Popped node {current} from queue"
        ))
        
        if current == grid.goal:
            success = True
            path = reconstruct_path(came_from, current)
            trace.append(StepTrace(
                step=step_count+1, current_node=current, frontier=list(frontier), visited=list(visited),
                action="Goal found!"
            ))
            break
            
        for neighbor in grid.get_neighbors(current):
            if neighbor not in visited and neighbor not in frontier_set:
                came_from[neighbor] = current
                frontier.append(neighbor)
                frontier_set.add(neighbor)
                
        trace.append(StepTrace(
            step=step_count, current_node=current, frontier=list(frontier), visited=list(visited),
            action="Expanded neighbors"
        ))
        
    execution_time = (time.perf_counter() - start_time) * 1000
    path_cost = len(path) - 1 if path else 0.0 # Unweighted
    
    result = SearchResult(
        path=path,
        path_cost=path_cost,
        nodes_explored=len(visited),
        execution_time_ms=execution_time,
        success=success
    )
    
    return SearchResponse(algorithm="BFS", trace=trace, result=result)

def run_dfs(grid: GridSearch) -> SearchResponse:
    start_time = time.perf_counter()
    trace: List[StepTrace] = []
    
    frontier = [grid.start]
    frontier_set = {grid.start}
    visited = set()
    came_from = {}
    
    step_count = 0
    trace.append(StepTrace(
        step=step_count, current_node=grid.start, frontier=list(frontier), visited=list(visited),
        action="Initialized DFS"
    ))
    
    success = False
    path = []
    
    while frontier:
        step_count += 1
        current = frontier.pop()
        
        if current in visited:
            continue
            
        frontier_set.discard(current)
        visited.add(current)
        
        trace.append(StepTrace(
            step=step_count, current_node=current, frontier=list(frontier), visited=list(visited),
            action=f"Popped node {current} from stack"
        ))
        
        if current == grid.goal:
            success = True
            path = reconstruct_path(came_from, current)
            trace.append(StepTrace(
                step=step_count+1, current_node=current, frontier=list(frontier), visited=list(visited),
                action="Goal found!"
            ))
            break
            
        # Reverse to explore top/left first conceptually (depends on get_neighbors order)
        for neighbor in reversed(grid.get_neighbors(current)):
            if neighbor not in visited:
                came_from[neighbor] = current
                frontier.append(neighbor)
                frontier_set.add(neighbor)
                
        trace.append(StepTrace(
            step=step_count, current_node=current, frontier=list(frontier), visited=list(visited),
            action="Expanded neighbors"
        ))
        
    execution_time = (time.perf_counter() - start_time) * 1000
    path_cost = len(path) - 1 if path else 0.0
    
    result = SearchResult(
        path=path,
        path_cost=path_cost,
        nodes_explored=len(visited),
        execution_time_ms=execution_time,
        success=success
    )
    
    return SearchResponse(algorithm="DFS", trace=trace, result=result)

def run_ucs(grid: GridSearch) -> SearchResponse:
    start_time = time.perf_counter()
    trace: List[StepTrace] = []
    
    frontier = []
    heapq.heappush(frontier, (0.0, grid.start))
    frontier_costs = {grid.start: 0.0}
    visited = set()
    came_from = {}
    
    step_count = 0
    trace.append(StepTrace(
        step=step_count, current_node=grid.start, frontier=[n for _, n in frontier], visited=list(visited),
        action="Initialized UCS", g_cost=0.0
    ))
    
    success = False
    path = []
    final_cost = 0.0
    
    while frontier:
        step_count += 1
        current_cost, current = heapq.heappop(frontier)
        
        if current in visited:
            continue
            
        visited.add(current)
        
        trace.append(StepTrace(
            step=step_count, current_node=current, frontier=[n for _, n in frontier], visited=list(visited),
            action=f"Popped {current} with cost {current_cost:.1f}", g_cost=current_cost
        ))
        
        if current == grid.goal:
            success = True
            path = reconstruct_path(came_from, current)
            final_cost = current_cost
            trace.append(StepTrace(
                step=step_count+1, current_node=current, frontier=[n for _, n in frontier], visited=list(visited),
                action="Goal found!"
            ))
            break
            
        for neighbor in grid.get_neighbors(current):
            new_cost = current_cost + grid.get_cost(current, neighbor)
            
            if neighbor not in visited:
                if neighbor not in frontier_costs or new_cost < frontier_costs[neighbor]:
                    frontier_costs[neighbor] = new_cost
                    came_from[neighbor] = current
                    heapq.heappush(frontier, (new_cost, neighbor))
                    
        trace.append(StepTrace(
            step=step_count, current_node=current, frontier=[n for _, n in frontier], visited=list(visited),
            action="Expanded neighbors", g_cost=current_cost
        ))
        
    execution_time = (time.perf_counter() - start_time) * 1000
    
    result = SearchResult(
        path=path,
        path_cost=final_cost,
        nodes_explored=len(visited),
        execution_time_ms=execution_time,
        success=success
    )
    
    return SearchResponse(algorithm="UCS", trace=trace, result=result)

def run_greedy(grid: GridSearch, h_method: str = "manhattan") -> SearchResponse:
    start_time = time.perf_counter()
    trace: List[StepTrace] = []
    
    frontier = []
    heapq.heappush(frontier, (grid.heuristic(grid.start, h_method), grid.start))
    visited = set()
    came_from = {}
    
    step_count = 0
    trace.append(StepTrace(
        step=step_count, current_node=grid.start, frontier=[n for _, n in frontier], visited=list(visited),
        action="Initialized Greedy", h_cost=grid.heuristic(grid.start, h_method)
    ))
    
    success = False
    path = []
    
    while frontier:
        step_count += 1
        current_h, current = heapq.heappop(frontier)
        
        if current in visited:
            continue
            
        visited.add(current)
        
        trace.append(StepTrace(
            step=step_count, current_node=current, frontier=[n for _, n in frontier], visited=list(visited),
            action=f"Popped {current} with h={current_h:.1f}", h_cost=current_h
        ))
        
        if current == grid.goal:
            success = True
            path = reconstruct_path(came_from, current)
            trace.append(StepTrace(
                step=step_count+1, current_node=current, frontier=[n for _, n in frontier], visited=list(visited),
                action="Goal found!"
            ))
            break
            
        for neighbor in grid.get_neighbors(current):
            if neighbor not in visited:
                came_from[neighbor] = current
                h = grid.heuristic(neighbor, h_method)
                heapq.heappush(frontier, (h, neighbor))
                
        trace.append(StepTrace(
            step=step_count, current_node=current, frontier=[n for _, n in frontier], visited=list(visited),
            action="Expanded neighbors", h_cost=current_h
        ))
        
    execution_time = (time.perf_counter() - start_time) * 1000
    
    # Calculate true path cost
    path_cost = 0.0
    for i in range(len(path)-1):
        path_cost += grid.get_cost(path[i], path[i+1])
        
    result = SearchResult(
        path=path,
        path_cost=path_cost,
        nodes_explored=len(visited),
        execution_time_ms=execution_time,
        success=success
    )
    
    return SearchResponse(algorithm="GREEDY", trace=trace, result=result)

def run_astar(grid: GridSearch, h_method: str = "manhattan") -> SearchResponse:
    start_time = time.perf_counter()
    trace: List[StepTrace] = []
    
    frontier = []
    start_h = grid.heuristic(grid.start, h_method)
    heapq.heappush(frontier, (start_h, grid.start))
    
    g_costs = {grid.start: 0.0}
    visited = set()
    came_from = {}
    
    step_count = 0
    trace.append(StepTrace(
        step=step_count, current_node=grid.start, frontier=[n for _, n in frontier], visited=list(visited),
        action="Initialized A*", g_cost=0.0, h_cost=start_h, f_cost=start_h
    ))
    
    success = False
    path = []
    final_cost = 0.0
    
    while frontier:
        step_count += 1
        current_f, current = heapq.heappop(frontier)
        current_g = g_costs[current]
        
        if current in visited:
            continue
            
        visited.add(current)
        
        trace.append(StepTrace(
            step=step_count, current_node=current, frontier=[n for _, n in frontier], visited=list(visited),
            action=f"Popped {current} with f={current_f:.1f}", 
            g_cost=current_g, h_cost=current_f - current_g, f_cost=current_f
        ))
        
        if current == grid.goal:
            success = True
            path = reconstruct_path(came_from, current)
            final_cost = current_g
            trace.append(StepTrace(
                step=step_count+1, current_node=current, frontier=[n for _, n in frontier], visited=list(visited),
                action="Goal found!"
            ))
            break
            
        for neighbor in grid.get_neighbors(current):
            tentative_g = current_g + grid.get_cost(current, neighbor)
            
            if neighbor not in g_costs or tentative_g < g_costs[neighbor]:
                came_from[neighbor] = current
                g_costs[neighbor] = tentative_g
                h = grid.heuristic(neighbor, h_method)
                f = tentative_g + h
                heapq.heappush(frontier, (f, neighbor))
                
        trace.append(StepTrace(
            step=step_count, current_node=current, frontier=[n for _, n in frontier], visited=list(visited),
            action="Expanded neighbors", 
            g_cost=current_g, h_cost=current_f - current_g, f_cost=current_f
        ))
        
    execution_time = (time.perf_counter() - start_time) * 1000
    
    result = SearchResult(
        path=path,
        path_cost=final_cost,
        nodes_explored=len(visited),
        execution_time_ms=execution_time,
        success=success
    )
    
    return SearchResponse(algorithm="ASTAR", trace=trace, result=result)

def run_algorithm(request: SearchRequest) -> SearchResponse:
    grid = GridSearch(request.grid)
    algo = request.algorithm.upper()
    
    if algo == "BFS":
        return run_bfs(grid)
    elif algo == "DFS":
        return run_dfs(grid)
    elif algo == "UCS":
        return run_ucs(grid)
    elif algo == "GREEDY":
        return run_greedy(grid, request.heuristic)
    elif algo == "ASTAR":
        return run_astar(grid, request.heuristic)
    else:
        raise ValueError(f"Unknown algorithm {algo}")
