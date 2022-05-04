import { configureStore } from "@reduxjs/toolkit";
import reducer from "../ducks";

export const store = configureStore({
  reducer,
});
