const optionsDate = { day: "2-digit", month: "2-digit", year: "numeric" };
const optionsTime = { hour: "numeric", minute: "2-digit", hour12: true };
const optionsDay = { weekday: "long" };
export const formattedDate = (currentDateTime) =>
  currentDateTime.toLocaleDateString("en-US", optionsDate);
export const formattedTime = (currentDateTime) =>
  currentDateTime.toLocaleTimeString("en-US", optionsTime);
export const formattedDay = (currentDateTime) =>
  currentDateTime.toLocaleDateString("en-US", optionsDay);
