import { useContext } from "react";
import { CurrentEntryContext, EntryContext } from "./HomePage";
import styles from "../../styles/weeklyview.module.css";
import generateTimetableTimes, { Days_Const } from "../../utils/generateTimes";
import TimetableEntry from "../../components/TimetableEntry";
import findEntriesForCell from "../../utils/findGridEntry";

const WeeklyView = ({ currentDate }) => {
  const { entries, handleOpenEntryModal } = useContext(EntryContext);
  const { setCurrentEntry } = useContext(CurrentEntryContext);

  const timetableHours = generateTimetableTimes();
  const Days = Days_Const;

  // Calculate the week range for display
  const getWeekRange = () => {
    const start = new Date(currentDate);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1); // Adjust to Monday
    const monday = new Date(start.setDate(diff));

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    return {
      start: monday.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      end: sunday.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    };
  };

  const weekRange = getWeekRange();

  const getEntryData = (entry) => {
    setCurrentEntry(entry);
    return {
      subject: entry.subject,
      day: entry.day,
      notes: entry.notes,
      startTime: entry.startTime,
      endTime: entry.endTime,
    };
  };

  return (
    <div className={styles["weekly-view-wrapper"]}>
      <div className={styles["week-range"]}>
        <p>
          {weekRange.start} - {weekRange.end}
        </p>
      </div>

      <div className={styles["grid-container"]}>
        <div className={`${styles["grid-item"]} ${styles["empty-cell"]}`}>
          <h3>Time</h3>
        </div>
        {Days.map((Day) => (
          <div
            className={`${styles["grid-item"]} ${styles["day-header"]}`}
            key={Day.abbreviation}
          >
            <h3>{Day.day}</h3>
            <h4>{Day.abbreviation}</h4>
          </div>
        ))}

        {timetableHours.map((Time, timeIndex) => (
          <>
            <div
              className={`${styles["grid-item"]} ${styles["time-label"]}`}
              key={`time-${timeIndex}`}
            >
              <h3 className={styles["start-time"]}>{Time.startTime}</h3>
              <h4 className={styles["end-time"]}>{Time.endTime}</h4>
            </div>

            {Days.map((Day) => {
              const entriesForCell = findEntriesForCell(entries, Day, Time);
              return (
                <div
                  className={`${styles["grid-item"]} ${styles["grid-cell"]}`}
                  key={`cell-${Day.abbreviation}-${timeIndex}`}
                >
                  {entriesForCell.map((entry) => (
                    <TimetableEntry
                      key={entry.id}
                      entry={entry}
                      onOpenModal={handleOpenEntryModal}
                      getEntryData={getEntryData}
                    />
                  ))}
                </div>
              );
            })}
          </>
        ))}
      </div>
    </div>
  );
};

export default WeeklyView;
