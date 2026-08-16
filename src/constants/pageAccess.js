import { P } from "./roles";

// Which permission unlocks each in-page sub-tab, keyed by the tab id used in MainLayout's
// ADMIN/ACCOUNTANT/RECEPTIONIST_SUB_TABS and mirrored by each dashboard's own
// RequirePermission-wrapped sub-page (AdminPro.jsx, AccountantPro.jsx, ReceptionistPro.jsx) so
// a tab can never be visible in the topbar without also being reachable, or reachable without
// also being visible. `null` means the tab has no backing permission (open to anyone who
// reached the parent page).
export const ADMIN_SUB_TAB_PERMISSIONS = {
  permissions: P.ROLES_MANAGE,
  pricing: P.SETTINGS_READ,
};

export const ACCOUNTANT_SUB_TAB_PERMISSIONS = {
  "general-expenses": P.EXPENSES_READ,
  employees: P.EMPLOYEES_READ,
};

export const RECEPTIONIST_SUB_TAB_PERMISSIONS = {
  students: P.STUDENTS_READ,
  bookings: P.BOOKINGS_READ,
  instructors: P.INSTRUCTORS_READ,
  certificate: P.CERTIFICATES_READ,
};

// A composite page (one with its own sub-tabs) must stay visible as long as the user can open
// AT LEAST ONE of those sub-tabs — a single hardcoded permission on the parent would hide the
// whole section for someone who has, say, only `employees.read` and not `expenses.read`, even
// though the "الموظفون" sub-tab is perfectly reachable for them. Deriving the requirement list
// straight from the sub-tab map (instead of hand-maintaining a second copy) means the parent's
// visibility can never drift out of sync with what its tabs actually require.
const anyOf = (subTabPermissions) => Object.values(subTabPermissions).filter(Boolean);

// Single source of truth for "which permission(s) unlock which top-level dashboard page". A
// value is either one permission code, an array of codes (page opens if the user has ANY of
// them), or `null`/missing (open to anyone who reached the dashboard). Used by MainLayout's
// sidebar (to hide nav items the user can't open) and by AdminDashboard_3.jsx's page guard (to
// block direct access if `activePage` ever ends up on a restricted page some other way) —
// both read it through `isPageAllowed` below so the two can't drift apart.
export const PAGE_PERMISSIONS = {
  Dashboard: P.DASHBOARD_READ,
  AdminProPage: anyOf(ADMIN_SUB_TAB_PERMISSIONS),
  ReceptionistPage: anyOf(RECEPTIONIST_SUB_TAB_PERMISSIONS),
  Accounting: P.PAYMENTS_READ,
  AccountantProPage: anyOf(ACCOUNTANT_SUB_TAB_PERMISSIONS),
  Students: P.STUDENTS_READ,
  Instructors: P.INSTRUCTORS_READ,
  Vehicles: P.VEHICLES_READ,
  // Reports is open to everyone who reaches the dashboard (no backing permission).
  Reports: null,
  Settings: P.SETTINGS_READ,
};

// Shared check used everywhere a PAGE_PERMISSIONS (or any similarly-shaped) entry gets
// evaluated against the current user — handles all three value shapes above uniformly.
export function isPageAllowed(hasPermission, requirement) {
  if (!requirement) return true;
  if (Array.isArray(requirement)) {
    return requirement.length === 0 || requirement.some((perm) => hasPermission(perm));
  }
  return hasPermission(requirement);
}
