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
  REJECT_PAYROLL_SUBMISSION_FAILURE
} from "../types";

const initialState = {
  payrollPeriods: [],
  payrollHistory: [],
  payrollSubmissions: [],
  isLoading: false,
  isSubmitting: false,
  error: null,
  lastCalculated: null,
  exportData: null
};

const payrollReducer = (state = initialState, action) => {
  switch (action.type) {
    case CALCULATE_PAYROLL_PERIOD_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null
      };

    case CALCULATE_PAYROLL_PERIOD_SUCCESS:
      return {
        ...state,
        isLoading: false,
        payrollPeriods: action.payload,
        lastCalculated: new Date().toISOString(),
        error: null
      };

    case CALCULATE_PAYROLL_PERIOD_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };

    case SUBMIT_PAYROLL_REQUEST:
      return {
        ...state,
        isSubmitting: true,
        error: null
      };

    case SUBMIT_PAYROLL_SUCCESS:
      return {
        ...state,
        isSubmitting: false,
        payrollHistory: [action.payload, ...state.payrollHistory],
        // Mark the corresponding period as submitted
        payrollPeriods: state.payrollPeriods.map((period) => {
          if (
            period.startDate === action.payload.periodStart &&
            period.endDate === action.payload.periodEnd
          ) {
            return { ...period, isSubmitted: true };
          }
          return period;
        }),
        error: null
      };

    case SUBMIT_PAYROLL_FAILURE:
      return {
        ...state,
        isSubmitting: false,
        error: action.payload
      };

    case FETCH_PAYROLL_HISTORY_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null
      };

    case FETCH_PAYROLL_HISTORY_SUCCESS:
      return {
        ...state,
        isLoading: false,
        payrollHistory: action.payload,
        error: null
      };

    case FETCH_PAYROLL_HISTORY_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };

    case FETCH_ALL_PAYROLL_SUBMISSIONS_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null
      };

    case FETCH_ALL_PAYROLL_SUBMISSIONS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        payrollSubmissions: action.payload,
        error: null
      };

    case FETCH_ALL_PAYROLL_SUBMISSIONS_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };

    case APPROVE_PAYROLL_SUBMISSION_REQUEST:
    case REJECT_PAYROLL_SUBMISSION_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null
      };

    case APPROVE_PAYROLL_SUBMISSION_SUCCESS:
      return {
        ...state,
        isLoading: false,
        payrollSubmissions: state.payrollSubmissions.map((submission) =>
          submission.id === action.payload.id
            ? {
                ...submission,
                status: "approved",
                approvedAt: action.payload.approvedAt
              }
            : submission
        ),
        error: null
      };

    case REJECT_PAYROLL_SUBMISSION_SUCCESS:
      return {
        ...state,
        isLoading: false,
        payrollSubmissions: state.payrollSubmissions.map((submission) =>
          submission.id === action.payload.id
            ? {
                ...submission,
                status: "rejected",
                rejectedAt: action.payload.rejectedAt,
                rejectionReason: action.payload.rejectionReason
              }
            : submission
        ),
        error: null
      };

    case APPROVE_PAYROLL_SUBMISSION_FAILURE:
    case REJECT_PAYROLL_SUBMISSION_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };

    default:
      return state;
  }
};

export default payrollReducer;
