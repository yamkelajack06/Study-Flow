// src/utils/aiUtils.js

function formatState(state) {
  if (!Array.isArray(state) || state.length === 0) {
    return "\nCurrent timetable is empty.\n";
  }

  const entryStrings = state.map((entry) => {
    const {
      id = "N/A",
      firestoreId = null,       // ← expose firestoreId when present
      subject = "N/A",
      type = "recurring",
      day = "N/A",
      date = null,
      startTime = "N/A",
      endTime = "N/A",
      recurrence = "weekly",
      notes = "",
    } = entry;

    // The deletable ID is firestoreId when available, otherwise id
    const deletableId = firestoreId || id;

    if (type === "once" && date) {
      return `- ID: ${deletableId}
  Type: One-time entry
  Subject: ${subject}
  Date: ${date}
  Day: ${day}
  Start Time: ${startTime}
  End Time: ${endTime}
  Notes: ${notes || "(none)"}`;
    } else {
      return `- ID: ${deletableId}
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

  let cleaned = response.trim().replace(/```(?:json)?\s*/g, "").replace(/```/g, "");

  try {
    return JSON.parse(cleaned);
  } catch {
    // Try to extract a JSON object from within the text
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch {
        return null;
      }
    }
    return null;
  }
}

function parseResponse(text) {
  const cleaned = cleanAIResponse(text);

  if (
    cleaned &&
    typeof cleaned === "object" &&
    ["add", "update", "delete", "view", "delete_multiple", "add_multiple"].includes(cleaned.action)
  ) {
    if (cleaned.action === "add") {
      if (cleaned.type === "once") {
        if (!cleaned.date) {
          return { error: true, message: "One-time entries require a date field" };
        }
        if (!cleaned.day && cleaned.date) {
          const dateObj = new Date(cleaned.date);
          cleaned.day = dateObj.toLocaleDateString("en-US", { weekday: "long" });
        }
      } else if (cleaned.type === "recurring") {
        if (!cleaned.day) {
          return { error: true, message: "Recurring entries require a day field" };
        }
        if (!cleaned.recurrence) cleaned.recurrence = "weekly";
      }
    }

    if (cleaned.action === "add_multiple" && Array.isArray(cleaned.entries)) {
      cleaned.entries = cleaned.entries.map(entry => {
        if (entry.type === "once") {
          if (!entry.date) { console.warn("Skipping entry without date:", entry); return null; }
          if (!entry.day && entry.date) {
            const dateObj = new Date(entry.date);
            entry.day = dateObj.toLocaleDateString("en-US", { weekday: "long" });
          }
          if (!entry.recurrence) entry.recurrence = "none";
        } else {
          if (!entry.day) { console.warn("Skipping recurring entry without day:", entry); return null; }
          if (!entry.recurrence) entry.recurrence = "weekly";
          entry.type = "recurring";
        }
        return entry;
      }).filter(Boolean);
    }

    // ── Validate delete IDs — reject "N/A" before they reach Firebase ──
    if (cleaned.action === "delete") {
      if (!cleaned.id || cleaned.id === "N/A") {
        return { error: true, message: "I couldn't find a valid ID for that entry. Please try again or delete it manually." };
      }
    }

    if (cleaned.action === "delete_multiple" && Array.isArray(cleaned.entries)) {
      const validEntries = cleaned.entries.filter(e => e.id && e.id !== "N/A");
      if (validEntries.length === 0) {
        return { error: true, message: "I couldn't find valid IDs for those entries. Try refreshing and asking again." };
      }
      cleaned.entries = validEntries;
    }

    return cleaned;
  }

  // Not JSON / not an action → return null so AIAssistant treats it as conversational text
  return null;
}

export { parseResponse, formatState };