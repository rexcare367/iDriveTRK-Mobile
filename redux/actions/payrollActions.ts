import {
  CALCULATE_PAYROLL_PERIOD_REQUEST,
  CALCULATE_PAYROLL_PERIOD_SUCCESS,
  CALCULATE_PAYROLL_PERIOD_FAILURE,
  SUBMIT_PAYROLL_REQUEST,
  SUBMIT_PAYROLL_SUCCESS,
  SUBMIT_PAYROLL_FAILURE,
  FETCH_PAYROLL_HISTORY_REQUEST,
  FETCH_PAYROLL_HISTORY_SUCCESS,
  FETCH_PAYROLL_HISTORY_FAILURE,
  FETCH_ALL_PAYROLL_SUBMISSIONS_REQUEST,
  FETCH_ALL_PAYROLL_SUBMISSIONS_SUCCESS,
  FETCH_ALL_PAYROLL_SUBMISSIONS_FAILURE,
  APPROVE_PAYROLL_SUBMISSION_REQUEST,
  APPROVE_PAYROLL_SUBMISSION_SUCCESS,
  APPROVE_PAYROLL_SUBMISSION_FAILURE,
  REJECT_PAYROLL_SUBMISSION_REQUEST,
  REJECT_PAYROLL_SUBMISSION_SUCCESS,
  REJECT_PAYROLL_SUBMISSION_FAILURE,
} from "../types"

// Helper function to calculate bi-weekly periods
const calculateBiWeeklyPeriods = (clockEntries) => {
  if (!clockEntries || clockEntries.length === 0) return []

  // Sort entries by date
  const sortedEntries = [...clockEntries].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))

  // Get the first entry date to establish the bi-weekly cycle
  const firstEntryDate = new Date(sortedEntries[0].timestamp)

  // Find the start of the first bi-weekly period (Sunday)
  const firstPeriodStart = new Date(firstEntryDate)
  firstPeriodStart.setDate(firstEntryDate.getDate() - firstEntryDate.getDay())
  firstPeriodStart.setHours(0, 0, 0, 0)

  const periods = []
  const today = new Date()

  // Generate bi-weekly periods
  let periodStart = new Date(firstPeriodStart)
  let periodIndex = 0

  while (periodStart <= today) {
    const periodEnd = new Date(periodStart)
    periodEnd.setDate(periodStart.getDate() + 13) // 14 days - 1
    periodEnd.setHours(23, 59, 59, 999)

    // Filter entries for this period
    const periodEntries = sortedEntries.filter((entry) => {
      const entryDate = new Date(entry.timestamp)
      return entryDate >= periodStart && entryDate <= periodEnd
    })

    if (periodEntries.length > 0) {
      // Calculate total hours for the period
      const workSessions = []
      let totalHours = 0

      // Group entries by date
      const entriesByDate = periodEntries.reduce((acc, entry) => {
        const date = new Date(entry.timestamp).toDateString()
        if (!acc[date]) acc[date] = []
        acc[date].push(entry)
        return acc
      }, {})

      // Calculate hours for each day
      Object.keys(entriesByDate).forEach((date) => {
        const dayEntries = entriesByDate[date].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))

        for (let i = 0; i < dayEntries.length; i += 2) {
          if (
            i + 1 < dayEntries.length &&
            dayEntries[i].type === "CLOCK_IN" &&
            dayEntries[i + 1].type === "CLOCK_OUT"
          ) {
            const clockIn = new Date(dayEntries[i].timestamp)
            const clockOut = new Date(dayEntries[i + 1].timestamp)
            const duration = (clockOut - clockIn) / (1000 * 60 * 60)

            totalHours += duration
            workSessions.push({
              date,
              clockIn: dayEntries[i],
              clockOut: dayEntries[i + 1],
              duration,
            })
          }
        }
      })

      const workDays = Object.keys(entriesByDate).length

      periods.push({
        id: `period_${periodIndex}`,
        startDate: periodStart.toISOString(),
        endDate: periodEnd.toISOString(),
        entries: periodEntries,
        totalHours: Math.round(totalHours * 100) / 100,
        workDays,
        workSessions,
        isSubmitted: false,
        isComplete: periodEnd < today,
      })
    }

    // Move to next bi-weekly period
    periodStart = new Date(periodEnd)
    periodStart.setDate(periodEnd.getDate() + 1)
    periodStart.setHours(0, 0, 0, 0)
    periodIndex++
  }

  return periods.reverse() // Most recent first
}

// Action Creators
export const calculatePayrollPeriod = (clockEntries) => {
  return async (dispatch) => {
    dispatch({ type: CALCULATE_PAYROLL_PERIOD_REQUEST })

    try {
      const payrollPeriods = calculateBiWeeklyPeriods(clockEntries)

      dispatch({
        type: CALCULATE_PAYROLL_PERIOD_SUCCESS,
        payload: payrollPeriods,
      })
    } catch (error) {
      dispatch({
        type: CALCULATE_PAYROLL_PERIOD_FAILURE,
        payload: error.message,
      })
    }
  }
}

