import {createSlice, PayloadAction} from "@reduxjs/toolkit";

interface MenuState {
  openMenu: string | null;
}

const initialState: MenuState = {
  openMenu: null,
};

const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    toggleMenu: (state, action: PayloadAction<string | null>) => {
      state.openMenu = state.openMenu === action.payload ? null : action.payload;
    },
    closeMenu: (state) => {
      state.openMenu = null;
    }
  }
});

export const {toggleMenu, closeMenu} = menuSlice.actions;
export default menuSlice.reducer;