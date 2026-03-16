import { Book } from "../types";

// Mock data for previewing the library UI when the backend is not connected.
// Designed to match the shape of Book objects returned from Firestore.
export const MOCK_BOOKS: Book[] = [
  {
    id: "mock-1",
    title: "The Power of Habit",
    author: "Charles Duhigg",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780812981605-L.jpg",
    description:
      "Why we do what we do in life and business, and how to change it.",
    category: "Self-Help",
    pdfUrl: "#",
    tags: ["Habits", "Productivity"],
  },
  {
    id: "mock-2",
    title: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780374533557-L.jpg",
    description:
      "A groundbreaking tour of the mind, explaining the two systems that drive the way we think.",
    category: "Psychology",
    pdfUrl: "#",
    tags: ["Cognition", "Decision-making"],
  },
  {
    id: "mock-3",
    title: "The Alchemist",
    author: "Paulo Coelho",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780061122415-L.jpg",
    description:
      "A fable about following your dreams and listening to your heart.",
    category: "Fiction",
    pdfUrl: "#",
    tags: ["Journey", "Inspiration"],
  },
  {
    id: "mock-4",
    title: "Atomic Habits",
    author: "James Clear",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780735211292-L.jpg",
    description:
      "An easy & proven way to build good habits and break bad ones.",
    category: "Self-Help",
    pdfUrl: "#",
    tags: ["Habits", "Change"],
  },
  {
    id: "mock-5",
    title: "Sapiens: A Brief History of Humankind",
    author: "Yuval Noah Harari",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780062316097-L.jpg",
    description:
      "A sweeping narrative of humanity’s evolution, culture, and future.",
    category: "History",
    pdfUrl: "#",
    tags: ["Anthropology", "Society"],
  },
  {
    id: "mock-6",
    title: "The Four Agreements",
    author: "Don Miguel Ruiz",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9781878424310-L.jpg",
    description:
      "A practical guide to personal freedom through four spiritual principles.",
    category: "Self-Help",
    pdfUrl: "#",
    tags: ["Wisdom", "Freedom"],
  },
  {
    id: "mock-7",
    title: "Meditations",
    author: "Marcus Aurelius",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780140449334-L.jpg",
    description:
      "Personal writings of the Roman emperor on Stoic philosophy and inner discipline.",
    category: "Philosophy",
    pdfUrl: "#",
    tags: ["Stoicism", "Reflection"],
  },
  {
    id: "mock-8",
    title: "The Art of Happiness",
    author: "Dalai Lama XIV",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9781594488894-L.jpg",
    description: "A conversation on cultivating lasting happiness.",
    category: "Spirituality",
    pdfUrl: "#",
    tags: ["Happiness", "Mind"],
  },
  {
    id: "mock-9",
    title: "Man’s Search for Meaning",
    author: "Viktor E. Frankl",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780807014271-L.jpg",
    description:
      "A psychiatrist’s memoir on finding purpose through suffering and resilience.",
    category: "Philosophy",
    pdfUrl: "#",
    tags: ["Purpose", "Resilience"],
  },
  {
    id: "mock-10",
    title: "The Power of Now",
    author: "Eckhart Tolle",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9781577314806-L.jpg",
    description:
      "A guide to spiritual enlightenment through presence and mindfulness.",
    category: "Practice",
    pdfUrl: "#",
    tags: ["Mindfulness", "Presence"],
  },
];
