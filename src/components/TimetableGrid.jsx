import style from "../styles/timetableGrid.module.css";

//This will need to take in a prop which has the day and time and maps the components to its rightful position when
//it it being added
const TimetableGrid = () => {
  //Days for the days columns
  const Days = [
    {
      day: "Monday",
      abbreviation: "Mon",
    },
    {
      day: "Tuesday",
      abbreviation: "Tue",
    },
    {
      day: "Wednesday",
      abbreviation: "Wed",
    },
    {
      day: "Thurday",
      abbreviation: "Thu",
    },
    {
      day: "Saturday",
      abbreviation: "Sat",
    },
    {
      day: "Sunday",
      abbreviation: "Sun",
    },
  ];

  //Adds the times dynamically to the array
  const timetableHours = generateTimetableTimes();

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
              <h3>{Time.startTime}</h3>
              <h4>{Time.endTime}</h4>
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

const generateTimetableTimes = () => {
  //Dynamically add times from 6AM to 11PM for the Times rows
  const timetableHours = [];
  for (let hour = 6; hour <= 22; hour++) {
    const isPM = hour >= 12;
    const displayStartHour = isPM ? (hour === 12 ? 12 : hour - 12) : hour;
    const displayEndHour = isPM
      ? hour === 11
        ? 11
        : hour === 12
        ? 1
        : hour - 11
      : hour + 1;
    const startAmPm = isPM ? "PM" : "AM";
    const endAmPm = isPM ? (hour === 22 ? "PM" : "AM") : "AM";

    timetableHours.push({
      startTime: `${displayStartHour}:00 ${startAmPm}`,
      endTime: `${displayEndHour}:00 ${endAmPm}`,
    });
  }
  return timetableHours;
};

export default TimetableGrid;
