import { createContext, useState } from "react";
import Header from "../../components/Header";
import Timetable from "../../components/Timetable";
import Modal from "../../components/Modal";
import EditEntry from "../../components/EditEntryModal";

//Context
const EntryContext = createContext({});
const CurrentEntryContext = createContext({});
const FormDataContext = createContext({});

const HomePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditEntryOpen, setIsEditEntryOpen] = useState(false);
  const [entries, setEntries] = useState([]);
  const [currentEntry, setCurrentEntry] = useState({});
  const [formData, setFormDataAdd] = useState({
    subject: "",
    day: "",
    startTime: "",
    endTime: "",
    notes: "",
    id: "",
  });

  const addEntries = (entry) => {
    console.log("Entry added");
    let new_entries = [...entries];
    new_entries.push(entry);
    setEntries(new_entries);
    console.log(entries);
  };

  const deleteEntries = (Entry) => {
    let entries_copy = [...entries];
    console.log("Entries before deletion:", entries_copy);

    const new_entries = entries_copy.filter((entry) => {
      return entry.id !== Entry.id;
    });

    setEntries(new_entries);
  };

  const updateEntries = (updatedEntry) => {
    const updatedEntries = entries.map((entry) =>
      entry.id === updatedEntry.id ? { ...entry, ...updatedEntry } : entry
    );
    setEntries(updatedEntries);
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
