export const initialState = {
  historyStatus: {
    id: 0,
    hasPrev: false,
    hasNext: false,
  },
}

// reducer.js (or inside your context file)
export const historyReducer = (state, action) => {
  switch (action.type) {
    case 'SET_HISTORY_STATUS':
      return {
        ...state,
        historyStatus: {
          ...state.historyStatus,
          id: action.payload.id,
          hasPrev: action.payload.hasPrev,
          hasNext: action.payload.hasNext,
        },
      }
  }
}