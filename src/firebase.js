import { initializeApp } from 'firebase/app';
import {
    getFirestore,
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    orderBy,
    query,
    serverTimestamp,
} from 'firebase/firestore';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const COLLECTION = 'journal_entries';

// ── Read all entries (ordered) ──
export async function fetchJournalEntries() {
    const q = query(collection(db, COLLECTION), orderBy('order', 'asc'));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// ── Create entry ──
export async function addJournalEntry(entry) {
    const docRef = await addDoc(collection(db, COLLECTION), {
        ...entry,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });
    return docRef.id;
}

// ── Update entry ──
export async function updateJournalEntry(id, data) {
    const ref = doc(db, COLLECTION, id);
    await updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
}

// ── Delete entry ──
export async function deleteJournalEntry(id) {
    const ref = doc(db, COLLECTION, id);
    await deleteDoc(ref);
}

export { db };
