import {
  CLOCK_IN,
  CLOCK_OUT,
  START_BREAK,
  END_BREAK,
  GO_OFF_DUTY,
  GO_ON_DUTY,
  SELECT_ROUTE,
  SELECT_TRIP,
  CONFIRM_TRIP,
  SELECT_VEHICLE,
  START_PRE_TRIP,
  UPDATE_PRE_TRIP_FORM,
  COMPLETE_PRE_TRIP,
  START_POST_TRIP,
  UPDATE_POST_TRIP_FORM,
  COMPLETE_POST_TRIP,
  SELECT_TRIP_STOP,
  COMPLETE_STOP,
  UPDATE_TRIP_STOP_STATUS,
  UPDATE_CLOCK_IN_FORM,
} from "../types";

const initialState = {
  isClockedIn: false,
  clockInTime: null,
  clockOutTime: null,
  clockInFormData: null,
  isOnBreak: false,
  breakStartTime: null,
  breakEndTime: null,
  breakHistory: [],
  isOffDuty: false,
  offDutyStartTime: null,
  offDutyEndTime: null,
  offDutyHistory: [],
  workPeriods: [],
  selectedTrip: null,
  confirmedTrip: false,
  selectedVehicle: null,
  isPreTripStarted: false,
  isPreTripCompleted: false,
  preTripFormData: null,
  isPostTripStarted: false,
  isPostTripCompleted: false,
  postTripFormData: null,
  availableTrips: [
    {
      id: "1",
      name: "Carleton AM",
      tripId: "#1265AYT",
      distance: "45km",
      duration: "8hours",
    },
    {
      id: "2",
      name: "Rulo AM",
      tripId: "#1265AYT",
      distance: "45km",
      duration: "8hours",
    },
    {
      id: "3",
      name: "Deshler AM",
      tripId: "#1265AYT",
      distance: "45km",
      duration: "8hours",
    },
    {
      id: "4",
      name: "Plymouth AM",
      tripId: "#1265AYT",
      distance: "45km",
      duration: "8hours",
    },
  ],
  tripStops: [
    {
      id: "yard",
      name: "LINCOLN YARD",
      address: "1000 N 1st St, Lincoln, NE 68508",
      phone: "(402) 555-0100",
      scheduledTime: "04:00 am",
      actualTime: null,
      status: "next",
      coordinates: { latitude: 40.8136, longitude: -96.7026 },
      tripType: "AM",
    },
    {
      id: "lincoln",
      name: "LINCOLN POST OFFICE",
      address: "700 R St, Lincoln, NE 68501",
      phone: "(402) 555-0101",
      scheduledTime: "04:15 am",
      actualTime: null,
      status: "pending",
      coordinates: { latitude: 40.8136, longitude: -96.6826 },
      tripType: "AM",
    },
    {
      id: "geneva",
      name: "GENEVA POST OFFICE",
      address: "123 Main St, Geneva, NE 68361",
      phone: "(402) 555-0102",
      scheduledTime: "06:05 am",
      actualTime: null,
      status: "pending",
      coordinates: { latitude: 40.5264, longitude: -97.5956 },
      tripType: "AM",
    },
    {
      id: "shickley",
      name: "SHICKLEY POST OFFICE",
      address: "456 Elm St, Shickley, NE 68436",
      phone: "(402) 555-0103",
      scheduledTime: "06:40 am",
      actualTime: null,
      status: "pending",
      coordinates: { latitude: 40.4172, longitude: -97.7231 },
      tripType: "AM",
    },
    {
      id: "davenport",
      name: "DAVENPORT POST OFFICE",
      address: "789 Oak St, Davenport, NE 68335",
      phone: "(402) 555-0104",
      scheduledTime: "07:10 am",
      actualTime: null,
      status: "pending",
      coordinates: { latitude: 40.9856, longitude: -96.8026 },
      tripType: "AM",
    },
    {
      id: "carleton",
      name: "CARLETON POST OFFICE",
      address: "101 Maple St, Carleton, NE 68326",
      phone: "(402) 555-0105",
      scheduledTime: "14:20 pm",
      actualTime: null,
      status: "next",
      coordinates: { latitude: 40.3, longitude: -97.6833 },
      tripType: "PM",
    },
    {
      id: "davenport_pm",
      name: "DAVENPORT POST OFFICE",
      address: "789 Oak St, Davenport, NE 68335",
      phone: "(402) 555-0104",
      scheduledTime: "14:35 pm",
      actualTime: null,
      status: "pending",
      coordinates: { latitude: 40.9856, longitude: -96.8026 },
      tripType: "PM",
    },
    {
      id: "shickley_pm",
      name: "SHICKLEY POST OFFICE",
      address: "456 Elm St, Shickley, NE 68436",
      phone: "(402) 555-0103",
      scheduledTime: "15:00 pm",
      actualTime: null,
      status: "pending",
      coordinates: { latitude: 40.4172, longitude: -97.7231 },
      tripType: "PM",
    },
    {
      id: "geneva_pm",
      name: "GENEVA POST OFFICE",
      address: "123 Main St, Geneva, NE 68361",
      phone: "(402) 555-0102",
      scheduledTime: "15:25 pm",
      actualTime: null,
      status: "pending",
      coordinates: { latitude: 40.5264, longitude: -97.5956 },
      tripType: "PM",
    },
    {
      id: "lincoln_pm",
      name: "LINCOLN POST OFFICE",
      address: "700 R St, Lincoln, NE 68501",
      phone: "(402) 555-0101",
      scheduledTime: "17:00 pm",
      actualTime: null,
      status: "pending",
      coordinates: { latitude: 40.8136, longitude: -96.6826 },
      tripType: "PM",
    },
    {
      id: "yard_pm",
      name: "LINCOLN YARD",
      address: "1000 N 1st St, Lincoln, NE 68508",
      phone: "(402) 555-0100",
      scheduledTime: "17:15 pm",
      actualTime: null,
      status: "pending",
      coordinates: { latitude: 40.8136, longitude: -96.7026 },
      tripType: "PM",
    },
  ],
  completedStops: [],
};

