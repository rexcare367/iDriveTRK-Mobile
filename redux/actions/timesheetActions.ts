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

// Enhanced mock data with proper clock entries
const mockFetchDailyTimesheets = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Generate clock entries for the last 7 days
      const clockEntries = [];
      const today = new Date();

      // Generate entries for the last 7 days
      for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);

        // Skip weekends for some variety
        if (date.getDay() === 0 || date.getDay() === 6) continue;

        // Morning clock in (8:00 AM - 9:00 AM)
        const clockInTime = new Date(date);
        clockInTime.setHours(
          8 + Math.floor(Math.random() * 2),
          Math.floor(Math.random() * 60),
          0,
          0
        );

        clockEntries.push({
          id: `clock-in-${i}-1`,
          type: "CLOCK_IN",
          timestamp: clockInTime.toISOString(),
          userId: "1",
          userName: "Stephen Obarido"
        });

        // Lunch break clock out (12:00 PM - 1:00 PM)
        const lunchOutTime = new Date(date);
        lunchOutTime.setHours(12, Math.floor(Math.random() * 30), 0, 0);

        clockEntries.push({
          id: `clock-out-${i}-1`,
          type: "CLOCK_OUT",
          timestamp: lunchOutTime.toISOString(),
          userId: "1",
          userName: "Stephen Obarido"
        });

        // Lunch break clock in (1:00 PM - 1:30 PM)
        const lunchInTime = new Date(date);
        lunchInTime.setHours(13, Math.floor(Math.random() * 30), 0, 0);

        clockEntries.push({
          id: `clock-in-${i}-2`,
          type: "CLOCK_IN",
          timestamp: lunchInTime.toISOString(),
          userId: "1",
          userName: "Stephen Obarido"
        });

        // End of day clock out (5:00 PM - 7:00 PM)
        const clockOutTime = new Date(date);
        clockOutTime.setHours(
          17 + Math.floor(Math.random() * 3),
          Math.floor(Math.random() * 60),
          0,
          0
        );

        clockEntries.push({
          id: `clock-out-${i}-2`,
          type: "CLOCK_OUT",
          timestamp: clockOutTime.toISOString(),
          userId: "1",
          userName: "Stephen Obarido"
        });
      }

      // Add today's incomplete entry (only clock in)
      const todayClockIn = new Date();
      todayClockIn.setHours(8, 30, 0, 0);

      clockEntries.push({
        id: `clock-in-today`,
        type: "CLOCK_IN",
        timestamp: todayClockIn.toISOString(),
        userId: "1",
        userName: "Stephen Obarido"
      });

      // Calculate total hours from clock entries
      let totalHours = 0;
      let overtimeHours = 0;

      // Group by date and calculate hours
      const entriesByDate = clockEntries.reduce((acc, entry) => {
        const date = new Date(entry.timestamp).toDateString();
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(entry);
        return acc;
      }, {});

      Object.values(entriesByDate).forEach((dayEntries) => {
        dayEntries.sort(
          (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
        );

        let dayHours = 0;
        for (let i = 0; i < dayEntries.length; i += 2) {
          if (
            i + 1 < dayEntries.length &&
            dayEntries[i].type === "CLOCK_IN" &&
            dayEntries[i + 1].type === "CLOCK_OUT"
          ) {
            const clockIn = new Date(dayEntries[i].timestamp);
            const clockOut = new Date(dayEntries[i + 1].timestamp);
            const hours = (clockOut - clockIn) / (1000 * 60 * 60);
            dayHours += hours;
          }
        }

        totalHours += dayHours;
        if (dayHours > 8) {
          overtimeHours += dayHours - 8;
        }
      });

      resolve({
        timesheets: [
          {
            id: "weekly-1",
            userId: "1",
            period: "WEEKLY",
            startDate: "2025-01-20",
            endDate: "2025-01-26",
            status: "PENDING",
            totalHours: Math.round(totalHours * 100) / 100,
            overtimeHours: Math.round(overtimeHours * 100) / 100,
            entries: [],
            submittedAt: new Date().toISOString(),
            note: "Current week timesheet"
          }
        ],
        clockEntries: clockEntries,
        totalHours: Math.round(totalHours * 100) / 100,
        overtimeHours: Math.round(overtimeHours * 100) / 100
      });
    }, 1000);
  });
};

