export interface Book {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  description: string;
  category: string;
  pdfUrl: string;
  tags: string[];
}

export interface ReadingProgress {
  id: string;
  userId: string;
  bookId: string;
  progress: number;
  lastReadPage: number;
  updatedAt: any;
}

export interface HealingRequest {
  id: string;
  userId: string;
  patientName: string;
  issue: string;
  status: 'Received' | 'Processing' | 'Completed';
  createdAt: any;
}

export interface UserNote {
  id: string;
  userId: string;
  bookId?: string;
  content: string;
  highlightedText?: string;
  createdAt: any;
}

export interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
  citations?: { text: string; page: number; bookTitle: string }[];
}
