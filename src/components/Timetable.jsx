import { useState } from "react";
import styles from "../styles/timetable.module.css";
import calendarIcon from "../assets/calendar-blue.svg";
import DailyView from "../pages/Main/DailyView";
import WeeklyView from "../pages/Main/WeeklyView";
import MonthlyView from "../pages/Main/MonthlyView";
import AIAssistant from "./AIAssistant";

const Timetable = () => {
  const [currentView, setCurrentView] = useState("Week");
  const [currentDate, setCurrentDate] = useState(new Date());

  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  // Navigation functions
  const navigatePrevious = () => {
    const newDate = new Date(currentDate);

    switch (currentView) {
      case "Day":
        newDate.setDate(newDate.getDate() - 1);
        break;
      case "Week":
        newDate.setDate(newDate.getDate() - 7);
        break;
      case "Month":
        newDate.setMonth(newDate.getMonth() - 1);
        break;
      default:
        break;
    }

    setCurrentDate(newDate);
  };

  const navigateNext = () => {
    const newDate = new Date(currentDate);

    switch (currentView) {
      case "Day":
        newDate.setDate(newDate.getDate() + 1);
        break;
      case "Week":
        newDate.setDate(newDate.getDate() + 7);
        break;
      case "Month":
        newDate.setMonth(newDate.getMonth() + 1);
        break;
      default:
        break;
    }

    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Render the appropriate view
  const renderView = () => {
    switch (currentView) {
      case "Day":
        return <DailyView currentDate={currentDate} />;
      case "Week":
        return <WeeklyView currentDate={currentDate} />;
      case "Month":
        return <MonthlyView currentDate={currentDate} />;
      default:
        return <WeeklyView currentDate={currentDate} />;
    }
  };

  const getScheduleTitle = () => {
    switch (currentView) {
      case "Day":
        return currentDate.toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
        });
      case "Week":
        return "Weekly Schedule";
      case "Month":
        return currentDate.toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        });
      default:
        return "Weekly Schedule";
    }
  };

  return (
    <div className={styles["timetable"]}>
      <div className={styles["schedule-and-controls"]}>
        <div className={styles["schedule"]}>
          <img src={calendarIcon} alt="calendar icon" />
          <h1>{getScheduleTitle()}</h1>
        </div>
        <div className={styles["controls"]}>
          <GridView currentView={currentView} onViewChange={handleViewChange} />
        </div>
      </div>

      {/* Date Navigation */}
      <div className={styles["date-navigation"]}>
        <button
          className={styles["nav-button"]}
          onClick={navigatePrevious}
          aria-label="Previous"
        >
          ← Previous
        </button>

        <button className={styles["today-button"]} onClick={goToToday}>
          Today
        </button>

        <button
          className={styles["nav-button"]}
          onClick={navigateNext}
          aria-label="Next"
        >
          Next →
        </button>
      </div>

      {renderView()}
      <AIAssistant />
    </div>
  );
};

const GridView = ({ currentView, onViewChange }) => {
  return (
    <>
      <button
        className={`${styles["button-control-left"]} ${
          currentView === "Day" ? styles["clicked"] : ""
        }`}
        onClick={() => onViewChange("Day")}
      >
        Day
      </button>
      <button
        className={currentView === "Week" ? styles["clicked"] : ""}
        onClick={() => onViewChange("Week")}
      >
        Week
      </button>
      <button
        className={`${styles["button-control-right"]} ${
          currentView === "Month" ? styles["clicked"] : ""
        }`}
        onClick={() => onViewChange("Month")}
      >
        Month
      </button>
    </>
  );
};

export default Timetable;
