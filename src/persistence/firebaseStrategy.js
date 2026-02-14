import { db } from '../services/firebase';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { validateEntryWithConflict } from '../utils/confilctDetector';

// Firestore collections will be structured as: /users/{userId}/entries

/**
 * Gets the reference to the 'entries' collection for a specific user.
 * @param {Object} user - The current user object from Firebase Auth.
 * @returns {CollectionReference} A reference to the user's entries subcollection.
 */
const getEntriesCollectionRef = (user) => {
    if (!user) throw new Error("User not authenticated.");
    return collection(db, 'users', user.uid, 'entries');
};

/**
 * Retrieves all entries from Firestore for the logged-in user.
 * @param {Object} user - The current user object from Firebase Auth.
 * @returns {Promise<Array>} A promise that resolves to the array of entries.
 */
export const getEntries = async (user) => {
    if (!user) return []; // No user, no entries
    try {
        const entriesRef = getEntriesCollectionRef(user);
        const snapshot = await getDocs(entriesRef);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error fetching entries from Firebase:", error);
        alert("Could not fetch your timetable. Please try again later.");
        return [];
    }
};

/**
 * Adds a new entry to Firestore after validation.
 * @param {Array} currentEntries - The current list of entries from the state.
 * @param {Object} entry - The new entry to add.
 * @param {Object} user - The current user object from Firebase Auth.
 * @returns {Promise<Array|null>} The updated list of entries, or null if validation fails.
 */
export const addEntry = async (currentEntries, entry, user) => {
    const validation = validateEntryWithConflict(currentEntries, entry, false);
    if (!validation.isValid) {
        alert(validation.message);
        return null;
    }

    try {
        const entriesRef = getEntriesCollectionRef(user);
        // The 'id' in the object is a custom one, Firestore will generate its own unique document ID.
        // We'll add our custom ID as a field in the document for potential use, but rely on Firestore's ID.
        const docRef = await addDoc(entriesRef, entry);
        const newEntry = { id: docRef.id, ...entry };
        return [...currentEntries, newEntry];
    } catch (error) {
        console.error("Error adding entry to Firebase:", error);
        alert("Failed to add entry. Please check your connection and try again.");
        return null;
    }
};

/**
 * Updates an existing entry in Firestore after validation.
 * @param {Array} currentEntries - The current list of entries.
 * @param {Object} updatedEntry - The entry with updated data.
 * @param {Object} user - The current user object from Firebase Auth.
 * @returns {Promise<Array|null>} The updated list of entries, or null if validation fails.
 */
export const updateEntry = async (currentEntries, updatedEntry, user) => {
    const validation = validateEntryWithConflict(currentEntries, updatedEntry, true);
    if (!validation.isValid) {
        alert(validation.message);
        return null;
    }

    try {
        const entryRef = doc(db, 'users', user.uid, 'entries', updatedEntry.id);
        // Exclude the 'id' field from the object being written to Firestore
        const { id, ...dataToUpdate } = updatedEntry;
        await updateDoc(entryRef, dataToUpdate);
        
        return currentEntries.map(e => e.id === id ? updatedEntry : e);
    } catch (error) {
        console.error("Error updating entry in Firebase:", error);
        alert("Failed to update entry. Please check your connection and try again.");
        return null;
    }
};

/**
 * Deletes an entry from Firestore after user confirmation.
 * @param {Array} currentEntries - The current list of entries.
 * @param {string} entryId - The ID of the entry to delete.
 * @param {Object} user - The current user object from Firebase Auth.
 * @returns {Promise<Array|null>} The updated list of entries, or null if the user cancels.
 */
export const deleteEntry = async (currentEntries, entryId, user) => {
    const confirm = window.confirm("Are you sure you want to delete this timetable entry? This action cannot be undone.");
    if (!confirm) return null;

    try {
        const entryRef = doc(db, 'users', user.uid, 'entries', entryId);
        await deleteDoc(entryRef);
        return currentEntries.filter(entry => entry.id !== entryId);
    } catch (error) {
        console.error("Error deleting entry from Firebase:", error);
        alert("Failed to delete entry. Please check your connection and try again.");
        return null;
    }
};

/**
 * Adds multiple entries to Firestore, used for data migration.
 * @param {Array} entriesToUpload - An array of entry objects to upload.
 * @param {Object} user - The current user object from Firebase Auth.
 * @returns {Promise<Array>} The array of newly created entries with their Firestore IDs.
 */
export const addMultipleEntries = async (entriesToUpload, user) => {
    if (!user) return [];
    const entriesRef = getEntriesCollectionRef(user);
    const uploadedEntries = [];

    for (const entry of entriesToUpload) {
        try {
            // We don't need to validate conflicts for a first-time upload.
            // Exclude the old local 'id' field from the object being written.
            const { id, ...dataToUpload } = entry;
            const docRef = await addDoc(entriesRef, dataToUpload);
            uploadedEntries.push({ id: docRef.id, ...dataToUpload });
        } catch(error) {
            console.error("Error uploading an entry during migration:", error);
            // Decide if we should continue or stop on error. For now, we continue.
        }
    }
    return uploadedEntries;
};

export FirebaseStrategy