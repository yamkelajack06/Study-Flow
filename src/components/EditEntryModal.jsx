import { useState } from "react";
import styles from "../styles/modal.module.css";
import EditEntryForm from "./EditEntryForm";
import EntryDetails from "./EntryDetails";

const EditEntry = ({ onClose }) => {
  const [modalAction, setModalAction] = useState("view");
  const handleEditClick = () => {
    setModalAction("edit");
  };

  const onEdit = () => {
    handleEditClick();
  };
  return (
    <div className={styles["modal-backdrop"]} onClick={onClose}>
      <div
        className={styles["modal-content"]}
        onClick={(e) => e.stopPropagation()}
      >
        {modalAction === "view" ? (
          <EntryDetails onEdit={onEdit} onClose={onClose} />
        ) : (
          <EditEntryForm />
        )}
      </div>
    </div>
  );
};

export default EditEntry;
