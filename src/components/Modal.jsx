import { useContext } from "react";
import { EntryContext } from "../pages/Main/HomePage";
import styles from "../styles/modal.module.css";
import AddEntry from "./AddEntryForm";

const Modal = ({ onClose }) => {
  const { handleCloseModal } = useContext(EntryContext);
  return (
    <div className={styles["modal-backdrop"]} onClick={onClose}>
      <div
        className={styles["modal-content"]}
        onClick={(e) => e.stopPropagation()}
      >
        <AddEntry onClose={handleCloseModal} />
      </div>
    </div>
  );
};

export default Modal;
