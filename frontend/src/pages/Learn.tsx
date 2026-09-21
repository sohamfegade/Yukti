import React, { useState } from 'react';
import { Search, Activity, Network, ChevronRight, BookOpen } from 'lucide-react';

type Section = 'search' | 'game' | 'bayesian';


type QA = { q: string; a: React.ReactNode };

const topics: Record<Section, { id: string; title: string; qas: QA[] }[]> = {
  search: [
    {
      id: 'bfs',
      title: 'Breadth-First Search (BFS)',
      qas: [
        { q: '1. What problem does it solve?', a: 'Finds the shortest path in an unweighted graph.' },
        { q: '2. How does it work?', a: 'Explores all nodes at the present depth level before moving on to the nodes at the next depth level.' },
        { q: '3. Data structure:', a: 'Queue (FIFO).' },
        { q: '4. How it makes decisions:', a: 'Dequeues the oldest discovered node and explores its neighbors.' },
        { q: '5. Time complexity:', a: 'O(V + E) where V is vertices and E is edges. In trees, O(b^d) where b is branching factor and d is depth.' },
        { q: '6. Space complexity:', a: 'O(b^d) because it stores all nodes of a level in the queue.' },
        { q: '7. Strengths:', a: 'Guaranteed to find the shortest path (optimal) if all edge weights are equal. Complete (will always find a solution if one exists).' },
        { q: '8. Limitations:', a: 'High memory consumption for deep/wide trees.' },
        { q: '9. Example:', a: 'Finding the minimum number of moves to solve a Rubik\'s cube, or peer-to-peer network routing.' }
      ]
    },
    {
      id: 'dfs',
      title: 'Depth-First Search (DFS)',
      qas: [
        { q: '1. What problem does it solve?', a: 'Traversing or searching tree or graph data structures, finding paths.' },
        { q: '2. How does it work?', a: 'Explores as far as possible along each branch before backtracking.' },
        { q: '3. Data structure:', a: 'Stack (LIFO) or Recursion.' },
        { q: '4. How it makes decisions:', a: 'Pops the most recently discovered node and explores its first neighbor.' },
        { q: '5. Time complexity:', a: 'O(V + E). In trees, O(b^m) where m is the maximum depth of any path.' },
        { q: '6. Space complexity:', a: 'O(bm) which is much more memory efficient than BFS.' },
        { q: '7. Strengths:', a: 'Uses very little memory. Good if the solution is far from the root.' },
        { q: '8. Limitations:', a: 'Not optimal (can find a long path even if a shorter one exists). Can get stuck in infinite loops in cyclic graphs.' },
        { q: '9. Example:', a: 'Solving a maze or topological sorting.' }
      ]
    },
    {
      id: 'ucs',
      title: 'Uniform Cost Search (UCS)',
      qas: [
        { q: '1. What problem does it solve?', a: 'Finds the lowest cost path in a weighted graph.' },
        { q: '2. How does it work?', a: 'Explores nodes in order of their lowest cumulative cost from the start node.' },
        { q: '3. Data structure:', a: 'Priority Queue.' },
        { q: '4. How it makes decisions:', a: 'Dequeues the node with the lowest path cost `g(n)`.' },
        { q: '5. Time complexity:', a: 'O(b^(1 + floor(C*/ε))) where C* is optimal cost and ε is minimum edge weight.' },
        { q: '6. Space complexity:', a: 'O(b^(1 + floor(C*/ε))).' },
        { q: '7. Strengths:', a: 'Optimal and complete for any step cost greater than zero.' },
        { q: '8. Limitations:', a: 'Explores uniformly in all directions, making it slow (no heuristic guidance).' },
        { q: '9. Example:', a: 'Finding the cheapest flight route between cities.' }
      ]
    },
    {
      id: 'greedy',
      title: 'Greedy Best-First Search',
      qas: [
        { q: '1. What problem does it solve?', a: 'Rapidly finding a path to a goal using a heuristic.' },
        { q: '2. How does it work?', a: 'Expands the node that appears to be closest to the goal based solely on a heuristic function.' },
        { q: '3. Data structure:', a: 'Priority Queue.' },
        { q: '4. How it makes decisions:', a: 'Dequeues the node with the lowest heuristic value `h(n)`.' },
        { q: '5. Time complexity:', a: 'O(b^m) in worst case, but often much faster in practice.' },
        { q: '6. Space complexity:', a: 'O(b^m).' },
        { q: '7. Strengths:', a: 'Often very fast, expands fewer nodes than uninformed search.' },
        { q: '8. Limitations:', a: 'Not optimal, not complete. Can easily get trapped in dead ends or local minima.' },
        { q: '9. Example:', a: 'Routing in GPS systems prioritizing physical distance (ignoring traffic/roads).' }
      ]
    },
    {
      id: 'astar',
      title: 'A* Search',
      qas: [
        { q: '1. What problem does it solve?', a: 'Finding the optimal path efficiently in weighted graphs.' },
        { q: '2. How does it work?', a: 'Combines the cost-so-far `g(n)` from UCS with the estimated-cost-to-goal `h(n)` from Greedy search.' },
        { q: '3. Data structure:', a: 'Priority Queue.' },
        { q: '4. How it makes decisions:', a: 'Dequeues the node with the lowest `f(n) = g(n) + h(n)`.' },
        { q: '5. Time complexity:', a: 'Exponential O(b^d) worst case, but depends heavily on the heuristic.' },
        { q: '6. Space complexity:', a: 'O(b^d) as it keeps all generated nodes in memory.' },
        { q: '7. Strengths:', a: 'Complete and optimal (if the heuristic is admissible/consistent). The most efficient algorithm for finding optimal paths.' },
        { q: '8. Limitations:', a: 'Space complexity can be a major bottleneck for large state spaces.' },
        { q: '9. Example:', a: 'Video game pathfinding (e.g. moving a unit across a map while avoiding obstacles).' }
      ]
    }
  ],
  game: [
    {
      id: 'minimax',
      title: 'Minimax',
      qas: [
        { q: '1. What problem does it solve?', a: 'Decision making in zero-sum, perfect information games.' },
        { q: '2. How does it work?', a: 'Recursively simulates all possible moves. The \'Maximizer\' tries to get the highest score, while the \'Minimizer\' tries to give the lowest score.' },
        { q: '3. Data structure:', a: 'Game Tree (Recursion).' },
        { q: '4. How it makes decisions:', a: 'Assumes the opponent plays optimally. At max nodes, takes the max of children. At min nodes, takes the min.' },
        { q: '5. Time complexity:', a: 'O(b^m) where b is legal moves and m is depth.' },
        { q: '6. Space complexity:', a: 'O(bm) for the recursive call stack.' },
        { q: '7. Strengths:', a: 'Plays perfectly. Will never lose if given enough compute time.' },
        { q: '8. Limitations:', a: 'Too slow for deep games like Chess or Go due to exponential branching factor.' },
        { q: '9. Example:', a: 'Tic-Tac-Toe AI.' }
      ]
    },
    {
      id: 'alphabeta',
      title: 'Alpha-Beta Pruning',
      qas: [
        { q: '1. What problem does it solve?', a: 'Speeds up the Minimax algorithm.' },
        { q: '2. How does it work?', a: 'Keeps track of the best alternatives for both players (Alpha and Beta). If a branch proves to be worse than a previously examined branch, it stops evaluating it ("prunes" it).' },
        { q: '3. Data structure:', a: 'Game Tree (Recursion with Alpha/Beta parameters).' },
        { q: '4. How it makes decisions:', a: 'If `beta <= alpha`, the branch is pruned because the opponent will never allow this state to be reached.' },
        { q: '5. Time complexity:', a: 'O(b^(m/2)) in the best case (perfect ordering). Worst case O(b^m).' },
        { q: '6. Space complexity:', a: 'O(bm).' },
        { q: '7. Strengths:', a: 'Computes the exact same result as Minimax but much faster. Allows looking twice as deep in the same amount of time.' },
        { q: '8. Limitations:', a: 'Still too slow for extremely complex games without heuristic evaluation.' },
        { q: '9. Example:', a: 'Chess engines like Deep Blue.' }
      ]
    }
  ],
  bayesian: [
    {
      id: 'bayes',
      title: 'Bayesian Reasoning',
      qas: [
        { q: '1. What problem does it solve?', a: 'Updating beliefs based on new, uncertain evidence.' },
        { q: '2. How does it work?', a: 'Uses Bayes\' Theorem: `P(A|B) = [P(B|A) * P(A)] / P(B)`. It multiplies the prior probability by the likelihood of the evidence, and normalizes it.' },
        { q: '3. Data structure:', a: 'Bayesian Networks (Directed Acyclic Graphs where nodes are variables and edges are conditional dependencies).' },
        { q: '4. How it makes decisions:', a: 'Calculates the posterior probability distribution and makes decisions that maximize expected utility.' },
        { q: '5. Time complexity:', a: 'Exact inference is NP-hard. Often relies on approximate inference (MCMC, Gibbs Sampling).' },
        { q: '6. Space complexity:', a: 'Exponential in the number of parents for a node in the network.' },
        { q: '7. Strengths:', a: 'Handles missing data and uncertainty beautifully. Provides a mathematical framework for learning.' },
        { q: '8. Limitations:', a: 'Requires defining accurate prior probabilities (which can be subjective) and conditional probability tables.' },
        { q: '9. Example:', a: 'Medical diagnosis (updating the probability a patient has a disease given a positive test result), or spam filtering.' }
      ]
    }
  ]
};

