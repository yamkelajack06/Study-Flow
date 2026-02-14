import { useContext, useState } from "react";
import styles from "../styles/entryform.module.css";
import generateTimetableTimes, { Days_Const } from "../utils/generateTimes";
import { EntryContext, FormDataContext, CurrentViewContext } from "../pages/Main/HomePage";
import { validateTimeOrder } from "../utils/validateTime";

const AddEntry = ({ onClose }) => {
  const { addEntries } = useContext(EntryContext);
  const { formData, setFormDataAdd } = useContext(FormDataContext);
  const { currentDate } = useContext(CurrentViewContext);
  
  const [entryType, setEntryType] = useState("once");
  
  const Times = generateTimetableTimes();
  const Days = Days_Const;

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormDataAdd((prevData) => {
      const updatedData = { ...prevData, [id]: value };

      if (entryType === "once" && updatedData.subject && updatedData.date && updatedData.startTime) {
        updatedData.id = `${updatedData.subject}-${updatedData.date}-${updatedData.startTime}`;
      } else if (entryType === "recurring" && updatedData.subject && updatedData.day && updatedData.startTime) {
        updatedData.id = `${updatedData.subject}-${updatedData.day}-${updatedData.startTime}`;
      }

      return updatedData;
    });
  };

  const handleEntryTypeChange = (type) => {
    setEntryType(type);
    if (type === "once") {
      setFormDataAdd(prev => ({ ...prev, day: "", recurrence: "none" }));
    } else {
      setFormDataAdd(prev => ({ ...prev, date: "" }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validation = validateTimeOrder(formData.startTime, formData.endTime);
    if (!validation.isValid) {
      alert(validation.message);
      return;
    }

    let entryWithId;
    
    if (entryType === "once") {
      if (!formData.date) {
        alert("Please select a date for this entry");
        return;
      }
      
      const dateObj = new Date(formData.date);
      const dayName = dateObj.toLocaleDateString("en-US", { weekday: "long" });
      
      entryWithId = {
        ...formData,
        day: dayName,
        type: "once",
        recurrence: "none",
        id: `${formData.subject}-${formData.date}-${formData.startTime}`,
      };
    } else {
      if (!formData.day) {
        alert("Please select a day for this recurring entry");
        return;
      }
      
      entryWithId = {
        ...formData,
        date: null,
        type: "recurring",
        recurrence: formData.recurrence || "weekly",
        id: `${formData.subject}-${formData.day}-${formData.startTime}`,
      };
    }

    const success = addEntries(entryWithId);
    if (success) {
      onClose();
    }
  };

  const getDefaultDate = () => {
    if (currentDate) {
      return currentDate.toISOString().split('T')[0];
    }
    return new Date().toISOString().split('T')[0];
  };

  return (
    <form className={styles["add-entry-form"]} onSubmit={handleSubmit}>
      <h1>Add New Entry</h1>
      <section className={styles["input-section"]}>
        
        <div className={styles["entry-type-selector"]}>
          <label>Entry Type</label>
          <div className={styles["type-buttons"]}>
            <button
              type="button"
              className={`${styles["type-button"]} ${entryType === "once" ? styles["active"] : ""}`}
              onClick={() => handleEntryTypeChange("once")}
            >
              One-time
            </button>
            <button
              type="button"
              className={`${styles["type-button"]} ${entryType === "recurring" ? styles["active"] : ""}`}
              onClick={() => handleEntryTypeChange("recurring")}
            >
              Recurring
            </button>
          </div>
        </div>

        <div className={styles["input-field"]}>
          <label htmlFor="subject">Subject/Task</label>
          <input
            id="subject"
            value={formData.subject}
            onChange={handleInputChange}
            placeholder="e.g., Math Class, Study Session"
            required
          />
        </div>

        {entryType === "once" ? (
          <div className={styles["input-field"]}>
            <label htmlFor="date">Date</label>
            <input
              type="date"
              id="date"
              value={formData.date || getDefaultDate()}
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
              <label htmlFor="recurrence">Repeat Pattern</label>
              <select
                id="recurrence"
                value={formData.recurrence || "weekly"}
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
            value={formData.notes}
            onChange={handleInputChange}
            placeholder="Add any additional notes here..."
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
            {entryType === "once" ? "Add Entry" : "Add Recurring Entry"}
          </button>
        </div>
      </section>
    </form>
  );
};

export default AddEntry;