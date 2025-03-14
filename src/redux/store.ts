import {configureStore} from "@reduxjs/toolkit";
import menuReducer from "./menuSlice";
import statusBarReducer from "./statusBarSlice";
import editorActionsReducer from "./editorActionsSlice.ts";

export const store = configureStore({
  reducer: {
    menu: menuReducer,
    statusBar: statusBarReducer,
    editorActions: editorActionsReducer,
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;