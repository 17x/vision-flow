import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {ActionCode} from "../engine/editor/editor";

export interface MenuActionType {
  id: ActionCode;
  parent: string | null;
  disabled?: boolean;
  shortcut?: string;
}

export type MenuActionRecord = Record<string, MenuActionType>;

export interface MenuActionState {
  actions: MenuActionRecord
}

const menuData: MenuActionType[] = [
  {id: "file", parent: null},
  {id: "newFile", parent: "file", shortcut: "Ctrl+N"},
  {id: "openFile", parent: "file", shortcut: "Ctrl+O"},
  {id: "saveFile", parent: "file", shortcut: "Ctrl+S"},
  {id: "saveAs", parent: "file"},
  {id: "importFile", parent: "file"},
  {id: "exportFile", parent: "file"},
  {id: "print", parent: "file"},
  {id: "closeFile", parent: "file"},

  {id: "exportFile_png", parent: "exportFile"},
  {id: "exportFile_pdf", parent: "exportFile"},
  {id: "exportFile_csv", parent: "exportFile"},

  {id: "edit", parent: null},
  {id: "undo", parent: "edit", shortcut: "Ctrl+Z"},
  {id: "redo", parent: "edit", shortcut: "Ctrl+Y"},
  {id: "cut", parent: "edit", shortcut: "Ctrl+X"},
  {id: "copy", parent: "edit", shortcut: "Ctrl+C"},
  {id: "paste", parent: "edit", shortcut: "Ctrl+V"},
  {id: "delete", parent: "edit", shortcut: "Del"},
  {id: "duplicate", parent: "edit", shortcut: "Ctrl+D"},
  {id: "selectAll", parent: "edit", shortcut: "Ctrl+A"},
  {id: "findReplace", parent: "edit", shortcut: "Ctrl+F"},

  {id: "view", parent: null},
  {id: "zoomIn", parent: "view", shortcut: "Ctrl++"},
  {id: "zoomOut", parent: "view", shortcut: "Ctrl+-"},
  {id: "fitToScreen", parent: "view"},
  {id: "toggleGrid", parent: "view"},
  {id: "toggleGuides", parent: "view"},
  {id: "fullscreenMode", parent: "view", shortcut: "F11"},

  {id: "shape", parent: null},
  {id: "addNode", parent: "shape"},
  {id: "deleteNode", parent: "shape"},
  {id: "moveNode", parent: "shape"},
  {id: "resizeNode", parent: "shape"},
  {id: "rotateNode", parent: "shape"},
  {id: "changeNodeColor", parent: "shape"},
  {id: "changeNodeBorder", parent: "shape"},
  {id: "changeNodeText", parent: "shape"},
  {id: "groupNodes", parent: "shape"},
  {id: "ungroupNodes", parent: "shape"},
  {id: "lockNode", parent: "shape"},
  {id: "unlockNode", parent: "shape"},

  {id: "connection", parent: null},
  {id: "addEdge", parent: "connection"},
  {id: "deleteEdge", parent: "connection"},
  {id: "changeEdgeStyle", parent: "connection"},
  {id: "changeEdgeColor", parent: "connection"},
  {id: "changeEdgeLabel", parent: "connection"},
  {id: "reverseEdge", parent: "connection"},

  {id: "text", parent: null},
  {id: "addText", parent: "text"},
  {id: "editText", parent: "text"},
  {id: "changeFont", parent: "text"},
  {id: "changeFontSize", parent: "text"},
  {id: "changeFontColor", parent: "text"},
  {id: "boldText", parent: "text", shortcut: "Ctrl+B"},
  {id: "italicText", parent: "text", shortcut: "Ctrl+I"},
  {id: "underlineText", parent: "text", shortcut: "Ctrl+U"},
  {id: "alignText", parent: "text"},

  {id: "layer", parent: null},
  {id: "sendToBack", parent: "layer"},
  {id: "bringToFront", parent: "layer"},
  {id: "sendBackward", parent: "layer"},
  {id: "bringForward", parent: "layer"},
  {id: "duplicateLayer", parent: "layer"},
  {id: "deleteLayer", parent: "layer"},
  {id: "toggleLayerVisibility", parent: "layer"},
  /*
    {id: "collaboration", parent: null},
    {id: "addComment", parent: "collaboration"},
    {id: "editComment", parent: "collaboration"},
    {id: "deleteComment", parent: "collaboration"},
    {id: "shareDocument", parent: "collaboration"},
    {id: "liveCollaboration", parent: "collaboration"},
   */
];

const initialState: MenuActionState = {
  actions: Object.fromEntries(menuData.map((item) => [item.id, {...item, disabled: false}]))
};

const menuSlice = createSlice({
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

export const {setDisabled, triggerAction} = menuSlice.actions;
export default menuSlice.reducer;