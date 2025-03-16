import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export interface ToolbarActionType {
  id: string
  icon: string
  disabled?: boolean
}

export type ActionRecord = Record<string, ToolbarActionType>;

export interface ToolbarActionState {
  actions: ActionRecord
}

const toolbarData: ToolbarActionType[] = [
  {id: 'undo', icon: 'undo', disabled: true},
  {id: 'redo', icon: 'redo', disabled: true},
  {id: 'delete', icon: 'tar', disabled: false},
  {id: 'add', icon: 'add', disabled: false},
  {id: 'group', icon: 'group_work', disabled: true},
  {id: 'ungroup', icon: 'ungroup', disabled: true},
  {id: 'moveUp', icon: 'arrow_upward', disabled: false},
  {id: 'moveDown', icon: 'arrow_downward', disabled: false},
  {id: 'lock', icon: 'lock', disabled: false},
  {id: 'unlock', icon: 'lock_open', disabled: true},
  {id: 'visibility', icon: 'visibility', disabled: false},
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