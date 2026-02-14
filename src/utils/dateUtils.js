export const doesDateMatchEntry = (entry, targetDate) => {
  // For one-time entries, check exact date match
  if (entry.type === "once" && entry.date) {
    const entryDate = new Date(entry.date);
    return (
      entryDate.getFullYear() === targetDate.getFullYear() &&
      entryDate.getMonth() === targetDate.getMonth() &&
      entryDate.getDate() === targetDate.getDate()
    );
  }

  // For recurring entries (or legacy entries without type), check day name match
  if (entry.type === "recurring" || !entry.type) {
    const dayName = targetDate.toLocaleDateString("en-US", { weekday: "long" });
    
    // For simple weekly recurrence
    if (!entry.recurrence || entry.recurrence === "weekly") {
      return entry.day === dayName;
    }

    // For biweekly recurrence (every 2 weeks)
    if (entry.recurrence === "biweekly") {
      // Get week number of the year
      const weekNumber = getWeekNumber(targetDate);
      return entry.day === dayName && weekNumber % 2 === 0;
    }

    // For monthly recurrence (same day each month)
    if (entry.recurrence === "monthly") {
      // Check if it's the same weekday and week of month
      const weekOfMonth = getWeekOfMonth(targetDate);
      return entry.day === dayName && weekOfMonth === 1; // First occurrence of that day in the month
    }
  }

  return false;
};

export const getWeekNumber = (date) => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
};

export const getWeekOfMonth = (date) => {
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const firstDayOfWeek = firstDayOfMonth.getDay();
  const offsetDate = date.getDate() + firstDayOfWeek - 1;
  return Math.floor(offsetDate / 7) + 1;
};

export const formatDateForInput = (date) => {
  return date.toISOString().split('T')[0];
};

export const getRecurrenceDescription = (entry) => {
  if (entry.type === "once") {
    const date = new Date(entry.date);
    return date.toLocaleDateString("en-US", { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
  }

  if (entry.type === "recurring") {
    const patterns = {
      weekly: `Every ${entry.day}`,
      biweekly: `Every other ${entry.day}`,
      monthly: `Monthly on ${entry.day}s`
    };
    return patterns[entry.recurrence] || `Every ${entry.day}`;
  }

  return `Every ${entry.day}`;
};

export const isSameDay = (date1, date2) => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

export const getWeekDates = (date) => {
  const dates = [];
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust to Monday
  const monday = new Date(date.setDate(diff));
  
  for (let i = 0; i < 7; i++) {
    const weekDate = new Date(monday);
    weekDate.setDate(monday.getDate() + i);
    dates.push(weekDate);
  }
  
  return dates;
};

export const getMonthDates = (date) => {
  const dates = [];
  const year = date.getFullYear();
  const month = date.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  for (let day = 1; day <= daysInMonth; day++) {
    dates.push(new Date(year, month, day));
  }
  
  return dates;
};