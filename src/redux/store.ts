import {configureStore} from "@reduxjs/toolkit";
import actionReducer from "./editorActionSlice.ts";
import statusBarReducer from "./statusBarSlice";

export const store = configureStore({
  reducer: {
    action: actionReducer,
    statusBar: statusBarReducer,
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;