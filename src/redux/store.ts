import {configureStore} from "@reduxjs/toolkit";
import menuReducer from "./menuSlice.ts";
import toolbarReducer from "./toolbarSlice.ts";
import statusBarReducer from "./statusBarSlice";
// import fileReducer from "./fileSlice.ts";

export const store = configureStore({
  reducer: {
    menu: menuReducer,
    toolbar: toolbarReducer,
    // files: fileReducer,
    statusBar: statusBarReducer,
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;