# AdsFixter LLC - Senior Full-Stack Engineer Assessment

A comprehensive full-stack solution featuring a **Visual Chatbot Flow Builder** (Task 1) and a **Spreadsheet-Like Web Application** (Task 2). Built with Next.js, Express, Socket.io, and MongoDB, focusing on clean architecture, performance, and premium UX.

---

## 🚀 Live Demo & Repository
- **Frontend URL**: [https://adsfixtertask-frontend.vercel.app/](https://adsfixtertask-frontend.vercel.app/) *(Coming soon/Update with your URL)*
- **Backend URL**: [https://adsfixtertask-backend.onrender.com/](https://adsfixtertask-backend.onrender.com/) *(Coming soon/Update with your URL)*
- **GitHub Repository**: [https://github.com/sakkib443/AdsFixtertask_frontend](https://github.com/sakkib443/AdsFixtertask_frontend)

---

## 🛠️ Project Architecture

### 1. Frontend Architecture (Next.js 15+)
- **Framework**: Next.js (App Router) for SEO, performance, and modern routing.
- **State Management**:
  - **Zustand**: Used for the specialized logic of the Flow Builder (Flow state, nodes, edges) to ensure low-latency updates during drag operations.
  - **Redux Toolkit**: Centralized management for Authentication and global User state.
  - **Context API**: Selective use for Theme and Language management.
- **Styling**: Tailwind CSS with a **Guaranteed Light Theme** implementation (Global overrides for accessibility and aesthetic consistency).
- **Interactions**: Framer Motion for micro-animations and smooth transitions.

### 2. Backend Architecture (Node.js/Express)
- **Pattern**: Modular Layered Architecture (Routes -> Controllers -> Services -> Models).
- **Communication**: 
  - **REST API**: For data persistence, authentication, and CRUD operations.
  - **Socket.io**: Real-time bi-directional communication for the Live Chatbot Preview engine.
- **Flow Execution Engine**: A deterministic server-side engine that traverses flow nodes, handles delays, and conditions based on socket triggers.
- **Database**: MongoDB with Mongoose for flexible document schema.

---

## ✨ Features Implemented

### Task 1: Chatbot Flow Builder (Primary)
- **Visual Flow Editor**: Fully interactive Drag-and-Drop canvas using `reactflow`.
- **Node Types**:
  - `Start Node`: Initial entry point.
  - `Message Node`: Supports text responses.
  - `Input Node`: Halts execution to wait for user input.
  - `Delay Node`: Configurable waiting periods (e.g., "Bot is typing...").
  - `End Node`: Terminates the conversation.
- **Connection Logic**: Validation to prevent circular loops and broken connections.
- **Flow Management**: Create, Update, Delete, and Duplicate flows from a professional dashboard.
- **Live Preview (Socket-Based)**: A sidebar panel that simulates the chatbot experience in real-time by executing the current builder state via WebSockets.
- **Persistence**: 
  - **Backend Sync**: Automatic syncing of flow structures to MongoDB.
  - **Auto-Save**: Every 30 seconds to the cloud.
  - **Local Backup**: Real-time backup to `LocalStorage` for crash recovery.
- **Import/Export**: Export flows as JSON files and import them and render visually.

### Task 2: Spreadsheet-Like Application (Bonus)
- **Dynamic Grid**: Efficient grid management with real-time cell updates.
- **Cell Operations**: Support for text/number input, highlighting, and basic data organization.
- **REST Integration**: Spreadsheets are saved per-user and can be managed (list/create/delete) from the admin panel.
- **Clean UI**: Minimalist Google Sheets-inspired design.

---

## 🏗️ Cleanup & Optimization (Developer Discipline)
During the assessment, the codebase underwent a major refactoring:
- **Dead Code Elimination**: Removed 20+ unused directories and legacy LMS/Marketplace modules to focus strictly on the required assessment tasks.
- **Force Light Theme**: Removed dark-mode complexity to provide a consistent, premium light-ui experience as requested.
- **Build Stabilization**: Fixed a critical `CssSyntaxError` preventing production deployments.

---

## ⚙️ Setup & Installation

### 1. Frontend Setup
```bash
cd frontend
npm install
# Configure .env
# NEXT_PUBLIC_API_URL=http://localhost:5000
npm run dev
```

### 2. Backend Setup
```bash
cd backend
npm install
# Configure .env
# PORT=5000
# DATABASE_URL=mongodb://...
# JWT_ACCESS_SECRET=...
npm run dev
```

---

## ⚠️ Known Limitations & Trade-offs
- **WebSocket Deployment**: On certain free hosting platforms (like Render), WebSockets might experience initial handshake delays. Attached local video demonstrates the real-time speed.
- **Condition Nodes**: Basic routing implemented; advanced boolean logic nodes are scoped for future versions.
- **Rich Text**: Basic text implemented for nodes; Full Tiptap integration is in the roadmap.

---
**Developed by Sakib**  
*Senior Full-Stack Engineer Candidate*