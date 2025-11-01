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
