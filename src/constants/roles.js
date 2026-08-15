export const ROLES = {
  MANAGER: "MANAGER",
  RECEPTIONIST: "RECEPTIONIST",
  ACCOUNTANT: "ACCOUNTANT",
  INSTRUCTOR: "INSTRUCTOR",
  STUDENT: "STUDENT",
};

export const ROLE_LABELS = {
  [ROLES.MANAGER]: "مدير",
  [ROLES.RECEPTIONIST]: "استقبال",
  [ROLES.ACCOUNTANT]: "محاسب",
  [ROLES.INSTRUCTOR]: "مدرب",
  [ROLES.STUDENT]: "طالب",
};

export const EMPLOYEE_ROLES = [ROLES.MANAGER, ROLES.RECEPTIONIST, ROLES.ACCOUNTANT];

export const P = {
  STUDENTS_READ: "students.read",
  STUDENTS_CREATE: "students.create",
  STUDENTS_UPDATE: "students.update",

  INSTRUCTORS_READ: "instructors.read",
  INSTRUCTORS_CREATE: "instructors.create",
  INSTRUCTORS_UPDATE: "instructors.update",
  INSTRUCTORS_ARCHIVE: "instructors.archive",
  INSTRUCTOR_SCHEDULE_UPDATE: "instructor.schedule.update",
  INSTRUCTOR_LEAVE_CREATE: "instructor.leave.create",

  EMPLOYEES_READ: "employees.read",
  EMPLOYEES_CREATE: "employees.create",
  EMPLOYEES_UPDATE: "employees.update",
  EMPLOYEES_ARCHIVE: "employees.archive",

  BOOKINGS_READ: "bookings.read",
  BOOKINGS_READ_OWN: "bookings.read-own",
  BOOKINGS_CREATE: "bookings.create",
  BOOKINGS_CREATE_OWN: "bookings.create-own",
  BOOKINGS_CANCEL: "bookings.cancel",
  BOOKINGS_CANCEL_OWN: "bookings.cancel-own",
  BOOKINGS_COMPLETE: "bookings.complete",

  VEHICLES_READ: "vehicles.read",
  VEHICLES_CREATE: "vehicles.create",
  VEHICLES_UPDATE: "vehicles.update",
  VEHICLES_FUEL: "vehicles.fuel",
  VEHICLES_MAINTENANCE: "vehicles.maintenance",
  VEHICLES_ARCHIVE: "vehicles.archive",

  PAYMENTS_READ: "payments.read",
  PAYMENTS_CREATE: "payments.create",
  // Not present in the live permissions catalog (kept only because older code still references it) — never granted by the backend.
  PAYMENTS_VERIFY: "payments.verify",

  CERTIFICATES_READ: "certificates.read",
  CERTIFICATES_READ_OWN: "certificates.read-own",
  CERTIFICATES_CREATE: "certificates.create",
  CERTIFICATES_CREATE_OWN: "certificates.create-own",
  CERTIFICATES_UPDATE: "certificates.update",
  CERTIFICATES_CANCEL: "certificates.cancel",
  CERTIFICATES_EXPORT: "certificates.export",
  CERTIFICATES_IMPORT: "certificates.import",
  CERTIFICATES_REMIT_GOVERNMENT: "certificates.remit-government",

  // Not present in the live permissions catalog (kept only because older code still references it) — never granted by the backend.
  TRANSPORT_READ: "transport.read",

  // Not present in the live permissions catalog (kept only because older code still references it) — never granted by the backend.
  REPORTS_READ: "reports.read",

  USERS_BLOCK: "users.block",
  // Not present in the live permissions catalog (kept only because older code still references it) — never granted by the backend.
  USERS_READ: "users.read",
  USERS_CREATE: "users.create",
  USERS_UPDATE: "users.update",

  SETTINGS_READ: "settings.read",
  SETTINGS_UPDATE: "settings.update",

  EXPENSES_READ: "expenses.read",
  EXPENSES_CREATE: "expenses.create",
  EXPENSES_UPDATE: "expenses.update",
  EXPENSES_PAY: "expenses.pay",
  EXPENSES_DELETE: "expenses.delete",

  DASHBOARD_READ: "dashboard.read",

  ROLES_MANAGE: "roles.manage",
};
