import moment from "moment";

export const getGreeting = (date: any) => {
  const m = moment.isMoment(date) ? date : moment(date);
  const hour = m.hour();
  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
};

export const formatTime = (dateOrMoment: any) => {
  const m = moment.isMoment(dateOrMoment) ? dateOrMoment : moment(dateOrMoment);
  return m.format("h:mm a");
};

export const formatDate = (dateOrMoment: any) => {
  const m = moment.isMoment(dateOrMoment) ? dateOrMoment : moment(dateOrMoment);
  return m.format("dddd Do MMMM, YYYY");
};

export const formatDuration = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};
