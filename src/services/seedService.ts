import { db, auth, handleFirestoreError, OperationType } from "../firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  query,
  limit,
} from "firebase/firestore";

import { LARGE_BOOK_DATA } from "../data/books";

const DUMMY_BOOKS = LARGE_BOOK_DATA;

const DUMMY_HEALING = [
  { patientName: "Ahmed Khan", issue: "Chronic Migraine", status: "Completed" },
  { patientName: "Sara Ali", issue: "Spiritual Anxiety", status: "Processing" },
  {
    patientName: "Zainab Bibi",
    issue: "Evil Eye Protection",
    status: "Received",
  },
  { patientName: "Omar Farooq", issue: "Insomnia", status: "Processing" },
  {
    patientName: "Fatima Zahra",
    issue: "Lack of Focus in Prayer",
    status: "Completed",
  },
  {
    patientName: "Bilal Hassan",
    issue: "Financial Hardship Stress",
    status: "Received",
  },
  { patientName: "Mariam Siddiqui", issue: "Joint Pain", status: "Processing" },
  {
    patientName: "Usman Sheikh",
    issue: "Negative Thoughts",
    status: "Completed",
  },
  { patientName: "Hina Pervez", issue: "Family Harmony", status: "Received" },
  {
    patientName: "Kamran Akmal",
    issue: "Career Guidance",
    status: "Processing",
  },
];

export const seedDatabase = async () => {
  try {
    // Wait for auth to initialize
    let attempts = 0;
    while (!auth.currentUser && attempts < 10) {
      await new Promise((r) => setTimeout(r, 500));
      attempts++;
    }

    // If the app is running in a real environment, we may want to gate seeding behind a known admin account.
    // For local development / preview, allow seeding even when no user is signed in.
    if (
      auth.currentUser &&
      auth.currentUser.email !== "sameerupwork25@gmail.com"
    ) {
      console.log(
        `Seeding proceeding as user ${auth.currentUser.email} (not restricted to a specific admin account).`,
      );
    } else if (!auth.currentUser) {
      console.log(
        "Seeding proceeding without an authenticated user (development mode).",
      );
    }

    // Check if already seeded
    const bookSnap = await getDocs(
      query(collection(db, "library_books"), limit(1)),
    );
    if (!bookSnap.empty) {
      console.log("Database already contains data. Skipping seed.");
      return;
    }

    console.log("Starting database seed...");

    // Seed Books
    for (const book of DUMMY_BOOKS) {
      try {
        await addDoc(collection(db, "library_books"), book);
      } catch (e) {
        handleFirestoreError(e, OperationType.CREATE, "library_books");
      }
    }

    // Seed Healing Ledger
    for (const req of DUMMY_HEALING) {
      try {
        await addDoc(collection(db, "healing_ledger"), {
          ...req,
          userId: "system_seed",
          createdAt: serverTimestamp(),
        });
      } catch (e) {
        handleFirestoreError(e, OperationType.CREATE, "healing_ledger");
      }
    }

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};
