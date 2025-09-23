import { useState } from "react";
import Header from "../../components/Header";
import Timetable from "../../components/Timetable";
import Modal from "../../components/Modal";

const HomePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

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
