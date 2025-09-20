import bookIcon from "../assets/book-icon.svg";
import addIcon from "../assets/add-icon.svg";
import darkModeIcon from "../assets/dark-mode-icon.svg";
import styles from "../styles/header.module.css";  // Import as styles object

const Header = () => {
  return (
    <header className={styles["header"]}>
      <div className={styles["app-title"]}> 
        <img src={bookIcon} alt="book icon" />
        <div className={styles["description"]}>
          <h1>Study Timetable</h1>
        </div>
      </div>

      <div className={styles["header-controls"]}>
        <div className={styles["date"]}>
          <p className = {styles["day-desc"]}>Today</p>
          <p className={styles["date-desc"]}>Saturday, 20 September, 2025</p>
        </div>
        <button>
          <img src={addIcon} alt="Add entry icon" /> Add Entry
        </button>
        <div className={styles["theme-toggle"]}>
          <button>
            <img src={darkModeIcon} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;