const driverReducer = (state = initialState, action) => {
  switch (action.type) {
    case CLOCK_IN:
      return {
        ...state,
        isClockedIn: true,
        clockInTime: action.payload.timestamp,
        workPeriods: [
          ...state.workPeriods,
          {
            start: action.payload.timestamp,
            end: null,
            breaks: [],
          },
        ],
      };
    case UPDATE_CLOCK_IN_FORM:
      return {
        ...state,
        clockInFormData: action.payload,
      };
    // In the CLOCK_OUT case in driverReducer.js
    case CLOCK_OUT:
      const updatedWorkPeriods = [...state.workPeriods];
      if (updatedWorkPeriods.length > 0) {
        const currentPeriod = updatedWorkPeriods[updatedWorkPeriods.length - 1];
        updatedWorkPeriods[updatedWorkPeriods.length - 1] = {
          ...currentPeriod,
          end: action.payload.timestamp,
        };
      }

      return {
        ...state,
        isClockedIn: false,
        clockOutTime: action.payload.timestamp,
        isOnBreak: false,
        workDuration: action.payload.workDuration,
        breakDuration: action.payload.breakDuration,
        workPeriods: updatedWorkPeriods,
      };
    case START_BREAK:
      const workPeriodsWithBreakStart = [...state.workPeriods];
      if (workPeriodsWithBreakStart.length > 0) {
        const currentPeriod =
          workPeriodsWithBreakStart[workPeriodsWithBreakStart.length - 1];
        const updatedBreaks = [
          ...currentPeriod.breaks,
          { start: action.payload.timestamp, end: null },
        ];
        workPeriodsWithBreakStart[workPeriodsWithBreakStart.length - 1] = {
          ...currentPeriod,
          breaks: updatedBreaks,
        };
      }

      return {
        ...state,
        isOnBreak: true,
        breakStartTime: action.payload.timestamp,
        breakHistory: [
          ...state.breakHistory,
          { start: action.payload.timestamp, end: null },
        ],
        workPeriods: workPeriodsWithBreakStart,
      };
    case END_BREAK:
      const workPeriodsWithBreakEnd = [...state.workPeriods];
      if (workPeriodsWithBreakEnd.length > 0) {
        const currentPeriod =
          workPeriodsWithBreakEnd[workPeriodsWithBreakEnd.length - 1];
        const updatedBreaks = [...currentPeriod.breaks];
        if (updatedBreaks.length > 0) {
          const lastBreakIndex = updatedBreaks.length - 1;
          updatedBreaks[lastBreakIndex] = {
            ...updatedBreaks[lastBreakIndex],
            end: action.payload.timestamp,
          };
        }
        workPeriodsWithBreakEnd[workPeriodsWithBreakEnd.length - 1] = {
          ...currentPeriod,
          breaks: updatedBreaks,
        };
      }
      const updatedBreakHistory = [...state.breakHistory];
      if (updatedBreakHistory.length > 0) {
        const lastBreakIndex = updatedBreakHistory.length - 1;
        updatedBreakHistory[lastBreakIndex] = {
          ...updatedBreakHistory[lastBreakIndex],
          end: action.payload.timestamp,
        };
      }

      return {
        ...state,
        isOnBreak: false,
        breakEndTime: action.payload.timestamp,
        breakHistory: updatedBreakHistory,
        workPeriods: workPeriodsWithBreakEnd,
      };
    case GO_OFF_DUTY:
      const workPeriodsWithOffDutyStart = [...state.workPeriods];
      if (workPeriodsWithOffDutyStart.length > 0) {
        const currentPeriod =
          workPeriodsWithOffDutyStart[workPeriodsWithOffDutyStart.length - 1];
        const updatedOffDutyPeriods = [
          ...(currentPeriod.offDutyPeriods || []),
          { start: action.payload.timestamp, end: null },
        ];
        workPeriodsWithOffDutyStart[workPeriodsWithOffDutyStart.length - 1] = {
          ...currentPeriod,
          offDutyPeriods: updatedOffDutyPeriods,
        };
      }

      return {
        ...state,
        isOffDuty: true,
        offDutyStartTime: action.payload.timestamp,
        offDutyHistory: [
          ...state.offDutyHistory,
          { start: action.payload.timestamp, end: null },
        ],
        workPeriods: workPeriodsWithOffDutyStart,
      };
    case GO_ON_DUTY:
      const workPeriodsWithOffDutyEnd = [...state.workPeriods];
      if (workPeriodsWithOffDutyEnd.length > 0) {
        const currentPeriod =
          workPeriodsWithOffDutyEnd[workPeriodsWithOffDutyEnd.length - 1];
        const updatedOffDutyPeriods = [...(currentPeriod.offDutyPeriods || [])];
        if (updatedOffDutyPeriods.length > 0) {
          const lastOffDutyIndex = updatedOffDutyPeriods.length - 1;
          updatedOffDutyPeriods[lastOffDutyIndex] = {
            ...updatedOffDutyPeriods[lastOffDutyIndex],
            end: action.payload.timestamp,
          };
        }
        workPeriodsWithOffDutyEnd[workPeriodsWithOffDutyEnd.length - 1] = {
          ...currentPeriod,
          offDutyPeriods: updatedOffDutyPeriods,
        };
      }

      const updatedOffDutyHistory = [...state.offDutyHistory];
      if (updatedOffDutyHistory.length > 0) {
        const lastOffDutyIndex = updatedOffDutyHistory.length - 1;
        updatedOffDutyHistory[lastOffDutyIndex] = {
          ...updatedOffDutyHistory[lastOffDutyIndex],
          end: action.payload.timestamp,
        };
      }

      return {
        ...state,
        isOffDuty: false,
        offDutyEndTime: action.payload.timestamp,
        offDutyHistory: updatedOffDutyHistory,
        workPeriods: workPeriodsWithOffDutyEnd,
      };
    case SELECT_ROUTE:
      return {
        ...state,
        selectedRoute: action.payload,
      };
    case SELECT_TRIP:
      return {
        ...state,
        selectedTrip: action.payload,
        tripStops: action.payload.stops
          ? action.payload.stops
          : state.tripStops,
      };
    case CONFIRM_TRIP:
      return {
        ...state,
        confirmedTrip: true,
      };
    case SELECT_VEHICLE:
      return {
        ...state,
        selectedVehicle: action.payload,
      };
    case START_PRE_TRIP:
      return {
        ...state,
        isPreTripStarted: true,
      };
    case UPDATE_PRE_TRIP_FORM:
      return {
        ...state,
        preTripFormData: action.payload,
      };
    case COMPLETE_PRE_TRIP:
      return {
        ...state,
        isPreTripCompleted: true,
        preTripFormData: action.payload.formData,
      };
    case START_POST_TRIP:
      return {
        ...state,
        isPostTripStarted: true,
      };
    case UPDATE_POST_TRIP_FORM:
      return {
        ...state,
        postTripFormData: action.payload,
      };
    case COMPLETE_POST_TRIP:
      return {
        ...state,
        isPostTripCompleted: true,
        postTripFormData: action.payload.formData,
      };
    case SELECT_TRIP_STOP:
      return {
        ...state,
        selectedTripStop: action.payload,
      };
    case COMPLETE_STOP:
      return {
        ...state,
        tripStops: state.tripStops.map((stop) =>
          stop.id === action.payload.stopId
            ? {
                ...stop,
                status: "approved",
                actualTime: action.payload.timestamp,
              }
            : stop
        ),
        completedStops: [...state.completedStops, action.payload.stopId],
      };
    case UPDATE_TRIP_STOP_STATUS: {
      const { stopId, actualTime } = action.payload;
      const updatedStops = state.tripStops.map((stop, idx, arr) => {
        if (stop.id === stopId) {
          return { ...stop, actualTime, status: "completed" };
        }
        if (
          arr[idx - 1] &&
          arr[idx - 1].id === stopId &&
          stop.status === "pending"
        ) {
          return { ...stop, status: "next" };
        }
        return stop;
      });
      return { ...state, tripStops: updatedStops };
    }
    default:
      return state;
  }
};

export default driverReducer;
