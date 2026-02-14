import { useContext, useState, useEffect } from "react";
import styles from "../styles/entryform.module.css";
import modalStyles from "../styles/modal.module.css";
import generateTimetableTimes, { Days_Const } from "../utils/generateTimes";
import { EntryContext, CurrentEntryContext } from "../pages/Main/HomePage";
import { validateTimeOrder } from "../utils/validateTime";

const EditEntryModal = ({ onClose }) => {
  const { currentEntry } = useContext(CurrentEntryContext);
  const { updateEntries } = useContext(EntryContext);

  const [formDataEdit, setFormDataEdit] = useState({
    subject: "",
    day: "",
    date: "",
    startTime: "",
    endTime: "",
    notes: "",
    type: "recurring",
    recurrence: "weekly",
    id: "",
  });

  const Times = generateTimetableTimes();
  const Days = Days_Const;

  useEffect(() => {
    if (currentEntry) {
      setFormDataEdit({
        subject: currentEntry.subject || "",
        day: currentEntry.day || "",
        date: currentEntry.date || "",
        startTime: currentEntry.startTime || "",
        endTime: currentEntry.endTime || "",
        notes: currentEntry.notes || "",
        type: currentEntry.type || "recurring",
        recurrence: currentEntry.recurrence || "weekly",
        id: currentEntry.id || "",
      });
    }
  }, [currentEntry]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormDataEdit((prevData) => ({ ...prevData, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validation = validateTimeOrder(
      formDataEdit.startTime,
      formDataEdit.endTime
    );
    if (!validation.isValid) {
      alert(validation.message);
      return;
    }

    const entryToUpdate = { ...formDataEdit };

    // If editing a one-time entry, update day from date
    if (entryToUpdate.type === "once" && entryToUpdate.date) {
      const dateObj = new Date(entryToUpdate.date);
      const dayName = dateObj.toLocaleDateString("en-US", { weekday: "long" });
      entryToUpdate.day = dayName;
    }

    updateEntries(entryToUpdate);
    onClose();
  };

  const isOnceEntry = formDataEdit.type === "once";

  return (
    <div className={modalStyles["modal-backdrop"]} onClick={onClose}>
      <div
        className={modalStyles["modal-content"]}
        onClick={(e) => e.stopPropagation()}
      >
        <form className={styles["add-entry-form"]} onSubmit={handleSubmit}>
          <h1>Edit Entry</h1>
          <section className={styles["input-section"]}>
            
            {/* Show entry type indicator */}
            <div className={styles["entry-type-indicator"]}>
              {isOnceEntry ? (
                <span className={styles["type-badge"]}>One-time Entry</span>
              ) : (
                <span className={styles["type-badge"]}>Recurring Entry</span>
              )}
            </div>

            <div className={styles["input-field"]}>
              <label htmlFor="subject">Subject/Task</label>
              <input
                id="subject"
                value={formDataEdit.subject}
                onChange={handleInputChange}
                required
              />
            </div>

            {isOnceEntry ? (
              <div className={styles["input-field"]}>
                <label htmlFor="date">Date</label>
                <input
                  type="date"
                  id="date"
                  value={formDataEdit.date}
                  onChange={handleInputChange}
                  required
                />
              </div>
            ) : (
              <>
                <div className={styles["input-field"]}>
                  <label htmlFor="day">Day of Week</label>
                  <select
                    id="day"
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
                  <label htmlFor="recurrence">Repeat Pattern</label>
                  <select
                    id="recurrence"
                    value={formDataEdit.recurrence}
                    onChange={handleInputChange}
                  >
                    <option value="weekly">Every week</option>
                    <option value="biweekly">Every 2 weeks</option>
                    <option value="monthly">Every month</option>
                  </select>
                </div>
              </>
            )}

            <div className={styles["input-field"]}>
              <label htmlFor="notes">Notes (Optional)</label>
              <textarea
                id="notes"
                value={formDataEdit.notes}
                onChange={handleInputChange}
                maxLength={100}
              />
            </div>

            <div className={styles["time-container"]}>
              <div className={styles["input-field"]}>
                <label htmlFor="startTime">Start Time</label>
                <select
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
      </div>
    </div>
  );
};

export default EditEntryModal;