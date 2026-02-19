import { createContext, useState } from "react";
import Header from "../../components/Header";
import Timetable from "../../components/Timetable";
import Modal from "../../components/Modal";
import EditEntry from "../../components/EditEntryModal";
import LoadingScreen from "../../components/LoadingScreen";
import { validateEntryWithConflict } from "../../utils/confilctDetector";
import { usePersistence } from "../../context/PersistenceContext";

const EntryContext = createContext({});
const CurrentEntryContext = createContext({});
const FormDataContext = createContext({});
const CurrentViewContext = createContext({});

const defaultCategories = [
  { name: "Lecture", color: "#447ff8" },
  { name: "Study", color: "#10b981" },
  { name: "Assignment", color: "#f59e0b" },
  { name: "Exam", color: "#dc3545" },
  { name: "Lab", color: "#8b5cf6" },
  { name: "Other", color: "#6b7280" },
];

const initialFormData = {
  subject: "",
  day: "",
  date: "",
  startTime: "",
  endTime: "",
  notes: "",
  type: "once",
  recurrence: "weekly",
  id: "",
  category: "Lecture",
  color: "#447ff8",
};

const HomePage = () => {
  const { entries, addEntry, updateEntry, deleteEntry, loading } = usePersistence();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditEntryOpen, setIsEditEntryOpen] = useState(false);
  const [currentEntry, setCurrentEntry] = useState({});
  const [formData, setFormDataAdd] = useState(initialFormData);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem("Categories");
    return saved ? JSON.parse(saved) : defaultCategories;
  });

  const addCategory = (newCat) => {
    if (categories.some((c) => c.name.toLowerCase() === newCat.name.toLowerCase())) return;
    const newCats = [...categories, newCat];
    setCategories(newCats);
    localStorage.setItem("Categories", JSON.stringify(newCats));
  };

  // ─── Date helpers ─────────────────────────────────────────────────────────

  const doesDateMatchEntry = (entry, targetDate) => {
    if (entry.type === "once" && entry.date) {
      const entryDate = new Date(entry.date);
      return (
        entryDate.getFullYear() === targetDate.getFullYear() &&
        entryDate.getMonth() === targetDate.getMonth() &&
        entryDate.getDate() === targetDate.getDate()
      );
    }
    if (entry.type === "recurring" || !entry.type) {
      const dayName = targetDate.toLocaleDateString("en-US", { weekday: "long" });
      return entry.day === dayName;
    }
    return false;
  };

  const getEntriesForDate = (targetDate) =>
    entries.filter((entry) => doesDateMatchEntry(entry, targetDate));

  // ─── CRUD wrappers ────────────────────────────────────────────────────────

  const addEntries = async (entry) => {
    const validation = validateEntryWithConflict(entries, entry, false);
    if (!validation.isValid) {
      alert(validation.message);
      return false;
    }
    const success = await addEntry(entry);
    if (success) setFormDataAdd(initialFormData);
    return success;
  };

  const addMultipleEntries = async (entriesArray) => {
    const results = { successful: [], failed: [] };

    for (const entry of entriesArray) {
      const entryWithId = {
        ...entry,
        id:
          entry.type === "once"
            ? `${entry.subject}-${entry.date}-${entry.startTime}`
            : `${entry.subject}-${entry.day}-${entry.startTime}`,
      };

      const validation = validateEntryWithConflict(entries, entryWithId, false);
      if (!validation.isValid) {
        results.failed.push({ entry: entryWithId, reason: validation.message });
      } else {
        const success = await addEntry(entryWithId);
        if (success) {
          results.successful.push(entryWithId);
        } else {
          results.failed.push({ entry: entryWithId, reason: "Failed to save" });
        }
      }
    }

    return results;
  };

  const deleteEntries = async (entry) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this timetable entry? This action cannot be undone."
    );
    if (!confirm) return false;

    const idToDelete = entry.firestoreId || entry.id;
    return await deleteEntry(idToDelete);
  };

  const deleteMultipleEntries = async (entriesArray) => {
    // Match each requested entry against actual entries in state to get valid IDs
    const resolvedEntries = [];

    for (const requested of entriesArray) {
      // Try to find the matching entry in the current entries list
      const match = entries.find((e) => {
        const eId = e.firestoreId || e.id;
        const rId = requested.firestoreId || requested.id;
        // Match by firestoreId/id first, then fall back to subject+day+time
        if (eId && rId && eId !== 'N/A' && rId !== 'N/A' && eId === rId) return true;
        return (
          e.subject === requested.subject &&
          e.day === requested.day &&
          e.startTime === requested.startTime
        );
      });

      if (match) {
        const validId = match.firestoreId || match.id;
        if (validId && validId !== 'N/A') {
          resolvedEntries.push({ ...match, _resolvedId: validId });
        }
      }
    }

    if (resolvedEntries.length === 0) {
      return { deletedCount: 0, requestedCount: entriesArray.length };
    }

    let deletedCount = 0;
    for (const entry of resolvedEntries) {
      const success = await deleteEntry(entry._resolvedId);
      if (success) deletedCount++;
    }
    return { deletedCount, requestedCount: entriesArray.length };
  };

  const updateEntries = async (updatedEntry) => {
    const oldId = updatedEntry.oldId || updatedEntry.id;
    const existingEntry = entries.find(
      (e) => (e.firestoreId || e.id) === oldId
    );

    if (!existingEntry) {
      alert("Could not find the entry to update. Please try again.");
      return false;
    }

    const validation = validateEntryWithConflict(entries, updatedEntry, true);
    if (!validation.isValid) {
      alert(validation.message);
      return false;
    }

    const entryToSave = {
      ...updatedEntry,
      firestoreId: existingEntry.firestoreId || existingEntry.id,
      id:
        updatedEntry.type === "once"
          ? `${updatedEntry.subject}-${updatedEntry.date}-${updatedEntry.startTime}`
          : `${updatedEntry.subject}-${updatedEntry.day}-${updatedEntry.startTime}`,
    };

    return await updateEntry(entryToSave);
  };

  // ─── Modal helpers ────────────────────────────────────────────────────────

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const handleOpenEntryModal = () => setIsEditEntryOpen(true);
  const handleCloseOpenEntryModal = () => setIsEditEntryOpen(false);

  // ─── Loading state ────────────────────────────────────────────────────────

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <EntryContext.Provider
      value={{
        entries,
        addEntries,
        deleteEntries,
        handleCloseModal,
        handleOpenEntryModal,
        handleCloseOpenEntryModal,
        updateEntries,
        addMultipleEntries,
        deleteMultipleEntries,
        getEntriesForDate,
        categories,
        addCategory,
      }}
    >
      <CurrentEntryContext.Provider value={{ currentEntry, setCurrentEntry }}>
        <FormDataContext.Provider value={{ formData, setFormDataAdd }}>
          <CurrentViewContext.Provider value={{ currentDate, setCurrentDate }}>
            <Header onOpenModal={handleOpenModal} />
            <Timetable />
            {isModalOpen && <Modal onClose={handleCloseModal} />}
            {isEditEntryOpen && <EditEntry onClose={handleCloseOpenEntryModal} />}
          </CurrentViewContext.Provider>
        </FormDataContext.Provider>
      </CurrentEntryContext.Provider>
    </EntryContext.Provider>
  );
};

export default HomePage;
export { EntryContext, CurrentEntryContext, FormDataContext, CurrentViewContext };