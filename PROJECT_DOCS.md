# La Maison — Project Documentation

## Overview

La Maison is an AI-powered restaurant concierge chatbot built as a single-page React application. It helps guests book tables, explore the menu, and check availability through natural conversation.

## Quick Start

```bash
npm install
npm run dev
```

App runs at `http://localhost:5173`.

## Tech Stack

| Layer      | Technology                                    |
|------------|-----------------------------------------------|
| Frontend   | React 18, TypeScript, Vite, Tailwind CSS      |
| UI Library | shadcn/ui, Framer Motion                      |
| AI Backend | Lovable Cloud Edge Functions → Gemini 3 Flash |
| Streaming  | Server-Sent Events (SSE)                      |

## Key Files

| File                              | Purpose                                |
|-----------------------------------|----------------------------------------|
| `src/pages/Index.tsx`             | Landing page (hero + chat panel)       |
| `src/components/ChatWindow.tsx`   | Chat UI, message state, quick actions  |
| `src/components/ChatMessage.tsx`  | Message bubble with markdown rendering |
| `src/lib/chatApi.ts`             | SSE streaming client                   |
| `src/data/restaurantData.ts`     | Menu, availability, helper functions   |
| `supabase/functions/chat/index.ts`| Edge function — AI gateway proxy       |

## How It Works

1. User sends a message → `ChatWindow` appends it to state
2. `streamChat()` sends conversation history to the edge function
3. Edge function prepends a system prompt and forwards to the AI gateway
4. Response streams back token-by-token via SSE
5. UI renders each token progressively with markdown support

## Restaurant Details

- **Name**: La Maison
- **Cuisine**: Indian & Continental
- **Location**: 42 Heritage Lane, New Delhi
- **Hours**: Lunch 12–3 PM, Dinner 7–10 PM (daily)
- **Tables**: 2, 4, 6, 8 guests (up to 20 with arrangement)

## Design

- **Fonts**: Playfair Display (headings), Lato (body)
- **Theme**: Dark-first with custom chat bubble tokens
- **Layout**: Split-panel desktop (hero/chat), full-width mobile

## Environment Variables

| Variable                         | Description                  |
|----------------------------------|------------------------------|
| `VITE_SUPABASE_URL`             | Backend URL                  |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Public API key               |
| `LOVABLE_API_KEY` (server-side) | AI Gateway secret            |

## License

Private. All rights reserved.
