// Convert time string 
const timeToMinutes = (timeString) => {
  const [time, period] = timeString.split(' ');
  const [hours, minutes] = time.split(':');
  
  let hour24 = parseInt(hours);
  if (period === 'PM' && hour24 !== 12) {
    hour24 += 12;
  } else if (period === 'AM' && hour24 === 12) {
    hour24 = 0;
  }
  
  return hour24 * 60 + (parseInt(minutes) || 0);
};

// Check if two time ranges overlap
const doTimesOverlap = (start1, end1, start2, end2) => {
  const start1Min = timeToMinutes(start1);
  const end1Min = timeToMinutes(end1);
  const start2Min = timeToMinutes(start2);
  const end2Min = timeToMinutes(end2);
  
  return start1Min < end2Min && start2Min < end1Min;
};

//checks if new entry conflicts with existing ones
const detectTimeConflict = (entries, newEntry, isUpdate = false) => {
  const currentEntryId = newEntry.oldId || newEntry.id;
  
  // Get all entries on the same day
  const sameDay = entries.filter(entry => {
    // Skip the entry we're updating
    if (isUpdate && entry.id === currentEntryId) {
      return false;
    }
    return entry.day === newEntry.day;
  });
  
  // Check each entry for time overlap
  for (const entry of sameDay) {
    if (doTimesOverlap(
      newEntry.startTime,
      newEntry.endTime,
      entry.startTime,
      entry.endTime
    )) {
      return {
        hasConflict: true,
        conflictingEntry: entry,
        message: `This time slot conflicts with "${entry.subject}" scheduled from ${entry.startTime} to ${entry.endTime} on ${entry.day}.`
      };
    }
  }
  
  return {
    hasConflict: false,
    conflictingEntry: null,
    message: ''
  };
};

// Wrapper function for easy validation
const validateEntryWithConflict = (entries, entry, isUpdate = false) => {
  const conflict = detectTimeConflict(entries, entry, isUpdate);
  
  if (conflict.hasConflict) {
    return {
      isValid: false,
      message: conflict.message,
      conflictingEntry: conflict.conflictingEntry
    };
  }
  
  return {
    isValid: true,
    message: '',
    conflictingEntry: null
  };
};

export { detectTimeConflict, doTimesOverlap, timeToMinutes, validateEntryWithConflict };
export default detectTimeConflict;