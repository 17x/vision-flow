import {createSlice, PayloadAction} from "@reduxjs/toolkit"

export interface ToolbarActionType {
  id: string
  icon: string
  disabled?: boolean
  divide?: boolean
}

export type ActionRecord = Record<string, ToolbarActionType>;

export interface ToolbarActionState {
  actions: ActionRecord
}

const toolbarData: ToolbarActionType[] = [
  {id: 'save', icon: 'save', disabled: true, divide: true},
  {id: 'undo', icon: 'undo', disabled: true},
  {id: 'redo', icon: 'redo', disabled: true, divide: true},
  {id: 'delete', icon: 'trash', disabled: false},
  {id: 'add', icon: 'cross', disabled: false, divide: true},
  {id: 'layerUp', icon: 'layers', disabled: false},
  {id: 'layerDown', icon: 'layers', disabled: false},
  {id: 'layerTop', icon: 'layers', disabled: false},
  {id: 'layerBottom', icon: 'layers', disabled: false, divide: true},
  {id: 'group', icon: 'group', disabled: true},
  {id: 'ungroup', icon: 'ungroup', disabled: true, divide: true},
  {id: 'lock', icon: 'lock', disabled: false},
  {id: 'unlock', icon: 'unlock', disabled: true},
]

const initialState: ToolbarActionState = {
  actions: Object.fromEntries(toolbarData.map((item) => [item.id, {...item, disabled: false}]))
}

const toolbarSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    setDisabled: (state, action: PayloadAction<{ id: string; disabled: boolean }>) => {
      if (state.actions[action.payload.id]) {
        state.actions[action.payload.id].disabled = action.payload.disabled
      }
    },
    triggerAction: (state, action: PayloadAction<string>) => {
      // const actionId = action.payload;
      const actionToTrigger = state.actions[action.payload]
      if (actionToTrigger && !actionToTrigger.disabled) {
        // console.log(`Triggered action: ${actionToTrigger.label}`);
        // You can also dispatch specific side effects or additional actions here.
      }
    },
  }
})

export const {setDisabled, triggerAction} = toolbarSlice.actions
export default toolbarSlice.reducer