export interface IVehicle {
  id: string;
  scheduler_id: string;
  name: string | null;
  speed: number | null;
  fuel: number | null;
  payload: number | null;
  engine: number | null;
  status: string;
  created_at: string;
  updated_at: string;
  photo: string;
  make: string;
  unit_number: string;
  model: string;
  year: string;
  vin_number: string;
  tire_size: string;
  put_into_service_date: string;
  owned_or_leased: string;
  sales_or_lease_agreement: string;
  lytx_serial: string;
  eld_serial: string;
  license_plate: string;
}
export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  contractNumber?: string;
  employeeRole: string;
  access_permissions?: string[];
  avatar?: string;
  phone?: string;
  emergency_contact?: string;
  created_at: string;
  uid: string;
  joined_at: string; // ISO date string
  updated_at: string;
  status: string;
  color: string;
  pto_initials?: {
    pto: number;
    holiday_pay: number;
    sick_leave: number;
    non_paid_absence: number;
  };
  pto_limits?: {
    pto: number;
    holiday_pay: number;
    sick_leave: number;
    non_paid_absence: number;
  };
  schedulers: IScheduler[];
}

export interface IScheduler {
  id: string;
  created_at: string;
  status: 'active' | 'inactive' | 'archived';
  title: string;
  admins: string[]; // UUID array
  assigned: string[]; // UUID array
  users: IUser[];
  managers: IUser[];
  pay_period_type: 'biweekly' | 'monthly';
  pay_period_day?: number; // For monthly: 1 or 15
  [key: string]: any;
}

export interface ITruck {
  id: string;
  scheduler_id: string;
  name: string | null;
  license_plate: string | null;
  vin_number: string | null;
  make: string | null;
  model: string | null;
  year: string | null;
  color: string | null;
  type: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  photo: string | null;
  odometer: number | null;
  fuel_type: string | null;
  fuel_capacity: number | null;
  fuel_efficiency: number | null;
  transmission: string | null;
  engine_hours: number | null;
  tire_size: string | null;
  payload_capacity: number | null;
  brake_type: string | null;
  insurance_policy_number: string | null;
  insurance_expiration_date: string | null;
  inspection_due_date: string | null;
  registration_expiration_date: string | null;
  last_service_date: string | null;
  next_service_due_date: string | null;
}

export interface ISchedule {
  asignee: string;
  color: string;
  created_at: string;
  description: string;
  end_time: string;
  id: string;
  job_id: string;
  scheduler_id: string;
  start_time: string;
  status: string;
  stops: any[];
  name: string;
  type: string;
  job: any;
}

export interface IBreak {
  id: string;
  break_start: string;
  break_end: string;
  break_type: string;
  break_minutes: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  timesheet_id: string;
}

export interface ITimesheet {
  id: string;
  clockin_time: string;
  clockout_time: string;
  breaks: IBreak[];
  created_at: string;
  updated_at: string;
  is_submitted: boolean;
  status: string;
  schedule: ISchedule;
  truck: ITruck;
  user: IUser;
}

export interface ITrip {}

export interface INotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success' | 'trip' | 'timesheet' | 'payroll' | 'system';
  isRead: boolean;
  createdAt: string;
  userId: string;
  schedulerId: string;
  actionUrl?: string;
  metadata?: any;
}

export interface NotificationState {
  notifications: INotification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
}

