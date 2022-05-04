import { combineReducers } from "@reduxjs/toolkit";
import { reducers as example } from "./domain/example";

export default combineReducers({
    ...example.reducers,
});
