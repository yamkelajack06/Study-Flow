import { validateEntryWithConflict } from '../utils/confilctDetector';

const ENTRIES_KEY = 'Entries';

/**
 * Retrieves all entries from localStorage.
 * @param {Object} [user] - The current user (unused in this strategy).
 * @returns {Promise<Array>} A promise that resolves to the array of entries.
 */
export const getEntries = async (user) => {
    const savedEntries = localStorage.getItem(ENTRIES_KEY);
    return savedEntries ? JSON.parse(savedEntries) : [];
};

/**
 * Saves a list of entries to localStorage.
 * @param {Array} entries - The array of entries to save.
 */
const saveEntries = (entries) => {
    localStorage.setItem(ENTRIES_KEY, JSON.stringify(entries));
};

/**
 * Adds a new entry after validation.
 * @param {Array} currentEntries - The current list of entries.
 * @param {Object} entry - The new entry to add.
 * @param {Object} [user] - The current user (unused in this strategy).
 * @returns {Promise<Array|null>} The updated list of entries, or null if validation fails.
 */
export const addEntry = async (currentEntries, entry, user) => {
    const validation = validateEntryWithConflict(currentEntries, entry, false);
    if (!validation.isValid) {
        alert(validation.message);
        return null;
    }
    const newEntries = [...currentEntries, entry];
    saveEntries(newEntries);
    return newEntries;
};

/**
 * Updates an existing entry after validation.
 * @param {Array} currentEntries - The current list of entries.
 * @param {Object} updatedEntry - The entry with updated data.
 * @param {Object} [user] - The current user (unused in this strategy).
 * @returns {Promise<Array|null>} The updated list of entries, or null if validation fails or the entry doesn't exist.
 */
export const updateEntry = async (currentEntries, updatedEntry, user) => {
    const oldId = updatedEntry.oldId || updatedEntry.id;
    const existingEntry = currentEntries.find(entry => entry.id === oldId);
    if (!existingEntry) {
        alert(`Could not find the entry to update.`);
        return null;
    }

    const validation = validateEntryWithConflict(currentEntries, updatedEntry, true);
    if (!validation.isValid) {
        alert(validation.message);
        return null;
    }

    // Create a new ID in case key fields (subject, day, time) changed
    const newId = `${updatedEntry.subject}-${updatedEntry.day}-${updatedEntry.startTime}`;
    const newEntries = currentEntries.map(entry =>
        entry.id === oldId ? { ...updatedEntry, id: newId } : entry
    );
    saveEntries(newEntries);
    return newEntries;
};

/**
 * Deletes an entry after user confirmation.
 * @param {Array} currentEntries - The current list of entries.
 * @param {string} entryId - The ID of the entry to delete.
 * @param {Object} [user] - The current user (unused in this strategy).
 * @returns {Promise<Array|null>} The updated list of entries, or null if the user cancels.
 */
export const deleteEntry = async (currentEntries, entryId, user) => {
    const confirm = window.confirm("Are you sure you want to delete this timetable entry? This action cannot be undone.");
    if (confirm) {
        const newEntries = currentEntries.filter(entry => entry.id !== entryId);
        saveEntries(newEntries);
        return newEntries;
    }
    return null;
};

/**
 * Clears all entries from local storage.
 * Used after migrating data to a new persistence strategy.
 */
export const clearEntries = async () => {
    localStorage.removeItem(ENTRIES_KEY);
};
