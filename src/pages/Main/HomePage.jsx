import { createContext, useState } from "react";
import Header from "../../components/Header";
import Timetable from "../../components/Timetable";
import Modal from "../../components/Modal";
import EditEntry from "../../components/EditEntryModal";
import validateEntryAdd, { validateEntryUpdate } from "../../utils/validateEntry";

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
    let alreadyExists = validateEntryAdd(entries, entry);

    if (alreadyExists) {
      alert(`An entry already exists for ${entry.day} at ${entry.startTime}`);
    } else {
      const newEntries = [...entries, entry];
      setEntries(newEntries);
      localStorage.setItem("Entries", JSON.stringify(newEntries));
      setFormDataAdd(initialFormData);
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
    }
  };

  const updateEntries = (updatedEntry) => {
    let alreadyExists = validateEntryUpdate(entries, updatedEntry);
    if (alreadyExists) {
      alert(
        `An entry already exists for ${updatedEntry.day} at ${updatedEntry.startTime}`
      );
    } else {
      const updatedEntries = entries.map((entry) =>
        entry.id === updatedEntry.id ? { ...entry, ...updatedEntry } : entry
      );
      setEntries(updatedEntries);
      localStorage.setItem("Entries", JSON.stringify(updatedEntries));
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
