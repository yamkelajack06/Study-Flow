import { useContext, useState, useEffect } from "react";
import styles from "../styles/entryform.module.css";
import generateTimetableTimes, { Days_Const } from "../utils/generateTimes";
import { EntryContext, FormDataContext } from "../pages/Main/HomePage";

const EditEntryForm = ({ onClose, currentEntry }) => {
  // LOCAL STATE: This holds the form data while editing
  // We initialize it with currentEntry data (the entry being edited)
  // NOT with formData (which is for adding new entries)
  const [formDataEdit, setFormDataEdit] = useState({
    subject: currentEntry.subject,
    day: currentEntry.day,
    startTime: currentEntry.startTime,
    endTime: currentEntry.endTime,
    notes: currentEntry.notes,
    id: currentEntry.id,
  });

  const { updateEntries } = useContext(EntryContext);

  //This is the start and end time options
  const Times = generateTimetableTimes();
  //Monday to Sunday
  const Days = Days_Const;

  // EFFECT: Update local state if currentEntry changes
  // This ensures the form shows the correct data when opened
  useEffect(() => {
    setFormDataEdit({
      subject: currentEntry.subject,
      day: currentEntry.day,
      startTime: currentEntry.startTime,
      endTime: currentEntry.endTime,
      notes: currentEntry.notes,
      id: currentEntry.id,
    });
  }, [currentEntry]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormDataEdit((prevData) => ({ ...prevData, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateEntries(formDataEdit);
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
            // FIXED: Use formDataEdit (local state) not formData (global context)
            value={formDataEdit.subject}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className={styles["input-field"]}>
          <label htmlFor="day">Day</label>
          <select
            id="day"
            // FIXED: Use formDataEdit so user sees their changes
            value={formDataEdit.day}
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
            // FIXED: Use formDataEdit
            value={formDataEdit.notes}
            onChange={handleInputChange}
            maxLength={100}
          />
        </div>
        <div className={styles["time-container"]}>
          <div className={styles["input-field"]}>
            <label htmlFor="startTime">Start Time</label>
            <select
              // FIXED: Changed id from "start-time" to "startTime" to match state property
              id="startTime"
              value={formDataEdit.startTime}
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
            <label htmlFor="endTime">End Time</label>
            <select
              // FIXED: Changed id from "end-time" to "endTime" to match state property
              id="endTime"
              value={formDataEdit.endTime}
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
            Update
          </button>
        </div>
      </section>
    </form>
  );
};

export default EditEntryForm;
