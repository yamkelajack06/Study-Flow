import { createContext, useState } from "react";
import Header from "../../components/Header";
import Timetable from "../../components/Timetable";
import Modal from "../../components/Modal";
import EditEntry from "../../components/EditEntryModal";

//Entries context to be shared with the Add/Delete entry form
const EntryContext = createContext({
  entries: [],
  addEntries: () => {},
  deleteEntries: () => {},
  handleCloseModal: () => {},
});

//This is for the current entry (share it)
const CurrentEntryContext = createContext({});

const HomePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditEntryOpen, setIsEditEntryOpen] = useState(false);
  //This will store the timetable entries, each entry will be an object
  const [entries, setEntries] = useState([]);

  //This keeps track of the current entry
  const [currentEntry, setCurrentEntry] = useState({});

  //Add the entries to the array
  const addEntries = (entry) => {
    //Copy the array into a new one to prevent state mutation
    console.log("Entry added");
    let new_entries = [...entries];
    new_entries.push(entry);
    setEntries(new_entries);
    console.log(entries);
  };

  const deleteEntries = (Entry) => {
    //Copy the entries to prevent state mutation
    let entries_copy = [...entries];
    //Remove the entry and set the state to the new array
    console.log("Entries before deletion:", entries_copy);

    const new_entries = entries_copy.filter((entry) => {
      return entry.id !== Entry.id;
    });

    setEntries(new_entries);
    console.log("Entries after deletion:", new_entries);
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
      }}
    >
      <CurrentEntryContext.Provider value={{ currentEntry, setCurrentEntry }}>
        <Header onOpenModal={handleOpenModal} />
        <Timetable />
        {isModalOpen && <Modal onClose={handleCloseModal} />}
        {isEditEntryOpen && <EditEntry onClose={handleCloseOpenEntryModal} />}
      </CurrentEntryContext.Provider>
    </EntryContext.Provider>
  );
};

export default HomePage;
export { EntryContext, CurrentEntryContext };
