import styles from "../styles/timetable.module.css";
import TimetableGrid from "./TimetableGrid";
import calendarIcon from "../assets/calendar-blue.svg";
import { useState } from "react";

const Timetable = () => {
  return (
    <div className={styles["timetable"]}>
      <div className={styles["schedule-and-controls"]}>
        <div className={styles["schedule"]}>
          <h1>
            <img src={calendarIcon} alt="calendar icon" />
            Weekly Schedule
          </h1>
        </div>
        <div className={styles["controls"]}>
          <GridView />
        </div>
      </div>
      <TimetableGrid />
    </div>
  );
};

const GridView = () => {
  //This is for tracking which button is clicked currently
  const [isClicked, setIsClicked] = useState("Week");

  const handleClick = (buttonName) => {
    setIsClicked(buttonName);
  };

  return (
    <div className={styles["buttons-container"]}>
      <button
        className={`${styles["left"]} ${
          isClicked === "Day" ? styles["clicked"] : ""
        }`}
        onClick={() => handleClick("Day")}
      >
        Day
      </button>
      <button
        className={isClicked === "Week" ? styles["clicked"] : ""}
        onClick={() => handleClick("Week")}
      >
        Week
      </button>
      <button
        className={`${styles["right"]} ${
          isClicked === "Month" ? styles["clicked"] : ""
        }`}
        onClick={() => handleClick("Month")}
      >
        Month
      </button>
    </div>
  );
};

export default Timetable;
