import addIcon from "../assets/add-icon.svg";
import darkModeIcon from "../assets/moon-blue.svg";
import styles from "../styles/header.module.css";

const Header = ({ onOpenModal }) => {
  return (
    <header className={styles["header"]}>
      <div className={styles["header-inner-container"]}>
        <div className={styles["app-title"]}>
          <h1>Study Timetable</h1>
        </div>
        <div className={styles["header-controls"]}>
          <div className={styles["date"]}>
            <p className={styles["day-desc"]}>Today</p>
            <p className={styles["date-desc"]}>Saturday, 20 September, 2025</p>
          </div>
          <button className={styles["add-entry"]} onClick={onOpenModal}>
            <img src={addIcon} alt="Add entry icon" /> <p>Add Entry</p>
          </button>
          <div className={styles["theme-toggle"]}>
            <button>
              <img src={darkModeIcon} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
