import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export interface FileType {
  id: UID
  name: string
  config: unknown
  data: unknown
}


export type FileRecord = Record<string, FileType>;

export interface FileState {
  files: FileRecord
  currentFileId: FileType['id']
}

const MOCK_FILES: FileRecord = {
  "998": {
    id: '998',
    name: 'Untitled 1',
    config: {},
    data: {}
  },
  "999": {
    id: '999',
    name: 'Untitled 2',
    config: {},
    data: {}
  },
  "1000": {
    id: '1000',
    name: 'Untitled 3',
    config: {},
    data: {}
  },
}

const initialState: FileState = {
  files: MOCK_FILES,
  currentFileId: "998"
};

const menuSlice = createSlice({
  name: "files",
  initialState,
  reducers: {
    switchFile: (state, action: PayloadAction<FileType['id']>) => {
      state.currentFileId = action.payload
    },
    closeFile: (state, action: PayloadAction<FileType['id']>) => {
      state.currentFileId = action.payload
      // open next file if exist
      // otherwise open left
      // if last file
      // do
    }
  }
});

export const {switchFile} = menuSlice.actions;
export default menuSlice.reducer;