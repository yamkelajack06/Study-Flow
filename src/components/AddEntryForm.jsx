import { useContext, useState } from "react";
import styles from "../styles/entryform.module.css";
import generateTimetableTimes, { Days_Const } from "../utils/generateTimes";
import { EntryContext } from "../pages/Main/HomePage";

const AddEntry = ({ onClose }) => {
  const [formData, setFormData] = useState({
    subject: "",
    day: "",
    startTime: "",
    endTime: "",
    notes: "",
    id: "",
  });

  const { addEntries } = useContext(EntryContext);

  //This is the start and end time options
  const Times = generateTimetableTimes();
  //Monday to Sunday
  const Days = Days_Const;

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => {
      const updatedData = { ...prevData, [id]: value };

      // Generate unique ID when we have subject, day, and startTime
      if (updatedData.subject && updatedData.day && updatedData.startTime) {
        updatedData.id = `${updatedData.subject}-${updatedData.day}-${updatedData.startTime}`;
      }

      return updatedData;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Ensure ID is generated before submitting
    const entryWithId = {
      ...formData,
      id:
        formData.id ||
        `${formData.subject}-${formData.day}-${formData.startTime}`,
    };
    addEntries(entryWithId);
    onClose();
  };

  return (
    <form className={styles["add-entry-form"]} onSubmit={handleSubmit}>
      <h1>Add New Entry</h1>
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
            {Days.map((day, idx) => (
              <option key={`${day.day}+${idx}`} value={day.day}>
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
            <label htmlFor="startTime">Start Time</label>
            <select
              id="startTime"
              value={formData.startTime}
              onChange={handleInputChange}
              required
            >
              <option value="" disabled>
                Start Time
              </option>
              {Times.map((time, idx) => (
                <option key={`${time.startTime}+${idx}`} value={time.startTime}>
                  {time.startTime}
                </option>
              ))}
            </select>
          </div>
          <div className={styles["input-field"]}>
            <label htmlFor="endTime">End Time</label>
            <select
              id="endTime"
              value={formData.endTime}
              onChange={handleInputChange}
              required
            >
              <option value="" disabled>
                End Time
              </option>
              {Times.map((time, idx) => (
                <option
                  className={styles["input-option"]}
                  key={`${time.endTime}+${idx}`}
                  value={time.endTime}
                >
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
            Add Entry
          </button>
        </div>
      </section>
    </form>
  );
};

export default AddEntry;
