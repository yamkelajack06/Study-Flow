import styles from "../styles/modal.module.css";

const EditEntry = ({ onClose }) => {
  return (
    <div className={styles["modal-backdrop"]} onClick={onClose}>
      <div
        className={styles["modal-content"]}
        onClick={(e) => e.stopPropagation()}
      >
        <h1>Edit Entry</h1>
      </div>
    </div>
  );
};

export default EditEntry;
