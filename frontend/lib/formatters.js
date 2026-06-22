export function toDateTimeLocalValue(value, options = {}) {
  const date = new Date(value);
  const getTimezoneOffset = options.getTimezoneOffset ?? ((nextDate) => nextDate.getTimezoneOffset());
  const offset = getTimezoneOffset(date);
  const localDate = new Date(date.getTime() - offset * 60 * 1000);

  return localDate.toISOString().slice(0, 16);
}

export function formatEventTime(value, options = {}) {
  const { locale = "en", timeZone } = options;

  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
    ...(timeZone ? { timeZone } : {}),
  }).format(new Date(value));
}

export function formatChallengeDeadline(value, options = {}) {
  if (!value) {
    return "No deadline";
  }

  const { locale = "en" } = options;
  const [year, month, day] = value.split("-").map(Number);

  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
  }).format(new Date(year, month - 1, day));
}
