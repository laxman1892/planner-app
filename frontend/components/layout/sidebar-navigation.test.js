import test from "node:test";
import assert from "node:assert/strict";

import {
  dashboardNavigationItems,
  getActiveDashboardHref,
  getDashboardHrefBySection,
  isDashboardSection,
} from "./sidebar-navigation.js";

test("dashboard navigation items preserve the expected route order", () => {
  assert.deepEqual(dashboardNavigationItems, [
    { href: "/dashboard", label: "Dashboard", section: "dashboard" },
    { href: "/events", label: "Events", section: "events" },
    { href: "/challenges", label: "Challenges", section: "challenges" },
    { href: "/profile", label: "Profile", section: "profile" },
  ]);
});

test("getActiveDashboardHref falls back to dashboard for unknown paths", () => {
  assert.equal(getActiveDashboardHref("/unknown"), "/dashboard");
});

test("getActiveDashboardHref matches known dashboard routes", () => {
  assert.equal(getActiveDashboardHref("/dashboard"), "/dashboard");
  assert.equal(getActiveDashboardHref("/events"), "/events");
  assert.equal(getActiveDashboardHref("/challenges"), "/challenges");
  assert.equal(getActiveDashboardHref("/profile"), "/profile");
});

test("getDashboardHrefBySection falls back to dashboard for unknown sections", () => {
  assert.equal(getDashboardHrefBySection("unknown"), "/dashboard");
});

test("getDashboardHrefBySection matches known dashboard sections", () => {
  assert.equal(getDashboardHrefBySection("dashboard"), "/dashboard");
  assert.equal(getDashboardHrefBySection("events"), "/events");
  assert.equal(getDashboardHrefBySection("challenges"), "/challenges");
  assert.equal(getDashboardHrefBySection("profile"), "/profile");
});

test("isDashboardSection recognizes the supported sections", () => {
  assert.equal(isDashboardSection("dashboard"), true);
  assert.equal(isDashboardSection("events"), true);
  assert.equal(isDashboardSection("challenges"), true);
  assert.equal(isDashboardSection("profile"), true);
  assert.equal(isDashboardSection("settings"), false);
});
