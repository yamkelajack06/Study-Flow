import { useContext } from "react";
import { CurrentEntryContext, EntryContext } from "./HomePage";
import styles from "../../styles/weeklyview.module.css";
import generateTimetableTimes, { Days_Const } from "../../utils/generateTimes";
import TimetableEntry from "../../components/TimetableEntry";

const WeeklyView = ({ currentDate }) => {
  const { getEntriesForDate, handleOpenEntryModal } = useContext(EntryContext);
  const { setCurrentEntry } = useContext(CurrentEntryContext);

  const timetableHours = generateTimetableTimes();
  const Days = Days_Const;

  // Get the actual dates for the week
  const getWeekDates = () => {
    const dates = [];
    const start = new Date(currentDate);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1); // Adjust to Monday
    const monday = new Date(start.setDate(diff));

    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      dates.push(date);
    }

    return dates;
  };

  const weekDates = getWeekDates();

  // Calculate the week range for display
  const getWeekRange = () => {
    const monday = weekDates[0];
    const sunday = weekDates[6];

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
      date: entry.date,
      notes: entry.notes,
      startTime: entry.startTime,
      endTime: entry.endTime,
      type: entry.type,
      recurrence: entry.recurrence,
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

        {/* Day headers with actual dates */}
        {Days.map((Day, dayIndex) => {
          const date = weekDates[dayIndex];
          const dateNum = date.getDate();

          return (
            <div
              className={`${styles["grid-item"]} ${styles["day-header"]}`}
              key={Day.abbreviation}
            >
              <h3>{Day.day}</h3>
              <h4>
                {Day.abbreviation} {dateNum}
              </h4>
            </div>
          );
        })}

        {timetableHours.map((Time, timeIndex) => (
          <>
            <div
              className={`${styles["grid-item"]} ${styles["time-label"]}`}
              key={`time-${timeIndex}`}
            >
              <h3 className={styles["start-time"]}>{Time.startTime}</h3>
              <h4 className={styles["end-time"]}>{Time.endTime}</h4>
            </div>

            {Days.map((Day, dayIndex) => {
              // Get the actual date for this cell
              const cellDate = weekDates[dayIndex];

              // Get entries for this specific date
              const entriesForDate = getEntriesForDate(cellDate);

              // Filter by time slot
              const entriesForCell = entriesForDate.filter(
                (entry) => entry.startTime === Time.startTime,
              );

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
