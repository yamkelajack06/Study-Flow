import { useContext } from "react";
import styles from "../styles/entrydetails.module.css";
import { CurrentEntryContext, EntryContext } from "../pages/Main/HomePage";
import { getRecurrenceDescription } from "../utils/dateUtils";

const EntryDetails = ({ onEdit, onClose }) => {
  const { currentEntry } = useContext(CurrentEntryContext);
  const { deleteEntries } = useContext(EntryContext);

  return (
    <div className={styles["entry-details-container"]}>
      <div className={styles["details-header"]}>
        <h2>{currentEntry.subject}</h2>
        {currentEntry.type && (
          <span 
            className={styles["entry-type-badge"]}
            style={{ 
              backgroundColor: currentEntry.color ? `${currentEntry.color}33` : undefined, // 33 is approx 20% opacity hex
              color: currentEntry.color || undefined 
            }}
          >
            {currentEntry.type === "once" ? "One-time" : " Recurring"}
          </span>
        )}
      </div>

      <div className={styles["details-body"]}>
        <div className={styles["detail-row"]}>
          <strong>Schedule:</strong>
          <p>{getRecurrenceDescription(currentEntry)}</p>
        </div>

        <div className={styles["detail-row"]}>
          <strong>Time:</strong>
          <p>
            {currentEntry.startTime} - {currentEntry.endTime}
          </p>
        </div>

        {currentEntry.type === "recurring" && currentEntry.recurrence && (
          <div className={styles["detail-row"]}>
            <strong>Repeats:</strong>
            <p>
              {currentEntry.recurrence === "weekly" && "Every week"}
              {currentEntry.recurrence === "biweekly" && "Every 2 weeks"}
              {currentEntry.recurrence === "monthly" && "Every month"}
            </p>
          </div>
        )}

        {currentEntry.notes && (
          <div className={styles["notes-section"]}>
            <strong>Notes:</strong>
            <p className={styles["notes"]}>{currentEntry.notes}</p>
          </div>
        )}
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
        <button className={styles["add-to-calendar-button"]}>
          Add to Calendar
        </button>
      </div>
    </div>
  );
};

export default EntryDetails;