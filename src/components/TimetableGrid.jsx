import { useContext } from "react";
import { EntryContext } from "../pages/Main/HomePage";
import style from "../styles/timetableGrid.module.css";
import generateTimetableTimes, { Days_Const } from "../utils/generateTimes";
import TimetableEntry from "./TimetableEntry";
import findEntriesForCell from "../utils/findGridEntry";

const TimetableGrid = () => {
  const { entries } = useContext(EntryContext);
  const timetableHours = generateTimetableTimes();
  const Days = Days_Const;

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
                {entriesForCell.map((entry, entryIndex) => (
                  <TimetableEntry key={entryIndex} entry={entry} />
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