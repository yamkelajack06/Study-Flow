import { createContext, useState } from "react";
import Header from "../../components/Header";
import Timetable from "../../components/Timetable";
import Modal from "../../components/Modal";
import EditEntry from "../../components/EditEntryModal";
import { validateEntryWithConflict } from "../../utils/confilctDetector";

const EntryContext = createContext({});
const CurrentEntryContext = createContext({});
const FormDataContext = createContext({});
const CurrentViewContext = createContext({});


const initialFormData = {
  subject: "",
  day: "",
  date: "",
  startTime: "",
  endTime: "",
  notes: "",
  type: "once", // "once" or "recurring"
  recurrence: "weekly", // "weekly", "biweekly", "monthly"
  id: "",
};

const HomePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditEntryOpen, setIsEditEntryOpen] = useState(false);
  const [entries, setEntries] = useState(() => {
    const savedEntries = localStorage.getItem("Entries");
    return savedEntries ? JSON.parse(savedEntries) : [];
  });
  const [currentEntry, setCurrentEntry] = useState({});
  const [formData, setFormDataAdd] = useState(initialFormData);
  const [currentDate, setCurrentDate] = useState(new Date());

  // Helper function to check if a date matches an entry
  const doesDateMatchEntry = (entry, targetDate) => {
    // For one-time entries, check exact date match
    if (entry.type === "once" && entry.date) {
      const entryDate = new Date(entry.date);
      return (
        entryDate.getFullYear() === targetDate.getFullYear() &&
        entryDate.getMonth() === targetDate.getMonth() &&
        entryDate.getDate() === targetDate.getDate()
      );
    }

    // For recurring entries, check day name match
    if (entry.type === "recurring" || !entry.type) {
      const dayName = targetDate.toLocaleDateString("en-US", { weekday: "long" });
      return entry.day === dayName;
    }

    return false;
  };

  // Filter entries for a specific date (used by Day/Month views)
  const getEntriesForDate = (targetDate) => {
    return entries.filter(entry => doesDateMatchEntry(entry, targetDate));
  };

  const addEntries = (entry) => {
    const validation = validateEntryWithConflict(entries, entry, false);

    if (!validation.isValid) {
      alert(validation.message);
      return false;
    } else {
      const newEntries = [...entries, entry];
      setEntries(newEntries);
      localStorage.setItem("Entries", JSON.stringify(newEntries));
      setFormDataAdd(initialFormData);
      return true;
    }
  };

  const addMultipleEntries = (entriesArray) => {
    const results = {
      successful: [],
      failed: [],
    };

    entriesArray.forEach((entry) => {
      const entryWithId = {
        ...entry,
        id: entry.type === "once" 
          ? `${entry.subject}-${entry.date}-${entry.startTime}`
          : `${entry.subject}-${entry.day}-${entry.startTime}`,
      };

      const validation = validateEntryWithConflict(entries, entryWithId, false);

      if (!validation.isValid) {
        results.failed.push({
          entry: entryWithId,
          reason: validation.message,
        });
      } else {
        results.successful.push(entryWithId);
      }
    });

    // Only add successful entries
    if (results.successful.length > 0) {
      const newEntries = [...entries, ...results.successful];
      setEntries(newEntries);
      localStorage.setItem("Entries", JSON.stringify(newEntries));
    }

    return results;
  };

  const deleteEntries = (Entry) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this timetable entry? This action cannot be undone."
    );
    if (confirm) {
      const newEntries = entries.filter((entry) => entry.id !== Entry.id);
      setEntries(newEntries);
      localStorage.setItem("Entries", JSON.stringify(newEntries));
      return true;
    }
    return false;
  };

  const deleteMultipleEntries = (entriesArray) => {
    const idsToDelete = entriesArray.map((entry) => entry.id);
    const newEntries = entries.filter(
      (entry) => !idsToDelete.includes(entry.id)
    );

    setEntries(newEntries);
    localStorage.setItem("Entries", JSON.stringify(newEntries));

    return {
      deletedCount: entries.length - newEntries.length,
      requestedCount: idsToDelete.length,
    };
  };

  const updateEntries = (updatedEntry) => {
    //Find the entry to update using id from A
    const oldId = updatedEntry.oldId || updatedEntry.id;

    // Check if entry exists
    const existingEntry = entries.find((entry) => entry.id === oldId);
    if (!existingEntry) {
      alert(`Could not find the entry to update. Please try again.`);
      return false;
    }

    const validation = validateEntryWithConflict(entries, updatedEntry, true);

    if (!validation.isValid) {
      alert(validation.message);
      return false;
    } else {
      // Generate new ID based on entry type
      const newId = updatedEntry.type === "once"
        ? `${updatedEntry.subject}-${updatedEntry.date}-${updatedEntry.startTime}`
        : `${updatedEntry.subject}-${updatedEntry.day}-${updatedEntry.startTime}`;

      const updatedEntries = entries.map((entry) =>
        entry.id === oldId ? { ...updatedEntry, id: newId } : entry
      );
      setEntries(updatedEntries);
      localStorage.setItem("Entries", JSON.stringify(updatedEntries));
      return true;
    }
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const handleOpenEntryModal = () => setIsEditEntryOpen(true);
  const handleCloseOpenEntryModal = () => setIsEditEntryOpen(false);

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
