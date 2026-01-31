# 🌳 Suffix Tree Visualizer

An interactive, web-based tool built with **React** to visualize the construction and structure of Suffix Trees. Input any string and watch as the tree dynamically generates to represent its suffixes.



---

## 💡 Overview

Suffix trees are powerful data structures used in string algorithms (like pattern matching, finding the longest repeated substring, etc.). This project aims to make these complex structures easier to understand through real-time visualization.

### Key Features
* **Live Rendering:** The tree updates instantly as you type.
* **Edge Compression:** Implements a compressed trie where non-branching paths are merged into single edges.
* **Interactive Exploration:** Hover over nodes to highlight specific suffixes or view metadata.
* **Responsive Design:** Fully functional on desktop and mobile browsers.

---

## 🛠️ Tech Stack

* **Framework:** [React](https://reactjs.org/)
* **Styling:** Tailwind CSS
* **State Management:** React Context / Hooks

---

## 📖 How it Works
A suffix tree for a string $S$ of length $n$ is a rooted tree such that:There are exactly $n$ leaves, numbered $1$ to $n$.Each internal node (except the root) has at least two children.Each edge is labeled with a non-empty substring of $S$.No two edges starting out of a node can have labels starting with the same character.The visualization handles the $O(n^2)$ or $O(n)$ construction logic (e.g., Ukkonen's Algorithm) and maps the resulting data structure into a hierarchical JSON format for D3 rendering.
