# 📄 SnapDocs

### AI-Powered Intelligence for Document Architecture & Tech Roadmaps

![SnapDocs Banner](https://images.unsplash.com/photo-1618477388954-7852f32655ec?auto=format&fit=crop&q=80&w=1200&h=400)

**SnapDocs** is a high-fidelity intelligence platform designed to bridge the gap between complex technical concepts and production-ready documentation. Built with a robust **React** frontend and a dedicated **Express** backend, it leverages the power of **Claude 3.7 / Opus 4.6** to generate architectural roadmaps, implementation guides, and real-time technical analysis.

---

## 🚀 Key Features

- **🧠 Intelligent Tech Analysis**: Generate deep-dive architectural profiles for any technology stack.
- **🏗️ Architectural Roadmaps**: Automatically create production-grade implementation flows, including configuration blocks and executable commands.
- **💬 Real-time AI Chat**: Advanced conversational interface for technical troubleshooting and system design discussions.
- **🚄 Streaming Architecture**: Server-Sent Events (SSE) integration for low-latency, real-time AI response delivery.
- **🎨 Modern Aesthetic**: A premium, responsive UI built with Tailwind CSS and Lucide icons.

---

## 🛠️ Technology Stack

| Component | Technology |
| :--- | :--- |
| **Frontend** | React 19, Vite, Tailwind CSS, Lucide Icons |
| **Backend** | Node.js, Express, Anthropic SDK (Claude 3.7) |
| **API** | RESTful with SSE streaming |
| **Security** | Helmet.js, CORS, Environment-based configuration |

---

## 📂 Project Structure

```bash
SnapDocs/
├── backend/            # Express server & AI integration
│   ├── controllers/    # Business logic & AI orchestration
│   ├── routes/         # API endpoint definitions
│   ├── services/       # Anthropic/Claude SDK services
│   └── index.js        # Server entry point
├── frontend/           # Vite + React application
│   ├── src/            # Component & UI logic
│   ├── public/         # Static assets
│   └── index.html      # Main entry point
└── README.md           # Root documentation
```

---

## 🚦 Getting Started

### Prerequisites

- Node.js (v18+)
- NPM or Yarn
- Anthropic API Key (Claude)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file from `.env.example`:
   ```bash
   cp .env.example .env
   ```
4. Add your `ANTHROPIC_API_KEY` to the `.env` file.
5. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```

---

## 🔒 Security & Best Practices

- **Production-Ready**: Uses `helmet` for security headers and `morgan` for detailed telemetry.
- **Error Handling**: Synchronous and asynchronous error management via custom middleware.
- **Mock Mode**: Built-in fallback system for local development without an API key.

---

## 📄 License

This project is licensed under the ISC License.

---

*Generated with ❤️ by the SnapDocs AI Intelligence Team.*
