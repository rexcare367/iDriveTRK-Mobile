import {
  COMPLETE_POST_TRIP,
  COMPLETE_PRE_TRIP,
  COMPLETE_STOP,
  CONFIRM_TRIP,
  END_BREAK,
  GO_OFF_DUTY,
  GO_ON_DUTY,
  SELECT_ROUTE,
  SELECT_TRIP,
  SELECT_TRIP_STOP,
  SELECT_VEHICLE,
  START_BREAK,
  START_POST_TRIP,
  START_PRE_TRIP,
  UPDATE_CLOCK_IN_FORM,
  UPDATE_POST_TRIP_FORM,
  UPDATE_PRE_TRIP_FORM,
  UPDATE_TRIP_STOP_STATUS,
} from "../types";

import { api } from "../../utils";

export const clockIn = (formData: any) => {
  return {
    type: UPDATE_CLOCK_IN_FORM,
    payload: formData,
  };
};

export const updateClockInForm = (formData: any) => {
  return {
    type: UPDATE_CLOCK_IN_FORM,
    payload: formData,
  };
};

// export const clockOut = () => {
//   return {
//     type: CLOCK_OUT,
//     payload: {
//       timestamp: new Date().toISOString()
//     }
//   };
// };

export const startBreak = () => {
  return {
    type: START_BREAK,
    payload: {
      timestamp: new Date().toISOString(),
    },
  };
};

export const endBreak = () => {
  return {
    type: END_BREAK,
    payload: {
      timestamp: new Date().toISOString(),
    },
  };
};

export const goOffDuty = () => {
  return {
    type: GO_OFF_DUTY,
    payload: {
      timestamp: new Date().toISOString(),
    },
  };
};

export const goOnDuty = () => {
  return {
    type: GO_ON_DUTY,
    payload: {
      timestamp: new Date().toISOString(),
    },
  };
};

export const selectRoute = (route: any) => {
  return {
    type: SELECT_ROUTE,
    payload: route,
  };
};

export const selectTrip = (trip: any, stops: any) => {
  return {
    type: SELECT_TRIP,
    payload: { ...trip, stops },
  };
};

export const confirmTrip = () => {
  return {
    type: CONFIRM_TRIP,
  };
};

export const selectVehicle = (vehicle: any) => {
  return {
    type: SELECT_VEHICLE,
    payload: vehicle,
  };
};

export const startPreTrip = (truck_id: any) => {
  return {
    type: START_PRE_TRIP,
    payload: {
      timestamp: new Date().toISOString(),
      type: "pre-trip",
      truck_id,
    },
  };
};

export const updatePreTripForm = (formData: any) => {
  return {
    type: UPDATE_PRE_TRIP_FORM,
    payload: formData,
  };
};

export const completePreTrip =
  (formData: any) => async (dispatch: any, getState: any) => {
    const { auth, driver } = getState();
    const userId = auth?.user?.id || "testUser";
    const truck_id = driver?.clockInFormData?.truck_id || "";

    try {
      // Transform the form data to match the new structure
      const transformedData = {
        powerUnit: formData.powerUnit || "",
        odometerReading: formData.odometerReading || "",
        location: formData.location || "",
        type: "pre-trip",
        userId,
        truck_id,
        inspection: formData.inspection || [],
        photos: formData.photos || {
          leftSidePhoto: "",
          rearPhoto: "",
          rightSidePhoto: "",
          frontPhoto: ""
        },
        signature: formData.signature || {
          signatureType: "typing",
          typedSignature: "",
          signatureText: "",
          drawnSignature: "",
          typedSignatureImage: ""
        },
        trailer: formData.trailer || {
          trailerNumber1: "",
          trailerNumber2: ""
        }
      };

      // Call backend API to store pre-trip inspection
      await api.post("api/truck-inspection", transformedData);

      dispatch({
        type: COMPLETE_PRE_TRIP,
        payload: {
          ...transformedData,
          timestamp: new Date().toISOString(),
        },
      });
      return { success: true };
    } catch (error) {
      console.error("Error saving pre-trip inspection:", error);
      return { success: false, error };
    }
  };

export const startPostTrip = (truck_id: any) => {
  return {
    type: START_POST_TRIP,
    payload: {
      timestamp: new Date().toISOString(),
      type: "post-trip",
      truck_id,
    },
  };
};

export const updatePostTripForm = (formData: any) => {
  return {
    type: UPDATE_POST_TRIP_FORM,
    payload: formData,
  };
};

export const completePostTrip =
  (formData: any) => async (dispatch: any, getState: any) => {
    const { auth, driver } = getState();
    const userId = auth?.user?.id || "testUser";
    const truck_id = driver?.clockInFormData?.truck_id || "";

    try {
      // Transform the form data to match the new structure
      const transformedData = {
        powerUnit: formData.powerUnit || "",
        odometerReading: formData.odometerReading || "",
        location: formData.location || "",
        type: "post-trip",
        userId,
        truck_id,
        inspection: formData.inspection || [],
        photos: formData.photos || {
          leftSidePhoto: "",
          rearPhoto: "",
          rightSidePhoto: "",
          frontPhoto: ""
        },
        signature: formData.signature || {
          signatureType: "typing",
          typedSignature: "",
          signatureText: "",
          drawnSignature: "",
          typedSignatureImage: ""
        },
        trailer: formData.trailer || {
          trailerNumber1: "",
          trailerNumber2: ""
        }
      };

      // Call backend API to store post-trip inspection
      await api.post("api/truck-inspection", transformedData);

      dispatch({
        type: COMPLETE_POST_TRIP,
        payload: {
          ...transformedData,
          timestamp: new Date().toISOString(),
        },
      });
      return { success: true };
    } catch (error) {
      console.error("Error saving post-trip inspection:", error);
      return { success: false, error };
    }
  };

export const selectTripStop = (stop: any) => {
  return {
    type: SELECT_TRIP_STOP,
    payload: stop,
  };
};

export const completeStop = (stopId: any, timestamp: any) => {
  return {
    type: COMPLETE_STOP,
    payload: {
      stopId,
      timestamp,
    },
  };
};

export const updateTripStopStatus = (stopId: any, actualTime: any) => ({
  type: UPDATE_TRIP_STOP_STATUS,
  payload: { stopId, actualTime },
});

export const clockOut = () => ({
  type: UPDATE_CLOCK_IN_FORM,
  payload: {},
});
