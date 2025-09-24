import styles from "../styles/timetableentry.module.css";
import { EntryContext } from "../pages/Main/HomePage";

const TimetableEntry = ({ entry, onOpenModal }) => {
  return (
    entry && (
      <div className={styles["timetable-entry"]} onClick={onOpenModal}>
        <h3>{entry.subject}</h3>
        <p>
          {entry.startTime}-{entry.endTime}
        </p>
      </div>
    )
  );
};

export default TimetableEntry;
