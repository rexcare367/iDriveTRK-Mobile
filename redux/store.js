import { createStore, applyMiddleware, combineReducers } from "redux";
import { thunk } from "redux-thunk";
import authReducer from "./reducers/authReducer";
import driverReducer from "./reducers/driverReducer";
import userReducer from "./reducers/userReducer";
import timesheetReducer from "./reducers/timesheetReducer";
import payrollReducer from "./reducers/payrollReducer";

const rootReducer = combineReducers({
  auth: authReducer,
  driver: driverReducer,
  user: userReducer,
  timesheet: timesheetReducer,
  payroll: payrollReducer
});

export const store = createStore(rootReducer, applyMiddleware(thunk));