const mockFetchTimesheets = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: "1",
          userId: "1",
          period: "WEEKLY",
          startDate: "2025-01-13",
          endDate: "2025-01-19",
          status: "PENDING",
          totalHours: 42,
          overtimeHours: 2,
          entries: [
            {
              id: "101",
              date: "2025-01-13",
              clockIn: "08:00",
              clockOut: "17:00",
              hours: 8,
              type: "REGULAR"
            },
            {
              id: "102",
              date: "2025-01-14",
              clockIn: "08:00",
              clockOut: "18:00",
              hours: 9,
              type: "OVERTIME"
            },
            {
              id: "103",
              date: "2025-01-15",
              clockIn: "08:00",
              clockOut: "17:00",
              hours: 8,
              type: "REGULAR"
            },
            {
              id: "104",
              date: "2025-01-16",
              clockIn: "08:00",
              clockOut: "17:00",
              hours: 8,
              type: "REGULAR"
            },
            {
              id: "105",
              date: "2025-01-17",
              clockIn: "08:00",
              clockOut: "19:00",
              hours: 9,
              type: "OVERTIME"
            }
          ],
          submittedAt: "2025-01-19T18:30:00Z",
          approvedBy: "2",
          approvedAt: "2025-01-20T10:30:00Z",
          note: "Week with some overtime"
        },
        {
          id: "2",
          userId: "1",
          period: "WEEKLY",
          startDate: "2025-01-06",
          endDate: "2025-01-12",
          status: "APPROVED",
          totalHours: 40,
          overtimeHours: 0,
          entries: [
            {
              id: "106",
              date: "2025-01-06",
              clockIn: "08:00",
              clockOut: "17:00",
              hours: 8,
              type: "REGULAR"
            },
            {
              id: "107",
              date: "2025-01-07",
              clockIn: "08:00",
              clockOut: "17:00",
              hours: 8,
              type: "REGULAR"
            },
            {
              id: "108",
              date: "2025-01-08",
              clockIn: "08:00",
              clockOut: "17:00",
              hours: 8,
              type: "REGULAR"
            },
            {
              id: "109",
              date: "2025-01-09",
              clockIn: "08:00",
              clockOut: "17:00",
              hours: 8,
              type: "REGULAR"
            },
            {
              id: "110",
              date: "2025-01-10",
              clockIn: "08:00",
              clockOut: "17:00",
              hours: 8,
              type: "REGULAR"
            }
          ],
          submittedAt: "2025-01-12T18:00:00Z",
          approvedBy: "2",
          approvedAt: "2025-01-13T10:30:00Z",
          note: "Regular work week"
        }
      ]);
    }, 1000);
  });
};

const mockSubmitTimesheet = (timesheetData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: Date.now().toString(),
        ...timesheetData,
        status: "PENDING",
        submittedAt: new Date().toISOString()
      });
    }, 1000);
  });
};

// Action creators
export const fetchTimesheets = () => {
  return async (dispatch) => {
    dispatch({ type: FETCH_TIMESHEETS_REQUEST });

    try {
      const timesheets = await mockFetchTimesheets();
      dispatch({
        type: FETCH_TIMESHEETS_SUCCESS,
        payload: timesheets
      });
    } catch (error) {
      dispatch({
        type: FETCH_TIMESHEETS_FAILURE,
        payload: error.message
      });
    }
  };
};

export const fetchDailyTimeSheets = () => {
  return async (dispatch) => {
    dispatch({ type: FETCH_TIMESHEETS_REQUEST });

    try {
      const data = await mockFetchDailyTimesheets();
      dispatch({
        type: FETCH_TIMESHEETS_SUCCESS,
        payload: data
      });
    } catch (error) {
      dispatch({
        type: FETCH_TIMESHEETS_FAILURE,
        payload: error.message
      });
    }
  };
};

export const submitTimesheet = (timesheetData) => {
  return async (dispatch) => {
    dispatch({ type: SUBMIT_TIMESHEET_REQUEST });

    try {
      const newTimesheet = await mockSubmitTimesheet(timesheetData);
      dispatch({
        type: SUBMIT_TIMESHEET_SUCCESS,
        payload: newTimesheet
      });
      return newTimesheet;
    } catch (error) {
      dispatch({
        type: SUBMIT_TIMESHEET_FAILURE,
        payload: error.message
      });
      throw error;
    }
  };
};

