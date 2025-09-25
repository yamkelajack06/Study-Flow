import { useContext, useState } from "react";
import styles from "../styles/modal.module.css";
import EditEntryForm from "./EditEntryForm";
import EntryDetails from "./EntryDetails";
import { CurrentEntryContext } from "../pages/Main/HomePage";

const EditEntry = ({ onClose }) => {
  const [modalAction, setModalAction] = useState("view");
  const { currentEntry } = useContext(CurrentEntryContext);

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
          <EditEntryForm onClose={onClose} currentEntry={currentEntry} />
        )}
      </div>
    </div>
  );
};

export default EditEntry;
