import { useState } from "react";
import styles from "../styles/entryform.module.css";
import generateTimetableTimes, { Days_Const } from "../utils/generateTimes";

const AddEntry = ({ onClose }) => {
  const [formData, setFormData] = useState({
    subject: "",
    day: "",
    startTime: "",
    endTime: "",
    notes: "",
  });

  //This is the start and end time options
  const Times = generateTimetableTimes();
  //Monday to Sunday
  const Days = Days_Const;

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Add logic to submit form data
    console.log("Form submitted:", formData);
    onClose();
  };

  return (
    <form className={styles["add-entry-form"]} onSubmit={handleSubmit}>
      <h1>Edit Entry</h1>
      <section className={styles["input-section"]}>
        <div className={styles["input-field"]}>
          <label htmlFor="subject">Subject/Task</label>
          <input
            id="subject"
            value={formData.subject}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className={styles["input-field"]}>
          <label htmlFor="day">Day</label>
          <select
            id="day"
            value={formData.day}
            onChange={handleInputChange}
            required
          >
            <option value="" disabled>
              Select a day
            </option>
            {Days.map((day) => (
              <option key={day.day} value={day.day}>
                {day.day}
              </option>
            ))}
          </select>
        </div>
        <div className={styles["input-field"]}>
          <label htmlFor="notes">Notes (Optional)</label>
          <textarea
            id="notes"
            value={formData.notes}
            onChange={handleInputChange}
            maxLength={100}
          />
        </div>
        <div className={styles["time-container"]}>
          <div className={styles["input-field"]}>
            <label htmlFor="start-time">Start Time</label>
            <select
              id="start-time"
              value={formData.startTime}
              onChange={handleInputChange}
              required
            >
              <option value="" disabled>
                Start Time
              </option>
              {Times.map((time) => (
                <option key={time.startTime} value={time.startTime}>
                  {time.startTime}
                </option>
              ))}
            </select>
          </div>
          <div className={styles["input-field"]}>
            <label htmlFor="end-time">End Time</label>
            <select
              id="end-time"
              value={formData.endTime}
              onChange={handleInputChange}
              required
            >
              <option value="" disabled>
                End Time
              </option>
              {Times.map((time) => (
                <option key={time.endTime} value={time.endTime}>
                  {time.endTime}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className={styles["form-actions"]}>
          <button
            type="button"
            onClick={onClose}
            className={styles["cancel-btn"]}
          >
            Cancel
          </button>
          <button type="submit" className={styles["submit-btn"]}>
            Update Entry
          </button>
        </div>
      </section>
    </form>
  );
};

export default AddEntry;
