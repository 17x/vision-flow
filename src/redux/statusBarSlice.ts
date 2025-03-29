import {createSlice, PayloadAction} from "@reduxjs/toolkit"
import {ZoomLevels} from "../components/statusBar/zoom"

interface MenuState {
  zoom: ZoomLevels;
}

const initialState: MenuState = {
  zoom: 1,
}

const statusBarSlice = createSlice({
  name: "statusBar",
  initialState,
  reducers: {
    setZoom: (state, action: PayloadAction<MenuState['zoom']>) => {
      state.zoom = action.payload
    }
  }
})

export const {setZoom} = statusBarSlice.actions

export default statusBarSlice.reducer