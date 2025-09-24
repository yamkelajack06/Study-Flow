import style from "../styles/timetableGrid.module.css";
import generateTimetableTimes, { Days_Const } from "../utils/generateTimes";
//This will need to take in a prop which has the day and time and maps the components to its rightful position when
//it it being added
const TimetableGrid = () => {
  //Days for the days columns

  //Adds the times dynamically to the array
  const timetableHours = generateTimetableTimes();
  const Days = Days_Const;
  return (
    <div className={style["grid-container"]}>
      <div className={`${style["grid-item"]} ${style["empty-cell"]}`}>
        <h3 children>Time</h3>
      </div>{" "}
      {/* Empty cell for the top-left corner */}
      {/* These are days columns*/}
      {Days.map((Day) => {
        return (
          <div
            className={`${style["grid-item"]} ${style["day-header"]}`}
            key={Day.abbreviation}
          >
            <h3>{Day.day}</h3>
            <h4>{Day.abbreviation}</h4>
          </div>
        );
      })}
      {timetableHours.map((Time, timeIndex) => {
        return (
          <>
            <div
              className={`${style["grid-item"]} ${style["time-label"]}`}
              key={`time-${timeIndex}`}
            >
              <h3 className={style["start-time"]}>{Time.startTime}</h3>
              <h4 className={style["end-time"]}>{Time.endTime}</h4>
            </div>
            {/* Creates a cell for each day of the week within this hour */}
            {Days.map((Day) => (
              <div
                className={`${style["grid-item"]} ${style["grid-cell"]}`}
                key={`${Day.abbreviation}-${timeIndex}`}
              >
                {/* This is where your timetable entries will go */}
              </div>
            ))}
          </>
        );
      })}
    </div>
  );
};

export default TimetableGrid;
