import { combineReducers } from "@reduxjs/toolkit";
import { reducers as exampleReducers, RootState as ExampleRootState } from "./domain/example/ducks";

export type RootState = ExampleRootState;

export default combineReducers({
    ...exampleReducers,
});
