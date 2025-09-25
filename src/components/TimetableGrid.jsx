import { useContext } from "react";
import { CurrentEntryContext, EntryContext } from "../pages/Main/HomePage";
import style from "../styles/timetableGrid.module.css";
import generateTimetableTimes, { Days_Const } from "../utils/generateTimes";
import TimetableEntry from "./TimetableEntry";
import findEntriesForCell from "../utils/findGridEntry";

const TimetableGrid = () => {
  const { entries, handleOpenEntryModal } = useContext(EntryContext);
  const { setCurrentEntry } = useContext(CurrentEntryContext);

  const timetableHours = generateTimetableTimes();
  const Days = Days_Const;

  //Goes inside the entry and fetches the data
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
    <div className={style["grid-container"]}>
      <div className={`${style["grid-item"]} ${style["empty-cell"]}`}>
        <h3>Time</h3>
      </div>
      {Days.map((Day) => (
        <div
          className={`${style["grid-item"]} ${style["day-header"]}`}
          key={Day.abbreviation}
        >
          <h3>{Day.day}</h3>
          <h4>{Day.abbreviation}</h4>
        </div>
      ))}

      {timetableHours.map((Time, timeIndex) => (
        <>
          <div
            className={`${style["grid-item"]} ${style["time-label"]}`}
            key={`time-${timeIndex}`}
          >
            <h3 className={style["start-time"]}>{Time.startTime}</h3>
            <h4 className={style["end-time"]}>{Time.endTime}</h4>
          </div>

          {Days.map((Day) => {
            // Find all entries for the current day and time slot
            const entriesForCell = findEntriesForCell(entries, Day, Time);
            return (
              <div
                className={`${style["grid-item"]} ${style["grid-cell"]}`}
                key={`cell-${Day.abbreviation}-${timeIndex}`} // Corrected key
              >
                {/* Map over the found entries and render them all */}
                {entriesForCell.map((entry) => (
                  <TimetableEntry
                    key={entry.id}
                    entry={entry}
                    onOpenModal={() => {
                      handleOpenEntryModal();
                    }}
                    getEntryData={getEntryData}
                  />
                ))}
              </div>
            );
          })}
        </>
      ))}
    </div>
  );
};

export default TimetableGrid;
