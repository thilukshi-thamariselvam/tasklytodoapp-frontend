import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAddTaskModalOpen: false,
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
  },
});

export const { openAddTaskModal, closeAddTaskModal } = uiSlice.actions;
export default uiSlice.reducer;