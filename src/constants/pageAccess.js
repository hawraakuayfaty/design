import { P } from "./roles";

// Single source of truth for "which permission unlocks which top-level dashboard page".
// Used both by MainLayout's sidebar (to hide nav items the user can't open) and by
// AdminDashboard_3.jsx's page guard (to block direct access if `activePage` ever ends up
// on a restricted page some other way). Keeping one map means the two can't drift apart.
// A `null`/missing entry means the page is visible to anyone who reached the dashboard.
export const PAGE_PERMISSIONS = {
  Dashboard: null,
  AdminProPage: P.ROLES_MANAGE,
  ReceptionistPage: P.BOOKINGS_READ,
  Accounting: P.PAYMENTS_READ,
  AccountantProPage: P.EXPENSES_READ,
  Students: P.STUDENTS_READ,
  Instructors: P.INSTRUCTORS_READ,
  Vehicles: P.VEHICLES_READ,
  // Transport and Users are static demo pages wired to permission codes the live backend
  // never grants (transport.read / users.read don't exist in the current catalog) — left
  // ungated on purpose so they don't silently vanish for everyone including MANAGER.
  Transport: null,
  Reports: null,
  Users: null,
  Settings: P.SETTINGS_READ,
};
