import styles from "../styles/loading.module.css";
import { Calendar } from "lucide-react";

const LoadingScreen = ({ message = "Loading your timetable…" }) => {
  return (
    <div className={styles["loading-screen"]} role="status" aria-live="polite">
      <div className={styles["loading-card"]}>
        {/* Animated logo */}
        <div className={styles["logo-ring"]}>
          <div className={styles["ring"]} />
          <div className={styles["logo-icon"]}>
            <Calendar size={28} strokeWidth={2} />
          </div>
        </div>

        {/* App name */}
        <h1 className={styles["app-name"]}>Study Timetable</h1>

        {/* Dot‐pulse row */}
        <div className={styles["dot-row"]} aria-hidden="true">
          <span className={styles["dot"]} />
          <span className={styles["dot"]} />
          <span className={styles["dot"]} />
        </div>

        {/* Status message */}
        <p className={styles["loading-message"]}>{message}</p>
      </div>
    </div>
  );
};

export default LoadingScreen;