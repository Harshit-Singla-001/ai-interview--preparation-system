# AI Interview Preparation System
### Formal Title: AI Interview Preparation System Using Search Algorithms and Generative AI

[![AI Lab Syllabus](https://img.shields.io/badge/AI_Lab-Experiment_1_Search-blue.svg)](#ai-lab-syllabus-mapping)
[![Search Algorithms](https://img.shields.io/badge/Search-BFS_%7C_DFS_%7C_UCS_%7C_Greedy_%7C_A*-indigo.svg)](#search-algorithms-implemented)
[![Generative AI](https://img.shields.io/badge/GenAI-Google_Gemini-emerald.svg)](#generative-ai-integration)
[![No XAMPP](https://img.shields.io/badge/Stack-Node.js_+_React_+_Python_Launcher-rose.svg)](#technology-stack)

---

## 📌 1. Project Overview

The **AI Interview Preparation System** is an intelligent academic web application that combines **classical AI search algorithms** with modern **Generative AI** to solve a real-world technical preparation challenge:

1. **Career Pathway Search**: A student selects a completed academic course (e.g., *B.Tech AI & Data Science*). The system models degrees, foundational skills, specialized topics, and industry job roles as a weighted directed knowledge graph. Uninformed search algorithms (**BFS**, **DFS**, **UCS**) and informed search algorithms (**Greedy Best-First**, **A\***) are executed from scratch to discover the optimal learning pathway.
2. **Generative Technical Assessment**: Once a career destination (e.g., *Data Scientist*, *AI Engineer*) is confirmed, **Google Gemini** generates practical, topic-aligned multiple-choice questions (MCQs).
3. **Dual Answer & Explanation Evaluation**: Candidates select their answer and can optionally explain **why** they chose it. The AI evaluates both the selected option and the student's qualitative reasoning—detecting conceptual misunderstandings, lucky guesses, or sound mental models.
4. **Performance Diagnostics**: Topic-by-topic mastery charts identify weak prerequisite areas and generate an actionable AI study roadmap.

---

## 🚀 2. Quick Start: Single-File Execution (`app.py`)

The entire full-stack system can be launched using a single runner command:

```bash
python app.py
```

### What `app.py` Does Automatically:
1. Reads all configuration (Server port, Client port, Gemini key, Model) from `.env`.
2. Verifies that all required packages for both the backend and frontend are installed.
3. Concurrently boots the **Node.js Express API Engine** and the **React Vite Client**.
4. Automatically opens your default web browser directly to the application: **`http://localhost:5173`**.
5. Handles graceful shutdown of all processes when you press `Ctrl + C`.

---

## ⚙️ 3. Central Configuration (`.env`)

All ports and API keys are centralized in a single root `.env` file. You can change ports in this single file and both the server and client will update at once:

```env
# Server Port (Backend API)
PORT=5000

# Client Port (React Vite)
CLIENT_PORT=5173

# Google Gemini Configuration
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-3.6-flash
GEMINI_FALLBACK_MODEL=gemini-2.5-flash

# Environment
NODE_ENV=development
```

> **Note**: The system includes a curated bank of **180 high-quality technical questions** (30 questions for each of the 6 job roles in `server/data/fallbackQuestions.json`). On every mock test attempt, questions are selected and shuffled using the **Fisher-Yates algorithm** in random order (for 5, 10, or 15 questions), eliminating external API quota limits and latency. Semantic answer explanation evaluation is powered by Gemini AI when configured.

---

## 🛠️ 4. Alternative Manual Commands

If you prefer using standard Node.js/NPM commands instead of Python:

### Run Search Algorithms Unit Test:
```bash
npm run test:search
# or: node server/testSearch.js
```

### Run Backend Only:
```bash
npm run server
# or: cd server && npm start
```

### Run Frontend Only:
```bash
npm run client
# or: cd client && npm run dev
```

---

## 🔬 5. AI Lab Syllabus Mapping

This project explicitly implements and demonstrates the academic syllabus experiment:

> **AI Lab Experiment 1: "Write a program to conduct uninformed and informed search."**

| Syllabus Concept | Algorithm Implemented | Graph Traversal Strategy | Metric / Formula | Guaranteed Optimality? |
| :--- | :--- | :--- | :--- | :--- |
| **Uninformed Search** | **BFS** (Breadth-First Search) | FIFO Queue level-by-level | Minimum transition hops | Optimal in unweighted graphs |
| **Uninformed Search** | **DFS** (Depth-First Search) | LIFO Stack depth exploration | Deep specializations & backtracking | Not optimal; can get trapped |
| **Uninformed Search** | **UCS** (Uniform Cost Search) | Min-Priority Queue | Minimum cumulative cost $g(n)$ | **Optimal** for weighted graphs |
| **Informed Search** | **Greedy Best-First Search** | Min-Priority Queue | Lowest heuristic distance $f(n) = h(n)$ | Fast, but not guaranteed optimal |
| **Informed Search** | **A\* Search** | Min-Priority Queue | Balance: $f(n) = g(n) + h(n)$ | **Optimal** with admissible heuristic |

### 🎓 How Search is Used in this Project:
- **Search Space**: Career Knowledge Graph consisting of Course, Skill, Topic, and Job Role nodes with directed prerequisite edges.
- **Edge Weight $c(u, v)$**: Quantifies the prerequisite difficulty, learning effort, and technical complexity (1 to 4).
- **Start State**: Selected Course (e.g., `COURSE_BTECH_AIDS`).
- **Goal State**: Target Job Role (e.g., `ROLE_DATA_SCIENTIST`).
- **Path Cost $g(n)$**: Total accumulated preparation difficulty across the pathway.
- **Heuristic $h(n)$**: Admissible and consistent estimate of remaining difficulty to reach the target role, computed via reverse graph shortest paths.

---

## 📊 6. Search Algorithm Comparison

Running `node server/testSearch.js` outputs the empirical benchmark table:

```
====================================================
 AI LAB SEARCH ALGORITHM VERIFICATION SUITE
====================================================
Start Node: B.Tech AI & Data Science -> Goal Node: Data Scientist

┌─────────────────────┬─────────────────────┬─────────┬────────────┬──────────┬────────────────┬───────────────┐
│ Algorithm           │ Search Class        │ Success │ Path Hops  │ Path Cost│ Nodes Explored │ Uses Heuristic│
├─────────────────────┼─────────────────────┼─────────┼────────────┼──────────┼────────────────┼───────────────┤
│ BFS                 │ Uninformed Search   │ true    │ 4 nodes    │ 6        │ 14             │ No            │
│ DFS                 │ Uninformed Search   │ true    │ 4 nodes    │ 6        │ 5              │ No            │
│ UCS                 │ Uninformed Search   │ true    │ 4 nodes    │ 5        │ 16             │ No            │
│ Greedy Best-First   │ Informed Search     │ true    │ 4 nodes    │ 5        │ 16             │ Yes           │
│ A*                  │ Informed Search     │ true    │ 4 nodes    │ 5        │ 9              │ Yes           │
└─────────────────────┴─────────────────────┴─────────┴────────────┴──────────┴────────────────┴───────────────┘
```

**Key Academic Observation**:
- **BFS** selects the fewest hop sequence (`Python -> ML -> Data Scientist`, cost: 6).
- **UCS** identifies the lowest-cost path (`Stats -> ML -> Data Scientist`, cost: 5), but explores 16 nodes to do so.
- **A\*** discovers the exact same optimal cost path (cost: 5), but thanks to its admissible heuristic $h(n)$, it explores **only 9 nodes**—demonstrating superior search efficiency!

---

## 🤖 7. Technical Assessment & Generative AI Integration

The mock assessment engine provides an interactive, randomized evaluation platform designed for academic testing:

1. **Curated 180-Question Technical Bank (`server/data/fallbackQuestions.json`)**:
   - Contains **30 comprehensive multiple-choice questions** for each of the 6 career roles (180 questions total).
   - **Fisher-Yates Shuffle on Every Access**: Both question ordering and the 4 options (A, B, C, D) are shuffled dynamically, uniformly balancing correct answer positions and preventing memorization.
   - **Fast Assessment Modes**: Candidates can select **5 Questions (Fast Practice)**, **10 Questions (Standard Mock)**, or **15 Questions (Comprehensive)**.
   - **Career Pathway Gating**: The mock interview unlocks once a target job role is selected in the Career Path Finder. If accessed beforehand, the user is seamlessly guided to select their course and role first.

2. **Dual Answer & Explanation Evaluation (`POST /api/interview/evaluate`)**:
   - Compares the candidate's selected option against the dynamically remapped correct answer.
   - **Google Gemini Semantic Evaluation**: Analyzes the candidate's natural language reasoning in the optional explanation text box to verify genuine conceptual grasp vs. lucky guesses.

3. **Performance Diagnostics & History (`POST /api/interview/submit`)**:
   - Computes overall accuracy and topic-wise mastery.
   - Flags weak topics (< 60% accuracy) and provides targeted study recommendations.
   - Persists past attempts for ongoing review in **Past Reports**.

---

## 📁 8. Project Structure

```text
ai-interview-preparation-system/
├── app.py                         # Single-file application launcher
├── package.json                   # Root package configuration
├── .env                           # Centralized configuration (ports, Gemini key)
├── .env.example                   # Environment template
│
├── server/                        # Backend API & Search Engine (Node.js)
│   ├── server.js                  # Express application entry point
│   ├── testSearch.js              # Standalone search algorithms test suite
│   ├── package.json
│   ├── ai/
│   │   └── geminiClient.js        # Gemini API client with offline fallback
│   ├── controllers/
│   │   ├── careerController.js    # Courses & Job Roles handlers
│   │   ├── searchController.js    # Search execution & comparison handlers
│   │   ├── interviewController.js # Assessment generator & evaluator
│   │   └── historyController.js   # Assessment history handler
│   ├── data/
│   │   ├── careerGraph.json         # Graph nodes, edges, difficulty weights
│   │   ├── courses.json             # Available academic degrees
│   │   ├── jobRoles.json            # Job roles, topics, required skills
│   │   ├── fallbackQuestions.json   # 180 curated questions (30 per role)
│   │   ├── generateQuestionsBank.js # Question bank generation & verification
│   │   └── history.json             # Assessment attempts persistence
│   ├── routes/                      # REST route endpoints
│   └── search/                      # PURE JAVASCRIPT SEARCH IMPLEMENTATIONS
│       ├── graph.js                 # Adjacency list & path cost calculations
│       ├── heuristic.js             # Admissible h(n) heuristic provider
│       ├── priorityQueue.js         # Min-Heap Priority Queue implementation
│       ├── bfs.js                   # Breadth-First Search
│       ├── dfs.js                   # Depth-First Search
│       ├── uniformCostSearch.js     # Uniform Cost Search
│       ├── greedyBestFirst.js       # Greedy Best-First Search
│       ├── aStar.js                 # A* Search [f(n) = g(n) + h(n)]
│       └── searchComparator.js      # Multi-algorithm benchmark executor
│
└── client/                          # Frontend UI (React + Vite)
    ├── index.html
    ├── vite.config.js               # Proxies API to backend port from .env
    ├── package.json
    └── src/
        ├── App.jsx                  # Main application view manager
        ├── index.css                # Custom responsive glassmorphism CSS
        ├── main.jsx
        ├── components/
        │   ├── Navbar.jsx           # Top navigation with Day/Night toggle
        │   ├── CareerSearchVisualizer.jsx   # Interactive graph path playback
        │   ├── AlgorithmComparisonTable.jsx # Side-by-side benchmark table
        │   ├── AssessmentPlayer.jsx         # Question-by-question MCQ player
        │   ├── DiagnosticReport.jsx         # Report card & revision checklist
        │   ├── AILabDemonstration.jsx       # Dedicated AI Lab evaluation page
        │   └── AssessmentHistory.jsx        # Past attempts review
        └── services/
            └── api.js                       # Frontend REST API client
```

---

## 🎯 9. Viva Examination Quick Reference

When presenting this project to your professor or examiner, explain the two core halves:

### Q1: Where are the AI Lab search algorithms implemented?
> *"All search algorithms are implemented from scratch in `/server/search/` without external algorithmic libraries. We implemented BFS using a FIFO queue, DFS using a LIFO stack, UCS using a custom Min-Heap Priority Queue based on path cost $g(n)$, Greedy Best-First Search using a Priority Queue on $h(n)$, and A\* Search using $f(n) = g(n) + h(n)$."*

### Q2: What do the graph nodes and edges represent?
> *"The career knowledge graph (`server/data/careerGraph.json`) models Courses as Level 0 start nodes, Foundational Skills as Level 1, Specialized Topics as Level 2, and Job Roles as Level 3 goal nodes. The directed edge weights represent learning difficulty and prerequisite complexity on a scale of 1 to 4."*

### Q3: Why is your A* heuristic admissible?
> *"Our heuristic $h(n)$ estimates remaining effort from node $n$ to the target role. We compute it using reverse graph shortest paths, guaranteeing that $h(n) \le h^*(n)$ (it never overestimates the actual cost), which mathematically proves that A\* finds the optimal path."*

### Q4: How is Generative AI distinct from the search algorithms?
> *"The search algorithms are deterministic classical AI algorithms that discover which job role to prepare for. Google Gemini is then used solely for Generative AI tasks: creating role-specific MCQs, analyzing user explanations semantically, and providing personalized revision recommendations."*

### Q5: How does the Mock Interview prevent predictability and API delays?
> *"The system houses a curated bank of 180 questions (30 per role). On every access, both question order and the 4 options (A, B, C, D) are shuffled using the Fisher-Yates algorithm, providing balanced answer distributions without external rate limits, while Gemini is reserved for qualitative semantic evaluation."*

---

## 📄 License
Academic Project — Built for College Demonstration & Evaluation.
