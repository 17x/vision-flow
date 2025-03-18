import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {IconName} from "lucide-react/dynamic";

export interface ToolbarActionType {
  id: string
  icon: IconName
  disabled?: boolean
}

export type ActionRecord = Record<string, ToolbarActionType>;

export interface ToolbarActionState {
  actions: ActionRecord
}

const toolbarData: ToolbarActionType[] = [
  {id: 'save', icon: 'save', disabled: true},
  {id: 'undo', icon: 'undo', disabled: true},
  {id: 'redo', icon: 'redo', disabled: true},
  {id: 'delete', icon: 'trash', disabled: false},
  {id: 'add', icon: 'cross', disabled: false},
  {id: 'layerUp', icon: 'layers', disabled: false},
  {id: 'layerDown', icon: 'layers', disabled: false},
  {id: 'layerTop', icon: 'layers', disabled: false},
  {id: 'layerBottom', icon: 'layers', disabled: false},
  {id: 'group', icon: 'group', disabled: true},
  {id: 'ungroup', icon: 'ungroup', disabled: true},
  // {id: 'moveUp', icon: 'chevron-up', disabled: false},
  // {id: 'moveDown', icon: 'chevron-down', disabled: false},
  {id: 'lock', icon: 'lock', disabled: false},
  {id: 'unlock', icon: 'unlock', disabled: true},
];

const initialState: ToolbarActionState = {
  actions: Object.fromEntries(toolbarData.map((item) => [item.id, {...item, disabled: false}]))
};

const toolbarSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    setDisabled: (state, action: PayloadAction<{ id: string; disabled: boolean }>) => {
      if (state.actions[action.payload.id]) {
        state.actions[action.payload.id].disabled = action.payload.disabled;
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
});

export const {setDisabled, triggerAction} = toolbarSlice.actions;
export default toolbarSlice.reducer;