export const clockIn = (userId, userName) => {
  return {
    type: CLOCK_IN,
    payload: {
      userId,
      userName,
      timestamp: new Date().toISOString()
    }
  };
};

export const clockOut = (userId, userName, duration) => {
  return {
    type: CLOCK_OUT,
    payload: {
      userId,
      userName,
      timestamp: new Date().toISOString(),
      duration
    }
  };
};

export const updateClockEntry = (entry) => {
  return {
    type: UPDATE_CLOCK_ENTRY,
    payload: entry
  };
};

export const deleteClockEntry = (entryId) => {
  return {
    type: DELETE_CLOCK_ENTRY,
    payload: entryId
  };
};

export const approveTimesheet = (timesheetId, managerId) => {
  return {
    type: APPROVE_TIMESHEET,
    payload: {
      id: timesheetId,
      managerId
    }
  };
};

export const rejectTimesheet = (timesheetId, managerId, reason) => {
  return {
    type: REJECT_TIMESHEET,
    payload: {
      id: timesheetId,
      managerId,
      reason
    }
  };
};

// Function to automatically generate timesheet from clock data
export const generateTimesheetFromClockData = (
  clockEntries,
  period,
  startDate,
  endDate,
  userId,
  userName
) => {
  return (dispatch) => {
    // Filter entries within the date range
    const filteredEntries = clockEntries.filter((entry) => {
      const entryDate = new Date(entry.timestamp);
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // Set to end of day

      return entryDate >= start && entryDate <= end;
    });

    // Group entries by date
    const entriesByDate = filteredEntries.reduce((acc, entry) => {
      const date = new Date(entry.timestamp).toDateString();
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(entry);
      return acc;
    }, {});

    // Create timesheet entries
    const timesheetEntries = [];
    let totalHours = 0;
    let overtimeHours = 0;

    Object.entries(entriesByDate).forEach(([dateStr, entries]) => {
      // Sort entries by timestamp
      entries.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

      // Process pairs of clock in/out
      for (let i = 0; i < entries.length; i += 2) {
        if (i + 1 < entries.length) {
          const clockIn = new Date(entries[i].timestamp);
          const clockOut = new Date(entries[i + 1].timestamp);
          const diffHours = (clockOut - clockIn) / (1000 * 60 * 60);
          const roundedHours = Math.round(diffHours * 100) / 100;

          // Determine if overtime (assuming 8 hours is standard)
          const isOvertime = roundedHours > 8;
          const regularHours = isOvertime ? 8 : roundedHours;
          const extraHours = isOvertime ? roundedHours - 8 : 0;

          totalHours += roundedHours;
          overtimeHours += extraHours;

          timesheetEntries.push({
            id: Date.now().toString() + i,
            date: new Date(clockIn).toISOString().split("T")[0],
            clockIn: clockIn.toTimeString().slice(0, 5),
            clockOut: clockOut.toTimeString().slice(0, 5),
            hours: roundedHours,
            type: isOvertime ? "OVERTIME" : "REGULAR"
          });
        }
      }
    });

    // Create timesheet object
    const timesheet = {
      userId,
      userName,
      period,
      startDate,
      endDate,
      totalHours,
      overtimeHours,
      entries: timesheetEntries,
      note: ""
    };

    return timesheet;
  };
};

export const submitForApproval = (approvalData) => {
  return async (dispatch) => {
    dispatch({ type: SUBMIT_FOR_APPROVAL_REQUEST });

    try {
      // Mock API call for approval submission
      const response = await new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            id: Date.now().toString(),
            ...approvalData,
            status: "pending_approval",
            submittedAt: new Date().toISOString()
          });
        }, 1000);
      });

      dispatch({
        type: SUBMIT_FOR_APPROVAL_SUCCESS,
        payload: response
      });

      return response;
    } catch (error) {
      dispatch({
        type: SUBMIT_FOR_APPROVAL_FAILURE,
        payload: error.message
      });
      throw error;
    }
  };
};
