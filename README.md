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

- **Frontend** — React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui
- **AI Engine** — Google Gemini 3 Flash via serverless Edge Functions
- **Backend** — Supabase (Edge Functions, Deno runtime)
- **Styling** — Tailwind CSS with custom HSL design tokens, Framer Motion animations
- **Markdown** — react-markdown for rich bot responses

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- npm or bun
- A Supabase project with the `chat` Edge Function deployed

### Environment Variables

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=<your-supabase-url>
VITE_SUPABASE_PUBLISHABLE_KEY=<your-supabase-anon-key>
```

The Edge Function requires a server-side `API_KEY` secret for AI Gateway authentication.

### Installation & Running

```bash
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to the project directory
cd la-maison

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build for Production

```bash
# Create an optimized production build
npm run build

# Preview the production build locally
npm run preview
```

### Running Tests

```bash
npm run test
```

## 🗂️ Project Structure

```
src/
├── components/          # React components
│   ├── ChatWindow.tsx   # Main chat interface (state, streaming, input)
│   ├── ChatMessage.tsx  # Individual message bubble with markdown
│   └── ui/              # shadcn/ui component library
├── data/
│   └── restaurantData.ts # Menu items, availability schedule, helpers
├── lib/
│   ├── chatApi.ts       # SSE streaming client (fetch → ReadableStream → parse)
│   └── bot/             # Bot engine modules
│       ├── intents.ts   # Intent detection (regex-based)
│       ├── parsers.ts   # Input parsing (dates, times, guests)
│       └── types.ts     # Type definitions
├── pages/
│   └── Index.tsx        # Landing page (hero + chat split layout)
└── hooks/               # Custom React hooks

supabase/
└── functions/
    └── chat/
        └── index.ts     # AI chat edge function (system prompt + streaming proxy)
```

## 💬 Usage Examples

| You say | La Maison responds |
|---|---|
| "Book a table for 4 on Friday at 8 PM" | Confirms booking with availability check |
| "What's on the menu?" | Highlights popular dishes and categories |
| "Can I change my reservation to Saturday?" | Modifies the booking seamlessly |
| "Any vegan options?" | Recommends plant-based dishes |
| "Do you have anything gluten-free?" | Filters and suggests gluten-free items |

## 📄 License

This project is private. All rights reserved.
