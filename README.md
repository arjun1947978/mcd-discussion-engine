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
git clone https://github.com/arjun1947978/mcd-discussion-engine.git

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

## 🗺️ Contributor Roadmap & Wishlist (What We Want to Build Next)

We have mapped out a comprehensive roadmap of features, UI refinements, and architectural improvements. If you want to contribute, pick any item below or open an issue with your proposal!

### 1. 🚀 High-Impact Add-On Features
- [ ] **WebRTC HD Voice & Video Calling with Screen Sharing**:
  - Implement one-on-one and departmental voice/video conference bridges.
  - Enable live screen and camera sharing so plant supervisors can inspect physical machine parts directly from the discussion header.
- [ ] **Embedded SCADA & MQTT Sensor Telemetry Gauges**:
  - Render live sparklines and gauge charts (vibration, temperature, melt pressure, spindle RPM) inside chat bubbles for machine query tickets.
- [ ] **Bi-Directional ERP / MES Webhook Adapters**:
  - Connectors for SAP S/4HANA, Siemens Opcenter, and Salesforce CRM to automatically open a query room when a deviation ticket is logged, and resolve the ticket when the discussion completes.
- [ ] **Real-Time Photo & Blueprint Annotation**:
  - An interactive markup tool allowing engineers to circle defect sink marks or draw dimensional arrows directly onto uploaded machine inspection photos before sending.
- [ ] **Voice-to-Text Auto Transcription**:
  - Automatic voice note transcription using Whisper or Web Speech API for shopfloor operators wearing work gloves or protective PPE.
- [ ] **AI-Powered Shift Handover & RCA Summary**:
  - Auto-generate structured Root Cause Analysis (RCA) summaries and 8D reports from resolved discussion histories.

### 2. 🎨 UI Polish & Visual Design
- [ ] **Interactive Canvas Navigation (Pan, Zoom & Mini-Map)**:
  - Add smooth mouse wheel zoom (`0.5x` to `2.0x`), smooth pan-and-drag, and an architectural mini-map in the bottom-left corner of the Railway Canvas.
- [ ] **Pinned Messages & Pinned Query Banner**:
  - A collapsible, pinned announcement bar at the top of the chat area for critical SOPs, shift notices, and lead contact numbers.
- [ ] **Rich Audio Waveform Spectrum**:
  - True frequency-sampled audio visualizer with click-to-seek playback scrubbers.
- [ ] **Global Command Palette (`Ctrl/Cmd + K`)**:
  - Fast keyboard-first search modal allowing instant navigation to any of the 22 departments, 25 query rooms, or staff members.
- [ ] **Custom Enterprise Reaction Picker**:
  - WhatsApp-style emoji reaction picker with haptic feel, skin tone selection, and custom industrial emoji indicators (e.g. ⚠️ `Safety Alert`, 🔧 `Tool Changed`, 🧪 `Lab Verified`).

### 3. ⚡ UX, Performance & Enterprise Architecture
- [ ] **Progressive Web App (PWA) & Offline Sync**:
  - Full service-worker caching with background sync so operators in low-connectivity shopfloor basements can read and queue messages via IndexedDB.
- [ ] **Message Stream Virtualization**:
  - Virtualized message list using `@tanstack/react-virtual` or `react-window` to guarantee 60fps rendering even with 100,000+ message enterprise archives.
- [ ] **End-to-End Encryption (E2EE)**:
  - Cryptographic client-side encryption using Web Crypto API and Signal Double Ratchet Protocol for sensitive proprietary tooling CAD specs and commercial pricing discussions.
- [ ] **Multi-Language Localization (i18n)**:
  - Internationalization for global manufacturing plants (English, Hindi, German, Japanese, Mandarin, Spanish).
- [ ] **Mobile Haptic Feedback**:
  - Vibration haptics on swipe-to-reply trigger, audio record start/stop, and message long-press.

---

## 🤝 Calling Developers Worldwide — Join the Project!

We believe the future of industrial manufacturing and enterprise collaboration belongs to **open, intuitive, and high-performance developer-driven tools**.

Whether you specialize in frontend UI/UX, real-time backend systems, machine telemetry protocols, or enterprise integrations, **your contributions are warmly welcomed!**

### How to Contribute:
1. **Fork** the repository.
2. Create your feature branch (`git checkout -b feature/amazing-feature`).
3. Commit your changes (`git commit -m 'feat: add amazing feature'`).
4. Push to the branch (`git push origin feature/amazing-feature`).
5. Open a **Pull Request** and describe your enhancements!

Feel free to open an [Issue](https://github.com/arjun1947978/mcd-discussion-engine/issues) to discuss ideas, feature requests, or report bugs.

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

*Engineered with precision for the next generation of industrial collaboration.*