const Learn: React.FC = () => {
  const [activeSection, setActiveSection] = useState<Section>('search');
  const [activeTopicId, setActiveTopicId] = useState<string>(topics['search'][0].id);

  const currentTopic = topics[activeSection].find(t => t.id === activeTopicId) || topics[activeSection][0];

  return (
    <div className="flex-1 flex flex-col md:flex-row max-w-7xl mx-auto w-full">
      {/* Sidebar Navigation */}
      <div className="w-full md:w-72 bg-slate-900 border-r border-slate-800 p-6 overflow-y-auto">
        <h2 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-blue-400" />
          Learn AI
        </h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Search className="w-4 h-4" /> Search
            </h3>
            <ul className="space-y-1">
              {topics.search.map(topic => (
                <li key={topic.id}>
                  <button
                    onClick={() => { setActiveSection('search'); setActiveTopicId(topic.id); }}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${activeTopicId === topic.id ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
                  >
                    {topic.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4" /> Game Intelligence
            </h3>
            <ul className="space-y-1">
              {topics.game.map(topic => (
                <li key={topic.id}>
                  <button
                    onClick={() => { setActiveSection('game'); setActiveTopicId(topic.id); }}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${activeTopicId === topic.id ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
                  >
                    {topic.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Network className="w-4 h-4" /> Probabilistic
            </h3>
            <ul className="space-y-1">
              {topics.bayesian.map(topic => (
                <li key={topic.id}>
                  <button
                    onClick={() => { setActiveSection('bayesian'); setActiveTopicId(topic.id); }}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${activeTopicId === topic.id ? 'bg-purple-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
                  >
                    {topic.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6 md:p-12 overflow-y-auto">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
            <span className="capitalize">{activeSection} Intelligence</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-slate-300">{currentTopic.title}</span>
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-8 pb-4 border-b border-slate-800">
            {currentTopic.title}
          </h1>
          
          <div className="space-y-3">
            {currentTopic.qas.map((qa, idx) => (
              <details key={idx} className="group border border-slate-700 rounded-lg bg-slate-800/50 open:bg-slate-800 transition-colors duration-200">
                <summary className="cursor-pointer font-semibold p-4 text-white hover:bg-slate-700/50 rounded-lg flex items-center justify-between list-none [&::-webkit-details-marker]:hidden">
                  {qa.q}
                  <span className="transition-transform duration-200 group-open:rotate-90">
                    <ChevronRight className="w-5 h-5 text-slate-400" />
                  </span>
                </summary>
                <div className="p-4 pt-0 text-slate-300 leading-relaxed border-t border-slate-700/50 mt-1">
                  {qa.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Learn;
