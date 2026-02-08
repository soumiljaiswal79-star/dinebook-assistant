import { getMenuSummary, getMenuByCategory, checkAvailability } from "@/data/restaurantData";

export interface Message {
  id: string;
  role: "bot" | "user";
  content: string;
  timestamp: Date;
}

export interface ReservationDetails {
  date?: string;
  day?: string;
  time?: string;
  guests?: number;
  name?: string;
  phone?: string;
}

type BotState =
  | "idle"
  | "ask_date"
  | "ask_time"
  | "ask_guests"
  | "ask_name"
  | "ask_phone"
  | "confirm"
  | "modify_ask"
  | "cancel_confirm";

interface BotContext {
  state: BotState;
  reservation: ReservationDetails;
  confirmedReservation?: ReservationDetails;
}

const DAYS = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

function parseDay(input: string): { day: string; date: string } | null {
  const lower = input.toLowerCase().trim();

  // Check for day names
  for (const d of DAYS) {
    if (lower.includes(d)) {
      return { day: d.charAt(0).toUpperCase() + d.slice(1), date: d.charAt(0).toUpperCase() + d.slice(1) };
    }
  }

  // Check for "today", "tomorrow"
  const now = new Date();
  if (lower.includes("today")) {
    const dayName = DAYS[now.getDay()];
    return { day: dayName.charAt(0).toUpperCase() + dayName.slice(1), date: "Today" };
  }
  if (lower.includes("tomorrow")) {
    const tom = new Date(now);
    tom.setDate(tom.getDate() + 1);
    const dayName = DAYS[tom.getDay()];
    return { day: dayName.charAt(0).toUpperCase() + dayName.slice(1), date: "Tomorrow" };
  }

  return null;
}

function parseTime(input: string): string | null {
  const match = input.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm|AM|PM)?/);
  if (!match) return null;

  let hour = parseInt(match[1]);
  const minutes = match[2] || "00";
  const meridian = match[3]?.toUpperCase();

  if (meridian === "PM" && hour < 12) hour += 12;
  if (meridian === "AM" && hour === 12) hour = 0;
  if (!meridian && hour < 6) hour += 12; // assume PM for small numbers

  const h = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  const m = meridian || (hour >= 12 ? "PM" : "AM");
  return `${h}:${minutes} ${typeof m === "string" && m.length === 2 ? m : hour >= 12 ? "PM" : "AM"}`;
}

function parseGuests(input: string): number | null {
  const match = input.match(/(\d+)/);
  if (match) {
    const n = parseInt(match[1]);
    if (n >= 1 && n <= 20) return n;
  }
  return null;
}

function detectIntent(input: string): "reserve" | "menu" | "cancel" | "modify" | "hours" | "unknown" {
  const lower = input.toLowerCase();
  if (lower.match(/\b(reserve|book|table|reservation|booking|seat)\b/)) return "reserve";
  if (lower.match(/\b(menu|dish|food|eat|starter|dessert|drink|beverage|veg|non.?veg|vegan|biryani|chicken|paneer)\b/)) return "menu";
  if (lower.match(/\b(cancel|remove|delete)\b/)) return "cancel";
  if (lower.match(/\b(change|modify|update|reschedule)\b/)) return "modify";
  if (lower.match(/\b(hour|open|close|timing|schedule|available|availability)\b/)) return "hours";
  return "unknown";
}

