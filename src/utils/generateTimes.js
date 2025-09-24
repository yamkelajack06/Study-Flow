const generateTimetableTimes = () => {
  //Dynamically add times from 6AM to 11PM for the Times rows
  const timetableHours = [];
  for (let hour = 6; hour <= 23; hour++) {
    const isPM = hour >= 12;
    const displayStartHour = isPM ? (hour === 12 ? 12 : hour - 12) : hour;
    const displayEndHour = isPM
      ? hour === 11
        ? 11
        : hour === 12
        ? 1
        : hour - 11
      : hour + 1;
    const startAmPm = isPM ? "PM" : "AM";
    const endAmPm = isPM ? (hour === 22 ? "PM" : "AM") : "AM";

    timetableHours.push({
      startTime: `${displayStartHour}:00 ${startAmPm}`,
      endTime: `${displayEndHour}:00 ${endAmPm}`,
      position: startAmPm, //This is the postition on the row
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
    day: "Thurday",
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
