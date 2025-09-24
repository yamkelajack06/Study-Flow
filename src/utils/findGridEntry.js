const findEntriesForCell = (entries, day, timeSlot) => {
  return entries.filter(entry => 
    entry.day === day.day && 
    entry.startTime === timeSlot.startTime
  );
};

export default findEntriesForCell;