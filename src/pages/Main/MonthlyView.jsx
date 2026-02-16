import { useContext } from "react";
import { CurrentEntryContext, EntryContext } from "./HomePage";
import styles from "../../styles/monthlyview.module.css";

const MonthlyView = ({ currentDate }) => {
  const { getEntriesForDate, handleOpenEntryModal } = useContext(EntryContext);
  const { setCurrentEntry } = useContext(CurrentEntryContext);

  // Get month info from the currentDate being viewed
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = currentDate.toLocaleDateString("en-US", { month: "long" });

  // Get first day of month and total days
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay(); // 0 = Sunday

  // Create array of day objects
  const days = [];
  
  // Add empty cells for days before month starts
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null);
  }

  // Add actual days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
    
    // Get entries for this specific date (both one-time and recurring)
    const dayEntries = getEntriesForDate(date);

    days.push({
      date: day,
      dayName,
      fullDate: date,
      entries: dayEntries,
    });
  }

  const getEntryData = (entry) => {
    setCurrentEntry(entry);
  };

  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  return (
    <div className={styles["monthly-view-container"]}>
      <div className={styles["month-header"]}>
        <h2>
          {monthName} {year}
        </h2>
      </div>

      <div className={styles["calendar-grid"]}>
        {/* Day headers */}
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className={styles["day-header"]}>
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {days.map((day, index) => (
          <div
            key={index}
            className={`${styles["calendar-day"]} ${
              !day ? styles["empty-day"] : ""
            } ${day && isToday(day.fullDate) ? styles["today"] : ""}`}
          >
            {day && (
              <>
                <div className={styles["day-number"]}>{day.date}</div>
                <div className={styles["day-entries"]}>
                  {day.entries.slice(0, 3).map((entry) => (
                    <div
                      key={entry.id}
                      className={styles["entry-indicator"]}
                      onClick={() => {
                        getEntryData(entry);
                        handleOpenEntryModal();
                      }}
                      title={`${entry.subject} (${entry.startTime} - ${entry.endTime})${
                        entry.type === "recurring" ? " - Recurring" : ""
                      }`}
                    >
                      <span className={styles["entry-dot"]} style={{ color: entry.color || "#447ff8" }}>
                        •
                      </span>
                      <span className={styles["entry-subject"]}>
                        {entry.subject}
                      </span>
                    </div>
                  ))}
                  {day.entries.length > 3 && (
                    <div className={styles["more-entries"]}>
                      +{day.entries.length - 3} more
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MonthlyView;