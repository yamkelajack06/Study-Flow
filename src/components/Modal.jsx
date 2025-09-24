import styles from "../styles/modal.module.css";
import AddEntry from "./AddEntryForm";

const Modal = ({ onClose }) => {
  return (
    <div className={styles["modal-backdrop"]} onClick={onClose}>
      <div
        className={styles["modal-content"]}
        onClick={(e) => e.stopPropagation()}
      >
        <button className={styles["close-button"]} onClick={onClose}>
          Close
        </button>
        <AddEntry />
      </div>
    </div>
  );
};

export default Modal;
