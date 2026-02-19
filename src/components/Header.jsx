import addIcon from "../assets/add-icon.svg";
import darkModeIcon from "../assets/moon-blue.svg";
import styles from "../styles/header.module.css";
import getFormattedDate from "../utils/formatedDate";
import PrintTimetable from "./Printtimetable";
import { useAuth } from "../context/AuthContext";
import { LogOut, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";


const Header = ({ onOpenModal }) => {
  const date = getFormattedDate();
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = "/";
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  // Get initials from display name or email
  const getInitials = () => {
    if (!currentUser) return null;
    if (currentUser.displayName) {
      return currentUser.displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return currentUser.email?.[0]?.toUpperCase() ?? "U";
  };

  return (
    <header className={styles["header"]}>
      <div className={styles["header-inner-container"]}>
        <div className={styles["app-title"]}>
          <h1>Study Timetable</h1>
        </div>
        <div className={styles["header-controls"]}>
          <div className={styles["date"]}>
            <p className={styles["day-desc"]}>Today</p>
            <p className={styles["date-desc"]}>{date}</p>
          </div>
          <PrintTimetable />
          <button className={styles["add-entry"]} onClick={onOpenModal}>
            <img src={addIcon} alt="Add entry icon" /> <p>Add Entry</p>
          </button>
          <div className={styles["theme-toggle"]}>
            <button>
              <img src={darkModeIcon} alt="Toggle theme" />
            </button>
          </div>

          {currentUser ? (
            /* ── Logged-in: avatar + sign out ── */
            <div className={styles["user-section"]}>
              {currentUser.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt="User avatar"
                  className={styles["user-avatar"]}
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className={styles["user-avatar-initials"]}>
                  {getInitials()}
                </div>
              )}

              <button
                className={styles["logout-btn"]}
                onClick={handleLogout}
                title="Sign out"
                aria-label="Sign out"
              >
                <LogOut size={16} strokeWidth={2} />
                <span>Sign out</span>
              </button>
            </div>
          ) : (
            /* ── Guest: sign-in button ── */
            <div className={styles["user-section"]}>
              <button
                className={styles["login-btn"]}
                onClick={() => navigate("/signin")}
                title="Sign in"
                aria-label="Sign in"
              >
                <LogIn size={16} strokeWidth={2} />
                <span>Sign in</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;