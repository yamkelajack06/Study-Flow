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

export const validateTimeOrder = (startTime, endTime) => {
  if (!startTime || !endTime) {
    return { isValid: true, message: '' };
  }
  
  const startMinutes = timeToMinutes(startTime);
  const endMinutes = timeToMinutes(endTime);
  
  if (endMinutes <= startMinutes) {
    return {
      isValid: false,
      message: 'End time must be after start time'
    };
  }
  
  return { isValid: true, message: '' };
};