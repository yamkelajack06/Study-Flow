import { useContext, useState, useEffect } from "react";
import styles from "../styles/entryform.module.css";
import modalStyles from "../styles/modal.module.css";
import generateTimetableTimes, { Days_Const } from "../utils/generateTimes";
import { EntryContext, CurrentEntryContext } from "../pages/Main/HomePage";
import { validateTimeOrder } from "../utils/validateTime";

const EditEntryModal = ({ onClose }) => {
  const { currentEntry } = useContext(CurrentEntryContext);
  const { updateEntries, deleteEntries, categories, addCategory } = useContext(EntryContext);

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
    category: "",
    color: "#447ff8",
  });
  
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
        firestoreId: currentEntry.firestoreId || "",
        category: currentEntry.category || "Lecture",
        color: currentEntry.color || "#447ff8",
      });
    }
  }, [currentEntry]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormDataEdit((prevData) => ({ ...prevData, [id]: value }));
  };

  const handleColorChange = (color) => {
    setFormDataEdit((prev) => ({ ...prev, color }));
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    if (value === "custom") {
      setIsCustomCategory(true);
      setFormDataEdit((prev) => ({ ...prev, category: "" }));
    } else {
      setIsCustomCategory(false);
      const selectedCat = categories.find((c) => c.name === value);
      if (selectedCat) {
        setFormDataEdit((prev) => ({
          ...prev,
          category: selectedCat.name,
          color: selectedCat.color,
        }));
      }
    }
  };

  const handleDelete = async () => {
    // Pass the full currentEntry so deleteEntries can resolve the correct ID
    const success = await deleteEntries(currentEntry);
    if (success) onClose();
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

    // Save custom category if used
    if (isCustomCategory && formDataEdit.category) {
      addCategory({ name: formDataEdit.category, color: formDataEdit.color });
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
              <label htmlFor="category">Category</label>
              {!isCustomCategory ? (
                <select
                  id="category"
                  value={formDataEdit.category}
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
                    value={formDataEdit.category}
                    onChange={handleInputChange}
                    id="category"
                    autoFocus
                    required
                  />
                  <button
                    type="button"
                    className={styles["cancel-custom-btn"]}
                    onClick={() => setIsCustomCategory(false)}
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
                      (formDataEdit.color || "#447ff8") === color ? styles["selected"] : ""
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => handleColorChange(color)}
                    title={color}
                  />
                ))}
                <div className={`${styles["custom-color-wrapper"]} ${!PRESET_COLORS.includes(formDataEdit.color) ? styles["selected"] : ""}`} style={!PRESET_COLORS.includes(formDataEdit.color) ? { background: formDataEdit.color, border: '2px solid #333' } : {}}>
                  {!PRESET_COLORS.includes(formDataEdit.color) && <span className={styles["custom-color-icon"]}>+</span>}
                  <input
                    type="color"
                    value={formDataEdit.color || "#447ff8"}
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
              <button
                type="button"
                onClick={handleDelete}
                className={styles["delete-button"]}
              >
                Delete
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