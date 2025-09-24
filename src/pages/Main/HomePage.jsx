import { useState } from "react";
import Header from "../../components/Header";
import Timetable from "../../components/Timetable";
import Modal from "../../components/Modal";

const HomePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  //This will store the timetable entries, each entry will be an object
  const [entries, setEntries] = useState([]);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <>
      <Header onOpenModal={handleOpenModal} />
      <Timetable />
      {isModalOpen && <Modal onClose={handleCloseModal} />}
    </>
  );
};

export default HomePage;
