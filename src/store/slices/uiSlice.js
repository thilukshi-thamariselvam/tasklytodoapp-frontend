import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAddTaskModalOpen: false,
  activeFilterLabelId: null,
  activeFilterPriority: null,
  searchContext: null,
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
    setActiveFilterPriority: (state, action) => {
      state.activeFilterPriority = action.payload;
    },
    clearActiveFilterPriority: (state) => {
      state.activeFilterPriority = null;
    },
    setSearchContext: (state, action) => {
      state.searchContext = action.payload;
    },
    clearSearchContext: (state) => {
      state.searchContext = null;
    },
  },
});

export const { 
  openAddTaskModal, 
  closeAddTaskModal, 
  setActiveFilterLabel, 
  clearActiveFilter, 
  setActiveFilterPriority, 
  clearActiveFilterPriority,
  setSearchContext, 
  clearSearchContext 
} = uiSlice.actions;

export default uiSlice.reducer;