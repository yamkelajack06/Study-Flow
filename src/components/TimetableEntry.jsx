import styles from "../styles/timetableentry.module.css";
import { EntryContext } from "../pages/Main/HomePage";

const TimetableEntry = ({ entry, onOpenModal, getEntryData }) => {
  return (
    entry && (
      <div
        className={styles["timetable-entry"]}
        onClick={() => {
          onOpenModal();
          getEntryData(entry);
        }}
      >
        <h3>{entry.subject}</h3>
        <p>
          {entry.startTime}-{entry.endTime}
        </p>
      </div>
    )
  );
};

export default TimetableEntry;
