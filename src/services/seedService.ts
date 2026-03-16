import { db, auth, handleFirestoreError, OperationType } from '../firebase';
import { collection, addDoc, serverTimestamp, getDocs, query, limit } from 'firebase/firestore';

const DUMMY_BOOKS = [
// ... existing books ...
  {
    title: 'Qalandar Shaoor',
    author: 'Hazrat Khwaja Shamsuddin Azeemi',
    coverUrl: 'https://picsum.photos/seed/qalandar/400/600',
    description: 'A masterpiece on spiritual consciousness and the path of the Qalandar.',
    category: 'Philosophy',
    pdfUrl: '#',
    tags: ['Sufism', 'Consciousness']
  },
  {
    title: 'Loh-o-Qalam',
    author: 'Hazrat Khwaja Shamsuddin Azeemi',
    coverUrl: 'https://picsum.photos/seed/loh/400/600',
    description: 'Exploring the divine pen and the secrets of creation.',
    category: 'Metaphysics',
    pdfUrl: '#',
    tags: ['Creation', 'Divine']
  },
  {
    title: 'Roohani Ilaj',
    author: 'Hazrat Khwaja Shamsuddin Azeemi',
    coverUrl: 'https://picsum.photos/seed/healing/400/600',
    description: 'A comprehensive guide to spiritual healing and remedies.',
    category: 'Healing',
    pdfUrl: '#',
    tags: ['Healing', 'Remedies']
  },
  {
    title: 'Muraqaba',
    author: 'Hazrat Khwaja Shamsuddin Azeemi',
    coverUrl: 'https://picsum.photos/seed/muraqaba/400/600',
    description: 'The art and science of Sufi meditation.',
    category: 'Practice',
    pdfUrl: '#',
    tags: ['Meditation', 'Focus']
  },
  {
    title: 'Tazkira-e-Qalandar Baba Auliya',
    author: 'Hazrat Khwaja Shamsuddin Azeemi',
    coverUrl: 'https://picsum.photos/seed/auliya/400/600',
    description: 'Biography and teachings of the great Sufi master.',
    category: 'Biography',
    pdfUrl: '#',
    tags: ['History', 'Master']
  }
];

const DUMMY_HEALING = [
  { patientName: 'Ahmed Khan', issue: 'Chronic Migraine', status: 'Completed' },
  { patientName: 'Sara Ali', issue: 'Spiritual Anxiety', status: 'Processing' },
  { patientName: 'Zainab Bibi', issue: 'Evil Eye Protection', status: 'Received' },
  { patientName: 'Omar Farooq', issue: 'Insomnia', status: 'Processing' },
  { patientName: 'Fatima Zahra', issue: 'Lack of Focus in Prayer', status: 'Completed' },
  { patientName: 'Bilal Hassan', issue: 'Financial Hardship Stress', status: 'Received' },
  { patientName: 'Mariam Siddiqui', issue: 'Joint Pain', status: 'Processing' },
  { patientName: 'Usman Sheikh', issue: 'Negative Thoughts', status: 'Completed' },
  { patientName: 'Hina Pervez', issue: 'Family Harmony', status: 'Received' },
  { patientName: 'Kamran Akmal', issue: 'Career Guidance', status: 'Processing' }
];

export const seedDatabase = async () => {
  try {
    // Wait for auth to initialize
    let attempts = 0;
    while (!auth.currentUser && attempts < 10) {
      await new Promise(r => setTimeout(r, 500));
      attempts++;
    }

    if (!auth.currentUser || auth.currentUser.email !== "sameerupwork25@gmail.com") {
      console.log('Seeding skipped: User not authorized or not logged in.');
      return;
    }

    // Check if already seeded
    const bookSnap = await getDocs(query(collection(db, 'library_books'), limit(1)));
    if (!bookSnap.empty) {
      console.log('Database already contains data. Skipping seed.');
      return;
    }

    console.log('Starting database seed...');

    // Seed Books
    for (const book of DUMMY_BOOKS) {
      try {
        await addDoc(collection(db, 'library_books'), book);
      } catch (e) {
        handleFirestoreError(e, OperationType.CREATE, 'library_books');
      }
    }

    // Seed Healing Ledger
    for (const req of DUMMY_HEALING) {
      try {
        await addDoc(collection(db, 'healing_ledger'), {
          ...req,
          userId: 'system_seed',
          createdAt: serverTimestamp()
        });
      } catch (e) {
        handleFirestoreError(e, OperationType.CREATE, 'healing_ledger');
      }
    }

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};
