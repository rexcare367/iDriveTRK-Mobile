// Generate mock clock data for a date range
export const generateMockClockData = (startDate, endDate) => {
  const clockData = [];
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    // Skip weekends
    if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
      const clockIn = new Date(currentDate);
      clockIn.setHours(9, Math.floor(Math.random() * 15), 0); // Random minutes between 0-14

      const clockOut = new Date(currentDate);
      // Random end time between 5:00 PM and 6:30 PM
      const endHour = 17 + (Math.random() > 0.7 ? 1 : 0);
      const endMinute = Math.floor(Math.random() * 30);
      clockOut.setHours(endHour, endMinute, 0);

      // Random break duration between 30 mins and 1 hour
      const breakDuration = (30 + Math.floor(Math.random() * 30)) / 60;

      clockData.push({
        date: new Date(currentDate),
        clockIn,
        clockOut,
        breakDuration,
        notes: ""
      });
    }

    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return clockData;
};

// Format date to display
export const formatDate = (date) => {
  if (!date) return "";
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric"
  });
};

// Format time to display
export const formatTime = (date) => {
  if (!date) return "";
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit"
  });
};
