import { useContext } from "react";
import styles from "../styles/entrydetails.module.css";
import { CurrentEntryContext, EntryContext } from "../pages/Main/HomePage";

//Add entry and on delete later on
const EntryDetails = ({ onEdit, onClose }) => {
  const { currentEntry } = useContext(CurrentEntryContext);
  const { deleteEntries } = useContext(EntryContext);
  console.log(
    "This is the current entry I am about to pass to delete",
    currentEntry
  );

  return (
    <div className={styles["entry-details-container"]}>
      <div className={styles["details-header"]}>
        <h2>{currentEntry.subject}</h2>
      </div>

      <div className={styles["details-body"]}>
        <p>
          <strong>Day:</strong> {currentEntry.day}
        </p>
        <p>
          <strong>Time:</strong> {currentEntry.startTime} -
          {currentEntry.endTime}
        </p>
        <div className={styles["notes-section"]}>
          <strong>Notes:</strong>
          <p className={styles["notes"]}>{currentEntry.notes}</p>
        </div>
      </div>

      <div className={styles["details-actions"]}>
        <button className={styles["edit-button"]} onClick={onEdit}>
          Edit
        </button>
        <button
          className={styles["delete-button"]}
          onClick={() => {
            deleteEntries(currentEntry);
            onClose();
          }}
        >
          Delete
        </button>
        <button className={styles["add-to-calendar-button"]}>Add Event</button>
      </div>
    </div>
  );
};

export default EntryDetails;
