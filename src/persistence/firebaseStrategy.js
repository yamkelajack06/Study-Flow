import { db } from "../services/firebase";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';

// Firestore path: /users/{userId}/entries

export class FirebaseStrategy {
  constructor(userId) {
    this.userId = userId;
    this.collectionRef = collection(db, 'users', userId, 'entries');
  }

  async getEntries() {
    try {
      const snapshot = await getDocs(this.collectionRef);
      return snapshot.docs.map((d) => ({ firestoreId: d.id, ...d.data() }));
    } catch (error) {
      console.error('Error fetching entries from Firebase:', error);
      return [];
    }
  }

  async addEntry(entry) {
    try {
      // Remove local 'id' field — Firestore generates its own document ID
      const { id, ...data } = entry;
      const docRef = await addDoc(this.collectionRef, data);
      return { firestoreId: docRef.id, ...data };
    } catch (error) {
      console.error('Error adding entry to Firebase:', error);
      throw error;
    }
  }

  async updateEntry(entry) {
    try {
      // We store the Firestore doc ID as 'firestoreId'
      const firestoreId = entry.firestoreId || entry.id;
      const entryRef = doc(db, 'users', this.userId, 'entries', firestoreId);
      const { firestoreId: _fid, ...data } = entry;
      await updateDoc(entryRef, data);
      return entry;
    } catch (error) {
      console.error('Error updating entry in Firebase:', error);
      throw error;
    }
  }

  async deleteEntry(entryId) {
    try {
      // Guard against invalid IDs (e.g. legacy local entries with id "N/A" or
      // composite ids that contain slashes — these would make Firestore paths invalid)
      if (!entryId || entryId === 'N/A' || String(entryId).includes('/')) {
        throw new Error(
          `Invalid Firestore document ID: "${entryId}". ` +
          `This entry may have been created locally before sign-in. ` +
          `Please refresh and try again.`
        );
      }
      const entryRef = doc(db, 'users', this.userId, 'entries', entryId);
      await deleteDoc(entryRef);
    } catch (error) {
      console.error('Error deleting entry from Firebase:', error);
      throw error;
    }
  }

  // Used on first sign-in to migrate local entries to Firestore
  async migrateFromLocal(localEntries) {
    const migrated = [];
    for (const entry of localEntries) {
      try {
        const { id, ...data } = entry;
        const docRef = await addDoc(this.collectionRef, data);
        migrated.push({ firestoreId: docRef.id, ...data });
      } catch (error) {
        console.error('Migration error for entry:', entry, error);
      }
    }
    return migrated;
  }
}