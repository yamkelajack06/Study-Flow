import styles from "../styles/timetable.module.css";
import TimetableGrid from "./TimetableGrid";
import calendarIcon from "../assets/calendar-icon.svg";

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
  return (
    <div className={styles["buttons-container"]}>
      <button className={styles["left"]}>Day</button>
      <button>Week</button>
      <button className={styles["right"]}>Month</button>
    </div>
  );
};

export default Timetable;
