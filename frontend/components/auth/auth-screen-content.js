export const authPreviewItems = [
  {
    key: "streak",
    icon: "sparkles",
    label: "Challenge streak",
    value: "5 days",
  },
  {
    key: "plan",
    icon: "calendar",
    label: "Next shared plan",
    value: "Design review",
  },
  {
    key: "badge",
    icon: "medal",
    label: "Latest badge",
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
  return mode === "login" ? "Log in to your planner" : "Create your planner profile";
}
