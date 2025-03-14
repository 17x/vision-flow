import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface EditorAction {
  id: string;
  label: string;
  shortcut?: string;
  disabled?: boolean;
  tooltip?: string;
}

interface EditorActionsState {
  actions: EditorAction[];
}

const initialState: EditorActionsState = {
  actions: [
    { id: 'newFile', label: 'New File', shortcut: 'Ctrl+N' },
    { id: 'saveFile', label: 'Save File', shortcut: 'Ctrl+S' },
    { id: 'openFile', label: 'Open File', shortcut: 'Ctrl+O' },
    // Add more actions as needed
  ],
};

const editorActionsSlice = createSlice({
  name: 'editorActions',
  initialState,
  reducers: {
    triggerAction: (state, action: PayloadAction<string>) => {
      const actionId = action.payload;
      const actionToTrigger = state.actions.find((a) => a.id === actionId);
      if (actionToTrigger && !actionToTrigger.disabled) {
        console.log(`Triggered action: ${actionToTrigger.label}`);
        // You can also dispatch specific side effects or additional actions here.
      }
    },
  },
});

export const { triggerAction } = editorActionsSlice.actions;
export default editorActionsSlice.reducer;