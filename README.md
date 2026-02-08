# 🍽️ La Maison — AI Restaurant Reservation Assistant

An AI-powered restaurant chatbot that acts as a professional front-desk host, helping guests book, modify, or cancel reservations and answer menu or availability questions with natural, conversational interactions.

## ✨ Features

- **Natural Language Booking** — Book a table by simply chatting (e.g., "Table for 4 on Friday at 8 PM")
- **Reservation Management** — Modify or cancel existing reservations conversationally
- **Menu Intelligence** — Ask about dishes, get chef recommendations, and explore dietary options
- **Availability Checks** — Real-time slot availability with smart alternative suggestions
- **Context-Aware AI** — Remembers conversation context so you never repeat yourself
- **Streaming Responses** — Token-by-token response rendering for a fluid chat experience

## 🛠️ Tech Stack

- **Frontend** — React, TypeScript, Vite, Tailwind CSS, shadcn/ui
- **AI Engine** — Gemini 3 Flash via Edge Functions
- **Backend** —  Supabase for serverless functions
- **Styling** — Tailwind CSS with custom design tokens, Framer Motion animations

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- npm or bun

### Installation

```bash
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to the project directory
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

## 🗂️ Project Structure

```
src/
├── components/          # React components
│   ├── ChatWindow.tsx   # Main chat interface
│   ├── ChatMessage.tsx  # Individual message rendering
│   └── ui/              # shadcn/ui component library
├── data/
│   └── restaurantData.ts # Menu & restaurant configuration
├── lib/
│   ├── chatApi.ts       # Streaming API client (SSE)
│   └── bot/             # Bot engine modules
│       ├── intents.ts   # Intent detection
│       ├── parsers.ts   # Input parsing (dates, times, guests)
│       └── types.ts     # Type definitions
├── pages/
│   └── Index.tsx        # Landing page
└── hooks/               # Custom React hooks

supabase/
└── functions/
    └── chat/
        └── index.ts     # AI chat edge function
```

## 💬 Usage Examples

| You say | La Maison responds |
|---|---|
| "Book a table for 4 on Friday at 8 PM" | Confirms booking with availability check |
| "What's on the menu?" | Highlights popular dishes and categories |
| "Can I change my reservation to Saturday?" | Modifies the booking seamlessly |
| "Any vegan options?" | Recommends plant-based dishes |

## 📄 License

This project is private. All rights reserved.
