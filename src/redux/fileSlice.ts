import {createSlice, PayloadAction} from "@reduxjs/toolkit";
// import uid from "../utilities/Uid.ts";

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
  creating: boolean
}

const MOCK_FILES: FileRecord = {
  "fbbeddd8-0996-4ebb-8c1e-9d1ea5312ebb": {
    "id": "fbbeddd8-0996-4ebb-8c1e-9d1ea5312ebb",
    "name": "Untitled 1",
    "config": {},
    "data": {}
  }
}

const initialState: FileState = {
  files: MOCK_FILES,
  currentFileId: "998",
  creating: false
};

const menuSlice = createSlice({
  name: "files",
  initialState,
  reducers: {
    switchFile: (state, action: PayloadAction<FileType['id']>) => {
      state.currentFileId = action.payload
    },
    closeFile: (state, action: PayloadAction<FileType['id']>) => {
      delete state.files[action.payload]
      console.log(state.files)
      // open next file if exist
      // otherwise open left
      // if last file
      // do
    },
    createFile: (state, action: PayloadAction<FileType>) => {
      state.files[action.payload.id] = action.payload
      state.currentFileId = action.payload.id
    },
    setCreating: (state, action: PayloadAction<boolean>) => {
      state.creating = action.payload
    }
  }
});

export const {switchFile, closeFile, createFile, setCreating} = menuSlice.actions;
// export default menuSlice.reducer;