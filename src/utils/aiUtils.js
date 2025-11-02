//Takes in the state extracts the details of the state and then concatenates it with the instructions
function formatState(state) {
  if (!Array.isArray(state) || state.length === 0) {
    return "\nCurrent timetable is empty.\n";
  }

  const entryStrings = state.map((entry) => {
    const {
      id = "N/A",
      subject = "N/A",
      day = "N/A",
      startTime = "N/A",
      endTime = "N/A",
      notes = "",
    } = entry;

    return `- ID: ${id}
  Subject: ${subject}
  Day: ${day}
  Start Time: ${startTime}
  End Time: ${endTime}
  Notes: ${notes || "(none)"}`;
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
    return cleaned;
  }

  return null;
}

export { parseResponse, formatState };
