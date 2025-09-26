import { createContext, useState } from "react";
import Header from "../../components/Header";
import Timetable from "../../components/Timetable";
import Modal from "../../components/Modal";
import EditEntry from "../../components/EditEntryModal";

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
    console.log("Entry added");
    const newEntries = [...entries, entry];
    setEntries(newEntries);
    localStorage.setItem("Entries", JSON.stringify(newEntries));
    console.log(entries);
    setFormDataAdd(initialFormData);
  };

  const deleteEntries = (Entry) => {
    console.log("Entries before deletion:", entries);
    const newEntries = entries.filter((entry) => entry.id !== Entry.id);
    setEntries(newEntries);
    localStorage.setItem("Entries", JSON.stringify(newEntries));
  };

  const updateEntries = (updatedEntry) => {
    const updatedEntries = entries.map((entry) =>
      entry.id === updatedEntry.id ? { ...entry, ...updatedEntry } : entry
    );
    setEntries(updatedEntries);
    localStorage.setItem("Entries", JSON.stringify(updatedEntries));
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