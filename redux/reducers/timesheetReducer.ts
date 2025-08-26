import {
  FETCH_TIMESHEETS_REQUEST,
  FETCH_TIMESHEETS_SUCCESS,
  FETCH_TIMESHEETS_FAILURE,
  SUBMIT_TIMESHEET_REQUEST,
  SUBMIT_TIMESHEET_SUCCESS,
  SUBMIT_TIMESHEET_FAILURE,
  CLOCK_IN,
  CLOCK_OUT,
  UPDATE_CLOCK_ENTRY,
  DELETE_CLOCK_ENTRY,
  APPROVE_TIMESHEET,
  REJECT_TIMESHEET
} from "../types";

const initialState = {
  timesheets: [],
  clockEntries: [],
  loading: false,
  error: null,
  currentTimesheet: null,
  totalHours: 0,
  overtimeHours: 0
};

const calculateHours = (entries) => {
  let totalMinutes = 0;
  let overtimeMinutes = 0;
  const standardHoursPerDay = 8 * 60; // 8 hours in minutes

  // Group entries by date
  const entriesByDate = entries.reduce((acc, entry) => {
    const date = new Date(entry.timestamp).toDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(entry);
    return acc;
  }, {});

  // Calculate hours for each day
  Object.values(entriesByDate).forEach((dayEntries) => {
    // Sort entries by timestamp
    dayEntries.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    let dayMinutes = 0;
    for (let i = 0; i < dayEntries.length; i += 2) {
      if (
        i + 1 < dayEntries.length &&
        dayEntries[i].type === "CLOCK_IN" &&
        dayEntries[i + 1].type === "CLOCK_OUT"
      ) {
        const clockIn = new Date(dayEntries[i].timestamp);
        const clockOut = new Date(dayEntries[i + 1].timestamp);
        const diffMinutes = (clockOut - clockIn) / (1000 * 60);
        dayMinutes += diffMinutes;
      }
    }

    totalMinutes += dayMinutes;

    // Calculate overtime for this day
    if (dayMinutes > standardHoursPerDay) {
      overtimeMinutes += dayMinutes - standardHoursPerDay;
    }
  });

  return {
    totalHours: Math.round((totalMinutes / 60) * 100) / 100,
    overtimeHours: Math.round((overtimeMinutes / 60) * 100) / 100
  };
};

const timesheetReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_TIMESHEETS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case FETCH_TIMESHEETS_SUCCESS:
      // Handle both old format (array) and new format (object with clockEntries)
      if (Array.isArray(action.payload)) {
        return {
          ...state,
          loading: false,
          timesheets: action.payload
        };
      } else {
        // New format with clockEntries
        const hours = calculateHours(action.payload.clockEntries || []);
        return {
          ...state,
          loading: false,
          timesheets: action.payload.timesheets || [],
          clockEntries: action.payload.clockEntries || [],
          totalHours: action.payload.totalHours || hours.totalHours,
          overtimeHours: action.payload.overtimeHours || hours.overtimeHours
        };
      }
    case FETCH_TIMESHEETS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case SUBMIT_TIMESHEET_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case SUBMIT_TIMESHEET_SUCCESS:
      return {
        ...state,
        loading: false,
        timesheets: [...state.timesheets, action.payload]
      };
    case SUBMIT_TIMESHEET_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case CLOCK_IN:
      const newClockInEntries = [
        ...state.clockEntries,
        {
          id: Date.now().toString(),
          type: "CLOCK_IN",
          timestamp: action.payload.timestamp,
          userId: action.payload.userId,
          userName: action.payload.userName
        }
      ];

      const clockInHours = calculateHours(newClockInEntries);

      return {
        ...state,
        clockEntries: newClockInEntries,
        totalHours: clockInHours.totalHours,
        overtimeHours: clockInHours.overtimeHours
      };
    case CLOCK_OUT:
      const newClockOutEntries = [
        ...state.clockEntries,
        {
          id: Date.now().toString(),
          type: "CLOCK_OUT",
          timestamp: action.payload.timestamp,
          userId: action.payload.userId,
          userName: action.payload.userName,
          duration: action.payload.duration
        }
      ];

      const clockOutHours = calculateHours(newClockOutEntries);

      return {
        ...state,
        clockEntries: newClockOutEntries,
        totalHours: clockOutHours.totalHours,
        overtimeHours: clockOutHours.overtimeHours
      };
    case UPDATE_CLOCK_ENTRY:
      const updatedEntries = state.clockEntries.map((entry) =>
        entry.id === action.payload.id ? action.payload : entry
      );

      const updatedHours = calculateHours(updatedEntries);

      return {
        ...state,
        clockEntries: updatedEntries,
        totalHours: updatedHours.totalHours,
        overtimeHours: updatedHours.overtimeHours
      };
    case DELETE_CLOCK_ENTRY:
      const filteredEntries = state.clockEntries.filter(
        (entry) => entry.id !== action.payload
      );
      const deletedHours = calculateHours(filteredEntries);

      return {
        ...state,
        clockEntries: filteredEntries,
        totalHours: deletedHours.totalHours,
        overtimeHours: deletedHours.overtimeHours
      };
    case APPROVE_TIMESHEET:
      return {
        ...state,
        timesheets: state.timesheets.map((timesheet) =>
          timesheet.id === action.payload.id
            ? {
                ...timesheet,
                status: "APPROVED",
                approvedBy: action.payload.managerId,
                approvedAt: new Date().toISOString()
              }
            : timesheet
        )
      };
    case REJECT_TIMESHEET:
      return {
        ...state,
        timesheets: state.timesheets.map((timesheet) =>
          timesheet.id === action.payload.id
            ? {
                ...timesheet,
                status: "REJECTED",
                rejectedBy: action.payload.managerId,
                rejectedAt: new Date().toISOString(),
                rejectionReason: action.payload.reason
              }
            : timesheet
        )
      };
    default:
      return state;
  }
};

export default timesheetReducer;
