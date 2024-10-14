import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Company } from '../../utils/interface'

interface CompanyState {
  companies: Company[];
}

const initialState: CompanyState = {
  companies: [],
};

const companySlice = createSlice({
  name: 'company',
  initialState,
  reducers: {
    setCompanies: (state, action: PayloadAction<Company[]>) => {
      state.companies = action.payload;
    },
    clearCompanies: (state) => {
      state.companies = [];
    },
    updateCompany: (state, action: PayloadAction<Company>) => {
      const index = state.companies.findIndex((c) => c._id === action.payload._id);
      if (index !== -1) {
        state.companies[index] = action.payload;
      }
    },
  },
});

export const { setCompanies, clearCompanies, updateCompany } = companySlice.actions;

export default companySlice.reducer;