export interface UserState {
  currentUser: IUser | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

export interface AuthState {
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  user: IUser | null;
  currentScheduler: string | null;
}

export interface DriverState {
  // Add driver-specific state properties here
}

export interface TimesheetState {
  // Add timesheet-specific state properties here
}

export interface IPayPeriod {
  id: string;
  scheduler_id: string;
  start_date: string;
  end_date: string;
  status: 'active' | 'closed' | 'processing';
  pay_period_type: 'biweekly' | 'monthly';
  created_at: string;
  updated_at: string;
}

export interface PayrollState {
  payPeriods: IPayPeriod[];
  loading: boolean;
  error: string | null;
  // Add other payroll-specific state properties here
}

export interface RootState {
  user: UserState;
  auth: AuthState;
  driver: DriverState;
  timesheet: TimesheetState;
  payroll: PayrollState;
  notification: NotificationState;
}

// Auth Types
export const LOGIN_REQUEST = "LOGIN_REQUEST";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAILURE = "LOGIN_FAILURE";
export const SIGNUP_REQUEST = "SIGNUP_REQUEST";
export const SIGNUP_SUCCESS = "SIGNUP_SUCCESS";
export const SIGNUP_FAILURE = "SIGNUP_FAILURE";
export const SETUP_ACCOUNT_REQUEST = "SETUP_ACCOUNT_REQUEST";
export const SETUP_ACCOUNT_SUCCESS = "SETUP_ACCOUNT_SUCCESS";
export const SETUP_ACCOUNT_FAILURE = "SETUP_ACCOUNT_FAILURE";
export const VERIFY_OTP_REQUEST = "VERIFY_OTP_REQUEST";
export const VERIFY_OTP_SUCCESS = "VERIFY_OTP_SUCCESS";
export const VERIFY_OTP_FAILURE = "VERIFY_OTP_FAILURE";
export const CREATE_PIN_REQUEST = "CREATE_PIN_REQUEST";
export const CREATE_PIN_SUCCESS = "CREATE_PIN_SUCCESS";
export const CREATE_PIN_FAILURE = "CREATE_PIN_FAILURE";
export const LOGOUT = "LOGOUT";
export const SWITCH_SCHEDULER = "SWITCH_SCHEDULER";

// User Types

export const FETCH_USER_FAILURE = "FETCH_USER_FAILURE";
export const FETCH_USER_REQUEST = "FETCH_USER_REQUEST";
export const FETCH_USER_SUCCESS = "FETCH_USER_SUCCESS";

export const UPDATE_USER_REQUEST = "UPDATE_USER_REQUEST";
export const UPDATE_USER_SUCCESS = "UPDATE_USER_SUCCESS";
export const UPDATE_USER_FAILURE = "UPDATE_USER_FAILURE";

export const UPDATE_PROFILE_PHOTO_REQUEST = "UPDATE_PROFILE_PHOTO_REQUEST";
export const UPDATE_PROFILE_PHOTO_SUCCESS = "UPDATE_PROFILE_PHOTO_SUCCESS";
export const UPDATE_PROFILE_PHOTO_FAILURE = "UPDATE_PROFILE_PHOTO_FAILURE";

// Driver Types
export const CLOCK_IN = "CLOCK_IN";
export const UPDATE_CLOCK_IN_FORM = "UPDATE_CLOCK_IN_FORM";
export const CLOCK_OUT = "CLOCK_OUT";
export const SELECT_TRIP = "SELECT_TRIP";
export const CONFIRM_TRIP = "CONFIRM_TRIP";
export const SELECT_VEHICLE = "SELECT_VEHICLE";
export const START_PRE_TRIP = "START_PRE_TRIP";
export const UPDATE_PRE_TRIP_FORM = "UPDATE_PRE_TRIP_FORM";
export const COMPLETE_PRE_TRIP = "COMPLETE_PRE_TRIP";
export const START_POST_TRIP = "START_POST_TRIP";
export const UPDATE_POST_TRIP_FORM = "UPDATE_POST_TRIP_FORM";
export const COMPLETE_POST_TRIP = "COMPLETE_POST_TRIP";
export const SELECT_TRIP_STOP = "SELECT_TRIP_STOP";
export const COMPLETE_STOP = "COMPLETE_STOP";
export const START_BREAK = "START_BREAK";
export const END_BREAK = "END_BREAK";
export const UPDATE_TRIP_STOP_STATUS = "UPDATE_TRIP_STOP_STATUS";

export const GO_OFF_DUTY = "GO_OFF_DUTY";
export const GO_ON_DUTY = "GO_ON_DUTY";
export const SELECT_ROUTE = "SELECT_ROUTE";

// Timesheet actions
export const FETCH_TIMESHEETS_REQUEST = "FETCH_TIMESHEETS_REQUEST";
export const FETCH_TIMESHEETS_SUCCESS = "FETCH_TIMESHEETS_SUCCESS";
export const FETCH_TIMESHEETS_FAILURE = "FETCH_TIMESHEETS_FAILURE";

export const SUBMIT_TIMESHEET_REQUEST = "SUBMIT_TIMESHEET_REQUEST";
export const SUBMIT_TIMESHEET_SUCCESS = "SUBMIT_TIMESHEET_SUCCESS";
export const SUBMIT_TIMESHEET_FAILURE = "SUBMIT_TIMESHEET_FAILURE";

export const SUBMIT_FOR_APPROVAL_REQUEST = "SUBMIT_FOR_APPROVAL_REQUEST";
export const SUBMIT_FOR_APPROVAL_SUCCESS = "SUBMIT_FOR_APPROVAL_SUCCESS";
export const SUBMIT_FOR_APPROVAL_FAILURE = "SUBMIT_FOR_APPROVAL_FAILURE";

export const UPDATE_CLOCK_ENTRY = "UPDATE_CLOCK_ENTRY";
export const DELETE_CLOCK_ENTRY = "DELETE_CLOCK_ENTRY";

export const APPROVE_TIMESHEET = "APPROVE_TIMESHEET";
export const REJECT_TIMESHEET = "REJECT_TIMESHEET";

export const SWITCH_USER_ROLE = "SWITCH_USER_ROLE";

// Payroll Action Types
export const CALCULATE_PAYROLL_PERIOD_REQUEST =
  "CALCULATE_PAYROLL_PERIOD_REQUEST";
export const CALCULATE_PAYROLL_PERIOD_SUCCESS =
  "CALCULATE_PAYROLL_PERIOD_SUCCESS";
export const CALCULATE_PAYROLL_PERIOD_FAILURE =
  "CALCULATE_PAYROLL_PERIOD_FAILURE";

export const SUBMIT_PAYROLL_REQUEST = "SUBMIT_PAYROLL_REQUEST";
export const SUBMIT_PAYROLL_SUCCESS = "SUBMIT_PAYROLL_SUCCESS";
export const SUBMIT_PAYROLL_FAILURE = "SUBMIT_PAYROLL_FAILURE";

export const FETCH_PAYROLL_HISTORY_REQUEST = "FETCH_PAYROLL_HISTORY_REQUEST";
export const FETCH_PAYROLL_HISTORY_SUCCESS = "FETCH_PAYROLL_HISTORY_SUCCESS";
export const FETCH_PAYROLL_HISTORY_FAILURE = "FETCH_PAYROLL_HISTORY_FAILURE";

export const FETCH_ALL_PAYROLL_SUBMISSIONS_REQUEST =
  "FETCH_ALL_PAYROLL_SUBMISSIONS_REQUEST";
export const FETCH_ALL_PAYROLL_SUBMISSIONS_SUCCESS =
  "FETCH_ALL_PAYROLL_SUBMISSIONS_SUCCESS";
export const FETCH_ALL_PAYROLL_SUBMISSIONS_FAILURE =
  "FETCH_ALL_PAYROLL_SUBMISSIONS_FAILURE";

export const APPROVE_PAYROLL_SUBMISSION_REQUEST =
  "APPROVE_PAYROLL_SUBMISSION_REQUEST";
export const APPROVE_PAYROLL_SUBMISSION_SUCCESS =
  "APPROVE_PAYROLL_SUBMISSION_SUCCESS";
export const APPROVE_PAYROLL_SUBMISSION_FAILURE =
  "APPROVE_PAYROLL_SUBMISSION_FAILURE";

export const REJECT_PAYROLL_SUBMISSION_REQUEST =
  "REJECT_PAYROLL_SUBMISSION_REQUEST";
export const REJECT_PAYROLL_SUBMISSION_SUCCESS =
  "REJECT_PAYROLL_SUBMISSION_SUCCESS";
export const REJECT_PAYROLL_SUBMISSION_FAILURE =
  "REJECT_PAYROLL_SUBMISSION_FAILURE";

// Pay Periods Action Types
export const FETCH_PAY_PERIODS_REQUEST = "FETCH_PAY_PERIODS_REQUEST";
export const FETCH_PAY_PERIODS_SUCCESS = "FETCH_PAY_PERIODS_SUCCESS";
export const FETCH_PAY_PERIODS_FAILURE = "FETCH_PAY_PERIODS_FAILURE";

// Notification Action Types
export const FETCH_NOTIFICATIONS_REQUEST = "FETCH_NOTIFICATIONS_REQUEST";
export const FETCH_NOTIFICATIONS_SUCCESS = "FETCH_NOTIFICATIONS_SUCCESS";
export const FETCH_NOTIFICATIONS_FAILURE = "FETCH_NOTIFICATIONS_FAILURE";

export const MARK_NOTIFICATION_READ_REQUEST = "MARK_NOTIFICATION_READ_REQUEST";
export const MARK_NOTIFICATION_READ_SUCCESS = "MARK_NOTIFICATION_READ_SUCCESS";
export const MARK_NOTIFICATION_READ_FAILURE = "MARK_NOTIFICATION_READ_FAILURE";

export const MARK_NOTIFICATION_UNREAD_REQUEST = "MARK_NOTIFICATION_UNREAD_REQUEST";
export const MARK_NOTIFICATION_UNREAD_SUCCESS = "MARK_NOTIFICATION_UNREAD_SUCCESS";
export const MARK_NOTIFICATION_UNREAD_FAILURE = "MARK_NOTIFICATION_UNREAD_FAILURE";

export const DELETE_NOTIFICATION_REQUEST = "DELETE_NOTIFICATION_REQUEST";
export const DELETE_NOTIFICATION_SUCCESS = "DELETE_NOTIFICATION_SUCCESS";
export const DELETE_NOTIFICATION_FAILURE = "DELETE_NOTIFICATION_FAILURE";

export const MARK_ALL_NOTIFICATIONS_READ_REQUEST = "MARK_ALL_NOTIFICATIONS_READ_REQUEST";
export const MARK_ALL_NOTIFICATIONS_READ_SUCCESS = "MARK_ALL_NOTIFICATIONS_READ_SUCCESS";
export const MARK_ALL_NOTIFICATIONS_READ_FAILURE = "MARK_ALL_NOTIFICATIONS_READ_FAILURE";