export function createBotEngine() {
  let context: BotContext = {
    state: "idle",
    reservation: {},
  };

  function getGreeting(): string {
    return "Welcome to La Maison! I'm here to help you with table reservations, menu inquiries, or anything else you need. How may I assist you today?";
  }

  function processMessage(userInput: string): string {
    const input = userInput.trim();

    // Handle state-specific flows first
    switch (context.state) {
      case "ask_date": {
        const parsed = parseDay(input);
        if (parsed) {
          context.reservation.day = parsed.day;
          context.reservation.date = parsed.date;
          context.state = "ask_time";
          return `Great, ${parsed.date} it is. What time would you prefer? We serve lunch (12-2 PM) and dinner (7-9 PM).`;
        }
        return "I didn't catch the day. Could you please specify a day like Monday, Friday, or say 'today' or 'tomorrow'?";
      }

      case "ask_time": {
        const time = parseTime(input);
        if (time) {
          context.reservation.time = time;
          context.state = "ask_guests";
          return `${time} works. How many guests will be joining?`;
        }
        return "Could you please provide a time? For example, '7 PM' or '8:30 PM'.";
      }

      case "ask_guests": {
        const guests = parseGuests(input);
        if (guests) {
          context.reservation.guests = guests;

          // Check availability
          const result = checkAvailability(
            context.reservation.day!,
            context.reservation.time!,
            guests
          );

          if (result.available) {
            context.state = "ask_name";
            return `A table for ${guests} on ${context.reservation.date} at ${context.reservation.time} is available. May I have your name for the reservation?`;
          } else {
            const alts = result.alternatives;
            if (alts[0]?.includes("another day") || alts[0]?.includes("valid day")) {
              context.state = "ask_date";
              return `Unfortunately, no tables are available on ${context.reservation.date} for ${guests} guests. Would you like to try a different day?`;
            }
            context.state = "ask_time";
            return `Unfortunately, ${context.reservation.time} is fully booked for ${guests} guests. I can offer: ${alts.join(", ")}. Would any of these work?`;
          }
        }
        return "Please let me know the number of guests (1-20).";
      }

      case "ask_name": {
        if (input.length >= 2) {
          context.reservation.name = input;
          context.state = "ask_phone";
          return `Thank you, ${input}. Could I have a contact phone number?`;
        }
        return "Could you please share your name for the reservation?";
      }

      case "ask_phone": {
        const phoneMatch = input.match(/[\d\s\-+()]{7,}/);
        if (phoneMatch) {
          context.reservation.phone = phoneMatch[0].trim();
          context.state = "confirm";
          const r = context.reservation;
          return `Just to confirm:\n- **Date:** ${r.date} (${r.day})\n- **Time:** ${r.time}\n- **Guests:** ${r.guests}\n- **Name:** ${r.name}\n- **Phone:** ${r.phone}\n\nShall I proceed with the booking? (Yes/No)`;
        }
        return "Please provide a valid phone number.";
      }

      case "confirm": {
        if (input.toLowerCase().match(/\b(yes|yeah|yep|sure|confirm|proceed|ok|okay)\b/)) {
          context.confirmedReservation = { ...context.reservation };
          const r = context.confirmedReservation;
          context.state = "idle";
          context.reservation = {};
          return `Your reservation is confirmed!\n\n- **Date:** ${r.date} (${r.day})\n- **Time:** ${r.time}\n- **Guests:** ${r.guests}\n- **Name:** ${r.name}\n\nWe look forward to welcoming you at La Maison. Is there anything else I can help with?`;
        }
        if (input.toLowerCase().match(/\b(no|nope|cancel|nah)\b/)) {
          context.state = "idle";
          context.reservation = {};
          return "No problem, the reservation has been discarded. Feel free to start over whenever you're ready.";
        }
        return "Please confirm with 'Yes' to proceed or 'No' to cancel.";
      }

      case "cancel_confirm": {
        if (input.toLowerCase().match(/\b(yes|yeah|confirm|sure)\b/)) {
          context.confirmedReservation = undefined;
          context.state = "idle";
          return "Your reservation has been cancelled. If you'd like to rebook or need anything else, I'm here to help.";
        }
        context.state = "idle";
        return "The cancellation has been aborted. Your reservation remains intact. Anything else I can assist with?";
      }

      default:
        break;
    }

    // Detect intent from idle state
    const intent = detectIntent(input);

    switch (intent) {
      case "reserve":
        context.state = "ask_date";
        context.reservation = {};
        return "I'd be happy to help with a reservation. Which day would you like to dine with us?";

      case "menu": {
        // Check if they're asking about a specific category
        const lower = input.toLowerCase();
        if (lower.match(/\b(starter|appetizer)\b/)) return getMenuByCategory("starter");
        if (lower.match(/\b(main|course|entree)\b/)) return getMenuByCategory("main");
        if (lower.match(/\b(dessert|sweet)\b/)) return getMenuByCategory("dessert");
        if (lower.match(/\b(drink|beverage|wine|beer)\b/)) return getMenuByCategory("beverage");
        if (lower.match(/\b(veg|vegetarian)\b/) && !lower.includes("non")) return getMenuByCategory("vegetarian");
        if (lower.match(/\b(non.?veg|chicken|mutton|fish|prawn|lamb)\b/)) return getMenuByCategory("non-veg");
        if (lower.match(/\b(vegan)\b/)) return getMenuByCategory("vegan");
        if (lower.match(/\b(gluten)\b/)) return getMenuByCategory("gluten-free");
        return getMenuSummary();
      }

      case "cancel":
        if (context.confirmedReservation) {
          context.state = "cancel_confirm";
          const r = context.confirmedReservation;
          return `I have a reservation under **${r.name}** for ${r.guests} guests on ${r.date} at ${r.time}. Would you like to cancel it? (Yes/No)`;
        }
        return "I don't have any active reservation to cancel. Would you like to make a new one?";

      case "modify":
        if (context.confirmedReservation) {
          context.state = "ask_date";
          context.reservation = { ...context.confirmedReservation };
          return "Sure, let's update your reservation. Which day would you like to change it to?";
        }
        return "I don't have an active reservation to modify. Would you like to make a new booking?";

      case "hours":
        return "We are open every day:\n- **Lunch:** 12:00 PM - 3:00 PM\n- **Dinner:** 7:00 PM - 10:00 PM\n\nWould you like to make a reservation?";

      default:
        // Friendly fallback
        if (input.toLowerCase().match(/\b(hi|hello|hey|good morning|good evening|good afternoon)\b/)) {
          return "Hello! Welcome to La Maison. I can help you with reservations, menu information, or availability. What would you like to do?";
        }
        if (input.toLowerCase().match(/\b(thank|thanks|thx)\b/)) {
          return "You're welcome! It was a pleasure assisting you. Have a wonderful day!";
        }
        if (input.toLowerCase().match(/\b(bye|goodbye|see you)\b/)) {
          return "Goodbye! We look forward to seeing you at La Maison. Have a great day!";
        }
        return "I can help you with:\n- **Table reservations** — book, modify, or cancel\n- **Menu information** — dishes, categories, dietary options\n- **Availability** — check open slots\n\nWhat would you like to do?";
    }
  }

  return { getGreeting, processMessage };
}
