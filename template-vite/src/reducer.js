import { combineReducers } from "@reduxjs/toolkit";
import { reducers as exampleReducers } from "./domain/example/ducks";

export default combineReducers({
    ...exampleReducers,
});
