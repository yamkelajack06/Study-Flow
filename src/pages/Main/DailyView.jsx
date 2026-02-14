import { useContext } from "react";
import { CurrentEntryContext, EntryContext } from "./HomePage";
import styles from "../../styles/dailyview.module.css";
import generateTimetableTimes from "../../utils/generateTimes";
import TimetableEntry from "../../components/TimetableEntry";

const DailyView = ({ currentDate }) => {
  const { getEntriesForDate, handleOpenEntryModal } = useContext(EntryContext);
  const { setCurrentEntry } = useContext(CurrentEntryContext);

  const timetableHours = generateTimetableTimes();

  // Get day name from currentDate
  const dayName = currentDate.toLocaleDateString("en-US", { weekday: "long" });
  const formattedDate = currentDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  // Get all entries for this specific date (both one-time and recurring)
  const entriesForDay = getEntriesForDate(currentDate);

  const getEntryData = (entry) => {
    setCurrentEntry(entry);
    return {
      subject: entry.subject,
      day: entry.day,
      date: entry.date,
      notes: entry.notes,
      startTime: entry.startTime,
      endTime: entry.endTime,
      type: entry.type,
      recurrence: entry.recurrence,
    };
  };

  return (
    <div className={styles["daily-view-container"]}>
      <div className={styles["day-header"]}>
        <h2>{dayName}</h2>
        <p>{formattedDate}</p>
      </div>

      <div className={styles["schedule-container"]}>
        {timetableHours.map((timeSlot, index) => {
          // Find entries for this time slot on this specific date
          const entriesForSlot = entriesForDay.filter(
            entry => entry.startTime === timeSlot.startTime
          );

          return (
            <div key={index} className={styles["time-slot"]}>
              <div className={styles["time-label"]}>
                <span className={styles["start-time"]}>
                  {timeSlot.startTime}
                </span>
                <span className={styles["end-time"]}>{timeSlot.endTime}</span>
              </div>

              <div className={styles["slot-content"]}>
                {entriesForSlot.length > 0 ? (
                  entriesForSlot.map((entry) => (
                    <TimetableEntry
                      key={entry.id}
                      entry={entry}
                      onOpenModal={handleOpenEntryModal}
                      getEntryData={getEntryData}
                    />
                  ))
                ) : (
                  <div className={styles["empty-slot"]}>
                    <span>Free time</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DailyView;