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

  EMPLOYEES_READ: "employees.read",
  EMPLOYEES_CREATE: "employees.create",

  BOOKINGS_READ: "bookings.read",
  BOOKINGS_CREATE: "bookings.create",
  BOOKINGS_CANCEL: "bookings.cancel",

  VEHICLES_READ: "vehicles.read",
  VEHICLES_CREATE: "vehicles.create",
  VEHICLES_UPDATE: "vehicles.update",

  PAYMENTS_READ: "payments.read",
  PAYMENTS_CREATE: "payments.create",
  PAYMENTS_VERIFY: "payments.verify",

  CERTIFICATES_READ: "certificates.read",
  CERTIFICATES_CREATE: "certificates.create",
  CERTIFICATES_UPDATE: "certificates.update",
  CERTIFICATES_REMIT_GOVERNMENT: "certificates.remit-government",

  TRANSPORT_READ: "transport.read",

  REPORTS_READ: "reports.read",

  USERS_READ: "users.read",
  USERS_CREATE: "users.create",
  USERS_UPDATE: "users.update",

  SETTINGS_READ: "settings.read",
  SETTINGS_UPDATE: "settings.update",

  EXPENSES_READ: "expenses.read",
  EXPENSES_CREATE: "expenses.create",
  EXPENSES_PAY: "expenses.pay",
  EXPENSES_DELETE: "expenses.delete",
};
