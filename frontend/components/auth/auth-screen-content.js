export const authPreviewItems = [
  {
    key: "streak",
    icon: "sparkles",
    label: "Active streak",
    value: "5 days strong",
  },
  {
    key: "plan",
    icon: "calendar",
    label: "Next quest",
    value: "Design review at 10:30",
  },
  {
    key: "badge",
    icon: "medal",
    label: "Latest achievement",
    value: "Planner Starter",
  },
];

export const authPreviewIconNames = ["calendar", "medal", "sparkles"];

export function isAuthPreviewIconName(iconName) {
  return authPreviewIconNames.includes(iconName);
}

export function createAuthPreviewIcons(iconComponents) {
  return {
    calendar: iconComponents.calendar,
    medal: iconComponents.medal,
    sparkles: iconComponents.sparkles,
  };
}

export function getAuthHeading(mode) {
  return mode === "login" ? "Welcome back, adventurer" : "Create an account";
}
