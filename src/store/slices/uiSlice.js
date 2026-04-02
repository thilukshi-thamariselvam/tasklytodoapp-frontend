import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAddTaskModalOpen: false,
  activeFilterLabelId: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openAddTaskModal: (state) => {
      state.isAddTaskModalOpen = true;
    },
    closeAddTaskModal: (state) => {
      state.isAddTaskModalOpen = false;
    },
    setActiveFilterLabel: (state, action) => {
      state.activeFilterLabelId = action.payload;
    },
    clearActiveFilter: (state) => {
      state.activeFilterLabelId = null;
    },
  },
});

export const { openAddTaskModal, closeAddTaskModal, setActiveFilterLabel, clearActiveFilter } = uiSlice.actions;
export default uiSlice.reducer;