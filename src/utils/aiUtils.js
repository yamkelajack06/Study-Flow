//Takes in the state extracts the details of the state and then concatenates it with the instructions
function formatState(state) {
  if (!Array.isArray(state) || state.length === 0) {
    return "\nCurrent timetable is empty.\n";
  }

  const entryStrings = state.map((entry) => {
    const {
      id = "N/A",
      subject = "N/A",
      type = "recurring", // Default to recurring for legacy entries
      day = "N/A",
      date = null,
      startTime = "N/A",
      endTime = "N/A",
      recurrence = "weekly",
      notes = "",
    } = entry;

    // Format based on entry type
    if (type === "once" && date) {
      return `- ID: ${id}
  Type: One-time entry
  Subject: ${subject}
  Date: ${date}
  Day: ${day}
  Start Time: ${startTime}
  End Time: ${endTime}
  Notes: ${notes || "(none)"}`;
    } else {
      // Recurring entry
      return `- ID: ${id}
  Type: Recurring entry
  Subject: ${subject}
  Day: ${day}
  Recurrence: ${recurrence}
  Start Time: ${startTime}
  End Time: ${endTime}
  Notes: ${notes || "(none)"}`;
    }
  });

  return `\nCurrent timetable entries:\n${entryStrings.join("\n\n")}\n`;
}

function cleanAIResponse(response) {
  if (!response) return null;

  if (typeof response === "object") return response;

  let cleaned = response.trim().replace(/```(?:json)?\s*/g, "");

  try {
    return JSON.parse(cleaned);
  } catch (error) {
    console.error(error);
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch (e) {
        console.error(e);
        return null;
      }
    }
    return null;
  }
}

function parseResponse(text) {
  //If the AI responds with a valid object return the object
  const cleaned = cleanAIResponse(text);

  if (
    cleaned &&
    typeof cleaned === "object" &&
    ["add", "update", "delete", "view", "delete_multiple", "add_multiple"].includes(cleaned.action)
  ) {
    // Validate entry structure based on type
    if (cleaned.action === "add") {
      // Ensure proper fields based on type
      if (cleaned.type === "once") {
        if (!cleaned.date) {
          return {
            error: true,
            message: "One-time entries require a date field"
          };
        }
        // Set day from date if not present
        if (!cleaned.day && cleaned.date) {
          const dateObj = new Date(cleaned.date);
          cleaned.day = dateObj.toLocaleDateString("en-US", { weekday: "long" });
        }
      } else if (cleaned.type === "recurring") {
        if (!cleaned.day) {
          return {
            error: true,
            message: "Recurring entries require a day field"
          };
        }
        if (!cleaned.recurrence) {
          cleaned.recurrence = "weekly"; // Default
        }
      }
    }

    if (cleaned.action === "add_multiple" && Array.isArray(cleaned.entries)) {
      // Validate each entry
      cleaned.entries = cleaned.entries.map(entry => {
        if (entry.type === "once") {
          if (!entry.date) {
            console.warn("Skipping entry without date:", entry);
            return null;
          }
          // Set day from date if not present
          if (!entry.day && entry.date) {
            const dateObj = new Date(entry.date);
            entry.day = dateObj.toLocaleDateString("en-US", { weekday: "long" });
          }
          if (!entry.recurrence) {
            entry.recurrence = "none";
          }
        } else if (entry.type === "recurring" || !entry.type) {
          if (!entry.day) {
            console.warn("Skipping recurring entry without day:", entry);
            return null;
          }
          if (!entry.recurrence) {
            entry.recurrence = "weekly";
          }
          entry.type = "recurring"; // Ensure type is set
        }
        return entry;
      }).filter(Boolean); // Remove null entries
    }

    return cleaned;
  }

  return null;
}

export { parseResponse, formatState };