export const submitPayrollRequest = (payrollData) => {
  return async (dispatch) => {
    dispatch({ type: SUBMIT_PAYROLL_REQUEST })

    try {
      // Simulate API call
      const response = await new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            id: Date.now().toString(),
            ...payrollData,
            submittedAt: new Date().toISOString(),
          })
        }, 1000)
      })

      dispatch({
        type: SUBMIT_PAYROLL_SUCCESS,
        payload: response,
      })

      return response
    } catch (error) {
      dispatch({
        type: SUBMIT_PAYROLL_FAILURE,
        payload: error.message,
      })
      throw error
    }
  }
}

export const fetchPayrollHistory = (userId) => {
  return async (dispatch) => {
    dispatch({ type: FETCH_PAYROLL_HISTORY_REQUEST })

    try {
      // Simple mock history data
      const mockHistory = [
        {
          id: "ph_001",
          userId: userId,
          userName: "Stephen Obarido",
          periodStart: "2024-12-16T00:00:00.000Z",
          periodEnd: "2024-12-29T23:59:59.999Z",
          regularHours: 72,
          overtimeHours: 0,
          grossPay: 1800,
          status: "processed",
          submittedAt: "2024-12-30T16:20:00.000Z",
          notes: "Holiday period - reduced hours",
        },
        {
          id: "ph_002",
          userId: userId,
          userName: "Stephen Obarido",
          periodStart: "2024-12-02T00:00:00.000Z",
          periodEnd: "2024-12-15T23:59:59.999Z",
          regularHours: 80,
          overtimeHours: 8,
          grossPay: 2300,
          status: "approved",
          submittedAt: "2024-12-16T09:15:00.000Z",
          notes: "Project deadline overtime",
        },
      ]

      const response = await new Promise((resolve) => {
        setTimeout(() => resolve(mockHistory), 500)
      })

      dispatch({
        type: FETCH_PAYROLL_HISTORY_SUCCESS,
        payload: response,
      })
    } catch (error) {
      dispatch({
        type: FETCH_PAYROLL_HISTORY_FAILURE,
        payload: error.message,
      })
    }
  }
}

export const fetchAllPayrollSubmissions = () => {
  return async (dispatch) => {
    dispatch({ type: FETCH_ALL_PAYROLL_SUBMISSIONS_REQUEST })

    try {
      // Simple mock submissions for admin view
      const mockSubmissions = [
        {
          id: "ps_001",
          userId: "1",
          userName: "Stephen Obarido",
          department: "Engineering",
          hourlyRate: 25.0,
          periodStart: "2024-12-16T00:00:00.000Z",
          periodEnd: "2024-12-29T23:59:59.999Z",
          regularHours: 72,
          overtimeHours: 0,
          grossPay: 1800,
          status: "pending",
          submittedAt: "2024-12-30T16:20:00.000Z",
          notes: "Holiday period",
        },
        {
          id: "ps_002",
          userId: "2",
          userName: "Jane Smith",
          department: "Marketing",
          hourlyRate: 28.0,
          periodStart: "2024-12-16T00:00:00.000Z",
          periodEnd: "2024-12-29T23:59:59.999Z",
          regularHours: 75,
          overtimeHours: 2,
          grossPay: 2184,
          status: "approved",
          submittedAt: "2024-12-30T11:30:00.000Z",
          notes: "Campaign launch",
        },
        {
          id: "ps_003",
          userId: "3",
          userName: "Mike Johnson",
          department: "Operations",
          hourlyRate: 22.0,
          periodStart: "2024-12-16T00:00:00.000Z",
          periodEnd: "2024-12-29T23:59:59.999Z",
          regularHours: 78,
          overtimeHours: 0,
          grossPay: 1716,
          status: "pending",
          submittedAt: "2024-12-30T14:45:00.000Z",
          notes: "Standard hours",
        },
      ]

      const response = await new Promise((resolve) => {
        setTimeout(() => resolve(mockSubmissions), 800)
      })

      dispatch({
        type: FETCH_ALL_PAYROLL_SUBMISSIONS_SUCCESS,
        payload: response,
      })
    } catch (error) {
      dispatch({
        type: FETCH_ALL_PAYROLL_SUBMISSIONS_FAILURE,
        payload: error.message,
      })
    }
  }
}

export const approvePayrollSubmission = (submissionId) => {
  return async (dispatch) => {
    dispatch({ type: APPROVE_PAYROLL_SUBMISSION_REQUEST })

    try {
      const response = await new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            id: submissionId,
            status: "approved",
            approvedAt: new Date().toISOString(),
            approvedBy: "manager_1",
          })
        }, 500)
      })

      dispatch({
        type: APPROVE_PAYROLL_SUBMISSION_SUCCESS,
        payload: response,
      })

      return response
    } catch (error) {
      dispatch({
        type: APPROVE_PAYROLL_SUBMISSION_FAILURE,
        payload: error.message,
      })
      throw error
    }
  }
}

export const rejectPayrollSubmission = (submissionId, reason = "") => {
  return async (dispatch) => {
    dispatch({ type: REJECT_PAYROLL_SUBMISSION_REQUEST })

    try {
      const response = await new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            id: submissionId,
            status: "rejected",
            rejectedAt: new Date().toISOString(),
            rejectedBy: "manager_1",
            rejectionReason: reason,
          })
        }, 500)
      })

      dispatch({
        type: REJECT_PAYROLL_SUBMISSION_SUCCESS,
        payload: response,
      })

      return response
    } catch (error) {
      dispatch({
        type: REJECT_PAYROLL_SUBMISSION_FAILURE,
        payload: error.message,
      })
      throw error
    }
  }
}
