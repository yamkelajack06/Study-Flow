import { useState, useContext } from "react";
import { Printer, Download, X } from "lucide-react";
import { EntryContext, CurrentViewContext } from "../pages/Main/HomePage";
import styles from "../styles/printtimetable.module.css";
import generateTimetableTimes, { Days_Const } from "../utils/generateTimes";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

const PrintTimetable = () => {
  const [showPreview, setShowPreview] = useState(false);
  const [startTime, setStartTime] = useState("6:00 AM");
  const [endTime, setEndTime] = useState("11:00 PM");
  const { entries, getEntriesForDate } = useContext(EntryContext);
  const { currentDate } = useContext(CurrentViewContext);

  const allTimes = generateTimetableTimes();
  const Days = Days_Const;

  // Get the week dates
  const getWeekDates = () => {
    const dates = [];
    const start = new Date(currentDate);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(start.setDate(diff));

    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      dates.push(date);
    }

    return dates;
  };

  const weekDates = getWeekDates();
  const weekRange = {
    start: weekDates[0].toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    end: weekDates[6].toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
  };

  // Filter times based on selection
  const timeToMinutes = (timeString) => {
    const [time, period] = timeString.split(" ");
    const [hours] = time.split(":");
    let hour24 = parseInt(hours);
    if (period === "PM" && hour24 !== 12) hour24 += 12;
    else if (period === "AM" && hour24 === 12) hour24 = 0;
    return hour24 * 60;
  };

  const filteredTimes = allTimes.filter((time) => {
    const timeMin = timeToMinutes(time.startTime);
    const startMin = timeToMinutes(startTime);
    const endMin = timeToMinutes(endTime);
    return timeMin >= startMin && timeMin < endMin;
  });

const handlePrint = async () => {
  const element = document.getElementById("printable-timetable");
  if (!element) return;

  const originalWidth = element.style.width;
  const originalHeight = element.style.height;
  const originalPadding = element.style.padding;
  
  // Use A4 landscape ratio (1.414) at a normal web resolution so fonts stay large
  element.style.width = "1414px";
  element.style.height = "1000px";
  element.style.padding = "40px"; // Tighter padding so the grid is bigger
  
  try {
    const canvas = await html2canvas(element, {
      scale: 3, // Boosts quality/sharpness without shrinking relative font size
      backgroundColor: "#ffffff",
      windowWidth: 1414, 
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("landscape", "mm", "a4");
    
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    // Paste edge-to-edge
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Timetable_${weekRange.start}-${weekRange.end}.pdf`);
    
  } catch (error) {
    console.error("Failed to generate PDF", error);
  } finally {
    element.style.width = originalWidth;
    element.style.height = originalHeight;
    element.style.padding = originalPadding;
  }
};
  const handleExportPDF = () => {
    // Browser's "Save as PDF" option will handle PDF export
    window.print();
  };

  return (
    <>
      <button
        className={styles["print-button"]}
        onClick={() => setShowPreview(true)}
        aria-label="Print timetable"
        title="Print Timetable"
      >
        <Printer size={20} />
      </button>

      {showPreview && (
        <div
          className={styles["preview-backdrop"]}
          onClick={() => setShowPreview(false)}
        >
          <div
            className={styles["preview-modal"]}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className={styles["preview-header"]}>
              <div>
                <h2>Export Timetable</h2>
                <p>
                  Exporting: {weekRange.start} - {weekRange.end}
                </p>
              </div>
              <button
                className={styles["close-button"]}
                onClick={() => setShowPreview(false)}
              >
                <X size={24} />
              </button>
            </div>

            {/* Time Range Selector */}
            <div className={styles["time-selector"]}>
              <div className={styles["time-input-group"]}>
                <label htmlFor="start-time">Start Time</label>
                <select
                  id="start-time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                >
                  {allTimes.map((time) => (
                    <option key={time.startTime} value={time.startTime}>
                      {time.startTime}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles["time-input-group"]}>
                <label htmlFor="end-time">End Time</label>
                <select
                  id="end-time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                >
                  {allTimes.map((time) => (
                    <option key={time.endTime} value={time.endTime}>
                      {time.endTime}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Preview */}
            <div className={styles["preview-container"]}>
              <div
                className={styles["preview-content"]}
                id="printable-timetable"
              >
                <div className={styles["print-header"]}>
                  <h1>Study Timetable</h1>
                  <p>
                    Week of {weekRange.start} - {weekRange.end}
                  </p>
                </div>

                <table className={styles["timetable-table"]}>
                  <thead>
                    <tr>
                      <th className={styles["time-column"]}>Day / Time</th>
                      {filteredTimes.map((time) => (
                        <th
                          key={time.startTime}
                          className={styles["time-header"]}
                        >
                          <div className={styles["time-label"]}>
                            <span className={styles["start-time"]}>
                              {time.startTime}
                            </span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Days.map((day, dayIndex) => {
                      const cellDate = weekDates[dayIndex];
                      const entriesForDate = getEntriesForDate(cellDate);

                      return (
                        <tr key={day.day}>
                          <td className={styles["day-label"]}>
                            <strong>{day.day}</strong>
                            <span className={styles["day-date"]}>
                              {cellDate.toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          </td>
                          {filteredTimes.map((time) => {
                            const entriesForCell = entriesForDate.filter(
                              (entry) => entry.startTime === time.startTime,
                            );

                            return (
                              <td
                                key={`${day.day}-${time.startTime}`}
                                className={styles["timetable-cell"]}
                              >
                                {entriesForCell.map((entry) => (
                                  <div
                                    key={entry.id}
                                    className={styles["entry-block"]}
                                    style={{
                                      backgroundColor: entry.color || "#447ff8",
                                    }}
                                  >
                                    <span className={styles["entry-subject"]}>
                                      {entry.subject}
                                    </span>
                                    <span className={styles["entry-time"]}>
                                      {entry.startTime} - {entry.endTime}
                                    </span>
                                  </div>
                                ))}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Action Buttons */}
            <div className={styles["preview-actions"]}>
              <button
                className={styles["cancel-button"]}
                onClick={() => setShowPreview(false)}
              >
                Cancel
              </button>
              <button className={styles["export-button"]} onClick={handlePrint}>
                <Printer size={18} />
                Print
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PrintTimetable;
