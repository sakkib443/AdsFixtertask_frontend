# AdsFixter LLC - Senior Full-Stack Engineer Assessment

A comprehensive full-stack solution featuring a **Visual Chatbot Flow Builder** (Task 1) and a **Spreadsheet-Like Web Application** (Task 2). Built with Next.js, Express, Socket.io, and MongoDB, focusing on clean architecture, performance, and premium UX.

---

## 🚀 Live Deployment
- **Frontend URL**: [https://ads-fixtertask-frontend.vercel.app/](https://ads-fixtertask-frontend.vercel.app/)
- **Backend URL**: [https://ads-fixtertask-backend.vercel.app/](https://ads-fixtertask-backend.vercel.app/)
- **GitHub Repository**: [https://github.com/sakkib443/AdsFixtertask_frontend](https://github.com/sakkib443/AdsFixtertask_frontend)

---

## 🛠️ Project Architecture

### 1. Frontend Architecture (Next.js 15+)
- **Framework**: Next.js (App Router) for SEO, performance, and modern routing.
- **State Management**:
  - **Zustand**: Used for the specialized logic of the Flow Builder (Flow state, nodes, edges) to ensure low-latency updates during drag-and-drop operations.
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

## ✨ Detailed Feature List

### Task 1: Chatbot Flow Builder (Primary Task)
The Flow Builder is a complete visual programming environment for designing automation.
- **Visual Editor**: Fully interactive Drag-and-Drop canvas using `reactflow`.
- **Node Dictionary**:
  - `Start Node`: The required entry point for every flow.
  - `Message Node`: Sends text messages to the user.
  - `Input Node`: A blocking node that waits for a user response before continuing.
  - `Delay Node`: Simulates human-like typing delays (configurabe seconds).
  - `End Node`: Gracefully closes the socket session.
- **Real-time Live Preview**: A side-panel "Simulator" that connects to the server via Socket.io. It executes the **actual server-side logic** of your flow, allowing the developer to test user inputs and node transitions instantly.
- **Flow Management**: Professional dashboard to Create, Edit, Delete, Duplicate, and Toggle (Active/Inactive) flows.
- **Cloud Sync**: Automatic sync with MongoDB.
- **Offline Reliability**: Real-time backup to `LocalStorage` ensure no work is lost during connection drops.
- **JSON Import/Export**: Ability to download the entire flow as a `.json` file and re-import it visually.

### Task 2: Spreadsheet-Like Application (Secondary Task)
A lightweight "Google Sheets" style editor for tabular data management.
- **Grid Engine**: Dynamic row and column management.
- **Cell Persistence**: Individual cell values are meticulously tracked and synced to the user's account.
- **Multi-Sheet Support**: Users can manage multiple separate spreadsheet projects from the dashboard.
- **UX**: Clean, minimalist design optimized for data entry.

---

## 🏗️ Technical Cleanup & Optimization
As part of the engineering standard, the legacy codebase was heavily refactored:
- **Module Pruning**: Removed over 20+ legacy and unused directories (LMS, Marketplaces, Blogs) to reduce bundle size and technical debt.
- **Theme Standardization**: Implemented "Nuclear Overrides" in CSS to force a consistent white-label light theme, removing dark-mode bugs.
- **Build Hardening**: Fixed critical PostCSS and syntax errors to ensure zero-warning production builds.

---

## ⚙️ Setup & Installation

### 1. Frontend Setup
```bash
cd frontend
npm install
# Configure .env with NEXT_PUBLIC_API_URL
npm run dev
```

### 2. Backend Setup
```bash
cd backend
npm install
# Configure .env with DATABASE_URL and JWT secrets
npm run dev
```

---

## ⚠️ Known Limitations
- **WebSocket Handshake**: On free-tier hosting (Render/Vercel), there may be a 1-2 second initial cold-start delay for the first socket connection.
- **Authentication**: JWT tokens are stored securely; for production, HTTP-only cookies are recommended.

---
**Sheikh Sakibul Hasan**  
*Senior Full-Stack Engineer Candidate*