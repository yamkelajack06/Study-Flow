import { useContext, useState } from "react";
import styles from "../styles/entryform.module.css";
import generateTimetableTimes, { Days_Const } from "../utils/generateTimes";
import { EntryContext, FormDataContext, CurrentViewContext } from "../pages/Main/HomePage";
import { validateTimeOrder } from "../utils/validateTime";

const AddEntry = ({ onClose }) => {
  const { addEntries, categories, addCategory } = useContext(EntryContext);
  const { formData, setFormDataAdd } = useContext(FormDataContext);
  const { currentDate } = useContext(CurrentViewContext);
  
  // Local state for entry type
  const [entryType, setEntryType] = useState("once"); // "once" or "recurring"
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  
  const Times = generateTimetableTimes();
  const Days = Days_Const;

  const PRESET_COLORS = [
    "#447ff8", // Blue
    "#10b981", // Green
    "#dc3545", // Red
    "#f59e0b", // Orange
    "#8b5cf6", // Purple
    "#ec4899", // Pink
    "#14b8a6", // Teal
    "#6b7280", // Gray
  ];

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormDataAdd((prevData) => {
      const updatedData = { ...prevData, [id]: value };

      // Generate unique ID when we have subject, day/date, and startTime
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
    // Clear day or date depending on type
    if (type === "once") {
      setFormDataAdd(prev => ({ ...prev, day: "", recurrence: "none" }));
    } else {
      setFormDataAdd(prev => ({ ...prev, date: "" }));
    }
  };

  const handleColorChange = (color) => {
    setFormDataAdd((prev) => ({ ...prev, color }));
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    if (value === "custom") {
      setIsCustomCategory(true);
      setFormDataAdd((prev) => ({ ...prev, category: "" }));
    } else {
      setIsCustomCategory(false);
      const selectedCat = categories.find((c) => c.name === value);
      if (selectedCat) {
        setFormDataAdd((prev) => ({
          ...prev,
          category: selectedCat.name,
          color: selectedCat.color,
        }));
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validation = validateTimeOrder(formData.startTime, formData.endTime);
    if (!validation.isValid) {
      alert(validation.message);
      return;
    }

    // Save custom category if used
    if (isCustomCategory && formData.category) {
      addCategory({ name: formData.category, color: formData.color });
    }

    // Prepare entry based on type
    let entryWithId;
    
    if (entryType === "once") {
      // One-time entry with specific date
      if (!formData.date) {
        alert("Please select a date for this entry");
        return;
      }
      
      // Get day name from date
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
      // Recurring entry (weekly repeat)
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

  // Get default date (today) for date picker
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
        
        {/* Entry Type Selection */}
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

        {/* Conditional rendering based on entry type */}
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
          <label htmlFor="category">Category</label>
          {!isCustomCategory ? (
            <select
              id="category"
              value={formData.category || "Lecture"}
              onChange={handleCategoryChange}
            >
              {categories.map((cat) => (
                <option key={cat.name} value={cat.name}>
                  {cat.name}
                </option>
              ))}
              <option value="custom">+ New Category</option>
            </select>
          ) : (
            <div className={styles["custom-category-input"]}>
              <input
                type="text"
                placeholder="Enter category name"
                value={formData.category}
                onChange={handleInputChange}
                id="category"
                autoFocus
                required
              />
              <button
                type="button"
                className={styles["cancel-custom-btn"]}
                onClick={() => {
                  setIsCustomCategory(false);
                  setFormDataAdd((prev) => ({ ...prev, category: categories[0].name, color: categories[0].color }));
                }}
              >
                ✕
              </button>
            </div>
          )}
        </div>

        <div className={styles["input-field"]}>
          <label>Color</label>
          <div className={styles["color-selection-container"]}>
            {PRESET_COLORS.map((color) => (
              <div
                key={color}
                className={`${styles["color-swatch"]} ${
                  (formData.color || "#447ff8") === color ? styles["selected"] : ""
                }`}
                style={{ backgroundColor: color }}
                onClick={() => handleColorChange(color)}
                title={color}
              />
            ))}
            <div className={`${styles["custom-color-wrapper"]} ${!PRESET_COLORS.includes(formData.color) ? styles["selected"] : ""}`} style={!PRESET_COLORS.includes(formData.color) ? { background: formData.color, border: '2px solid #333' } : {}}>
              {!PRESET_COLORS.includes(formData.color) && <span className={styles["custom-color-icon"]}>+</span>}
              <input
                type="color"
                value={formData.color || "#447ff8"}
                onChange={(e) => handleColorChange(e.target.value)}
                className={styles["custom-color-input"]}
              />
            </div>
          </div>
        </div>

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
