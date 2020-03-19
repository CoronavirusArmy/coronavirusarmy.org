import { combineReducers } from "redux";

import { authentication } from "./Authentication";

// import createReducer from "../helpers/reducers";
// import createReducerObject from "../helpers/reducers-object";

const rootReducer = combineReducers({
    authentication,
});

export default rootReducer;
