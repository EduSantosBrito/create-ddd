import { combineReducers } from "@reduxjs/toolkit";
import { reducers as example } from "./domain/example";

export type RootState = {
    example: example.RootState;
};

export default combineReducers({
    ...example.reducers,
});
