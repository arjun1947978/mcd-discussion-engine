# Marca Coroma Enterprise Discussion Engine (MCD)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF.svg)](https://vitejs.dev/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

> **High-Performance Industrial Real-Time Collaboration & Telemetry Discussion Mesh with Native WhatsApp-Familiar Gesture Parity.**  
> *Engineered for High-Precision Manufacturing Plants, Shopfloor Diagnostics, QCR Quarantine Labs, and Enterprise System Injections.*

---

## 🌟 Overview

In modern manufacturing plants, machine anomalies, mold tooling wear, and resin quality deviations require immediate cross-departmental coordination between shopfloor technicians, quality heads, and enterprise executives.

Standard enterprise chat software is rigid, disconnected from machine telemetry, and lacks the mobile fluidity technicians are accustomed to. **Marca Coroma Discussion Engine (MCD)** bridges this gap by combining an **ultra-responsive, WhatsApp-familiar mobile/desktop chat interface** with a **real-time engineering query dispatch mesh**.

---

## ✨ Key Features

### 🏢 22 Enterprise Departments & 25 Query Rooms
- Pre-configured with 22 manufacturing divisions (Tooling, R&D, Quality Control, Maintenance, SCM, Procurement, EHS, Operations, etc.).
- 25 realistic engineering queries with live priorities (`Critical Reject`, `Quarantine`, `High`, `Medium`, `Resolved`).

### 🌐 Railway-Style Architecture Canvas
- Serves as the interactive cockpit when discussions are idle.
- **Dual View Mesh Switcher**:
  - `Departments Mesh`: Visualizes connected departmental services with operational uptime and sub-30ms latency indicators.
  - `Query Systems Mesh`: Visualizes 6 engineering clusters (Sales CRM, QCR Quality, Tooling Diagnostics, Plant Operations, SCM, and R&D Stress Labs) with bounded 155px compact node cards and click-to-open routing.

### 💬 WhatsApp-Native Chat Surface
- **Swipe-to-Reply**: Touch drag and mouse swipe gestures with spring rebound and quote preview banners.
- **Voice Messages**: Realistic audio playback with animated frequency waveforms and duration timers.
- **Dynamic Message Status**: Accurate transitions from single tick (sent) to double gray (delivered) to blue ticks (read).
- **In-Stream Date Separation**: Relative date headers (`Today`, `Yesterday`, full dates) engineered to eliminate overlapping text glitches.
- **Smart Emoji & Attachment Trays**: Animated WhatsApp-style emoji selector and attachment menu.

### 👤 Zero-Jitter Member Profiles (OS-Coordinate Docking)
- Square high-resolution hero photo in natural, hardware-accelerated scroll flow.
- Seamless coordinate-based transition: When scrolling past 160px, the header bar smoothly docks with a 40px circular avatar, name, and designation.
- Zero layout thrashing, zero reflow, verified smooth across ultra-slow, slow, fast, and flick scroll speeds.

### 🎨 Algorithmic Smart Color Palettes
- Dynamically derives harmonious HSL color sets from any group name or query code. No hardcoded colors.
- Full Light and Dark Mode support with high contrast compliance.

### 🔌 Future Injection & Integration Hub
- Headless event bridge via `BroadcastChannel`, `postMessage`, and WebSockets.
- Pluggable into existing SAP, MES, SCADA, or custom enterprise web portals.

---

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
- `npm`, `pnpm`, or `yarn`

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/vaibhavchoudhary716/mcd-discussion-engine.git

# 2. Navigate to project root
cd mcd-discussion-engine

# 3. Install dependencies
npm install

# 4. Start the local development server with Vite HMR
npm run dev
```

Open your browser at `http://localhost:5173` to experience the discussion engine.

### Production Build

```bash
# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 📂 Project Architecture

```
d:/chat/
├── src/
│   ├── components/
│   │   ├── Canvas/          # Railway-style interactive topology canvas
│   │   │   └── MCDRailwayCanvas.jsx
│   │   ├── Chat/            # Chat area, message rows, swipe-to-reply, voice notes
│   │   │   ├── ChatArea.jsx
│   │   │   ├── ChatHeader.jsx
│   │   │   ├── ChatFooter.jsx
│   │   │   ├── SwipeableMessage.jsx
│   │   │   └── DateSeparator.jsx
│   │   └── Sidebar/         # Department list, query tree, member details modal
│   │       ├── Sidebar.jsx
│   │       ├── MembersPanel.jsx
│   │       └── MemberProfileModal.jsx
│   ├── data/                # Pre-seeded enterprise departments, queries & members
│   │   ├── departments.js   # 22 enterprise departments
│   │   ├── mockQueries.js   # 25 industrial query scenarios
│   │   └── roomMembers.js   # Multi-department member rosters
│   ├── utils/               # Date formatting, tick helpers, color algorithms
│   ├── App.jsx              # Core orchestration & state management
│   ├── App.css              # Vanilla CSS tokens & responsive design system
│   └── main.jsx
├── index.html
├── package.json
└── vite.config.js
```

---

## 🤝 Calling Developers Worldwide — Join the Project!

We believe the future of industrial manufacturing and enterprise collaboration belongs to **open, intuitive, and high-performance developer-driven tools**.

Whether you specialize in frontend UI/UX, real-time backend systems, machine telemetry protocols, or enterprise integrations, **your contributions are warmly welcomed!**

### Areas Where You Can Contribute:
- [ ] **Backend WebSockets & Persistence**: Real-time Node.js / Go / Rust backend adapters with PostgreSQL or Redis persistence.
- [ ] **WebRTC Audio & Video Calling**: One-on-one and group voice/video calls directly from the header.
- [ ] **SAP S/4HANA & MES Webhook Connectors**: Pre-built integration templates for industrial ERP platforms.
- [ ] **MQTT / SCADA Telemetry Streamers**: Real-time sensor telemetry widgets embedded directly inside query messages.
- [ ] **PWA & Offline-First Sync**: Full offline capability with IndexedDB message queues and service workers.
- [ ] **Accessibility (a11y) & Internationalization (i18n)**: Multilingual support for global manufacturing plants.

### How to Contribute:
1. **Fork** the repository.
2. Create your feature branch (`git checkout -b feature/amazing-feature`).
3. Commit your changes (`git commit -m 'feat: add amazing feature'`).
4. Push to the branch (`git push origin feature/amazing-feature`).
5. Open a **Pull Request** and describe your enhancements!

Feel free to open an [Issue](https://github.com/vaibhavchoudhary716/mcd-discussion-engine/issues) to discuss ideas, feature requests, or report bugs.

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

*Engineered with precision for the next generation of industrial collaboration.*
