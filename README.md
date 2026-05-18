# 🚗 AutoMend — Premium Garage Management Platform

AutoMend is an ultra-premium, full-stack vehicle repair and garage management system designed with modern web engineering practices. It enables customers, garage administrators, and certified mechanics to interact seamlessly to manage vehicles, book slots, diagnose issues, process payments, and track real-time servicing.

---

## 🏗️ Unified Monorepo Architecture

To ensure a state-of-the-art developer experience, the project is configured as a single **NPM Workspace** (Monorepo). You no longer need to manage multiple terminal tabs or manually run different commands in separated directories. 

The structure is configured as follows:
```
AutoMend/
├── package.json         # Root orchestrator & NPM Workspaces configuration
├── .gitignore           # Global clean git exclusion template
├── client/              # Frontend React application (Vite environment)
│   ├── package.json
│   └── ...
└── server/              # Backend Express REST API (Node.js environment)
    ├── package.json
    └── ...
```

---

## ⚡ Quick Start (Single Command Bootup)

Follow these simple steps to run both the frontend and backend servers concurrently:

### 1. Initial Setup
Install all dependencies across the entire monorepo (root, client, and server) with a single command:
```bash
npm install
```

### 2. Run the Development Environment
Boot up both the Vite frontend dev server and the Express API server concurrently inside a single terminal tab:
```bash
npm run dev
```
* The **Frontend** will launch on `http://localhost:5173/`
* The **Backend API** will launch on `http://localhost:8080/`

---

## 📋 Comprehensive Command Directory

Run these commands from the **absolute root directory** of the `AutoMend` folder:

| Command | Action / Description |
| :--- | :--- |
| `npm install` | Performs workspace linking and installs all packages for root, client, and server. |
| `npm run dev` | Spins up both Vite and Express servers concurrently with live hot-reloading. |
| `npm run build-all` | Compiles a production-ready optimized static bundle for the React client. |
| `npm run start` | Runs the backend REST API server in standalone production mode. |

---

## 🌟 Key Features
* **Granular Review Moderation**: Customers and admins can delete only the specific portion (Garage or Mechanic) of any review they select, with automatic database purging if both portions are cleared.
* **State-of-the-Art Interactive Booking**: Alternate days quick-cards, interactive time-window pills, urgent ASAP breakdown toggles, and seamless Google Map location mapping.
* **Cinematic Supercar Loading Screen**: Liquid Gold wind-tunnel supercar animation with rotating alloy spoke wheels, static performance brake calipers, and laser speed flows.
