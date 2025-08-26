import { applyMiddleware, combineReducers, createStore } from "redux";
import { thunk } from "redux-thunk";
import authReducer from "./reducers/authReducer";
import driverReducer from "./reducers/driverReducer";
import payrollReducer from "./reducers/payrollReducer";
import timesheetReducer from "./reducers/timesheetReducer";
import userReducer from "./reducers/userReducer";

const rootReducer = combineReducers({
  auth: authReducer,
  driver: driverReducer,
  user: userReducer,
  timesheet: timesheetReducer,
  payroll: payrollReducer,
});

export const store = createStore(rootReducer, applyMiddleware(thunk));
