const generateTimetableTimes = () => {
  const timetableHours = [];
  //Dynamically add times from 6AM to 11PM
  const formatHour = (hour) => {
    const ampm = hour < 12 || hour === 24 ? "AM" : "PM";
    
    let displayHour = hour % 12;
    if (displayHour === 0) {
      displayHour = 12;
    }
    
    return `${displayHour}:00 ${ampm}`;
  };

  for (let startHour = 6; startHour <= 23; startHour++) {
    const startTimeStr = formatHour(startHour);
    
    const endHour = (startHour + 1) % 24;
    const endTimeStr = formatHour(endHour);

    timetableHours.push({
      startTime: startTimeStr,
      endTime: endTimeStr, 
      position: startHour, 
    });
  }
  return timetableHours;
};

const Days_Const = [
  {
    day: "Monday",
    abbreviation: "Mon",
  },
  {
    day: "Tuesday",
    abbreviation: "Tue",
  },
  {
    day: "Wednesday",
    abbreviation: "Wed",
  },
  {
    day: "Thursday",
    abbreviation: "Thu",
  },
  {
    day: "Friday",
    abbreviation: "Fri",
  },
  {
    day: "Saturday",
    abbreviation: "Sat",
  },
  {
    day: "Sunday",
    abbreviation: "Sun",
  },
];

export default generateTimetableTimes;
export { Days_Const };
