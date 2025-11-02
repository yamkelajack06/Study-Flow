import { createContext, useState } from "react";
import Header from "../../components/Header";
import Timetable from "../../components/Timetable";
import Modal from "../../components/Modal";
import EditEntry from "../../components/EditEntryModal";
import { validateEntryWithConflict } from "../../utils/confilctDetector";

const EntryContext = createContext({});
const CurrentEntryContext = createContext({});
const FormDataContext = createContext({});

const initialFormData = {
  subject: "",
  day: "",
  startTime: "",
  endTime: "",
  notes: "",
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
      //Unique ID for each entry added dynamically by the AI
      const entryWithId = {
        ...entry,
        id: `${entry.subject}-${entry.day}-${entry.startTime}`,
      };

      const validation = validateEntryWithConflict(entries, entryWithId, false);

      if (!validation.isValid) {
        results.failed.push({
          entryWithId,
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
      const newId = `${updatedEntry.subject}-${updatedEntry.day}-${updatedEntry.startTime}`;

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
      }}
    >
      <CurrentEntryContext.Provider value={{ currentEntry, setCurrentEntry }}>
        <FormDataContext.Provider value={{ formData, setFormDataAdd }}>
          <Header onOpenModal={handleOpenModal} />
          <Timetable />
          {isModalOpen && <Modal onClose={handleCloseModal} />}
          {isEditEntryOpen && <EditEntry onClose={handleCloseOpenEntryModal} />}
        </FormDataContext.Provider>
      </CurrentEntryContext.Provider>
    </EntryContext.Provider>
  );
};

export default HomePage;
export { EntryContext, CurrentEntryContext, FormDataContext };
