// frontend/src/store/slices/leadSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import leadService from '../../services/leadService';
import toast from 'react-hot-toast';

export const fetchLeads = createAsyncThunk(
    'leads/fetchLeads',
    async (params, { rejectWithValue }) => {
        try {
            const response = await leadService.getLeads(params);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch leads');
        }
    }
);

export const createLead = createAsyncThunk(
    'leads/createLead',
    async (leadData, { rejectWithValue }) => {
        try {
            const response = await leadService.createLead(leadData);
            toast.success('Lead created successfully');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create lead');
        }
    }
);

export const updateLead = createAsyncThunk(
    'leads/updateLead',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await leadService.updateLead(id, data);
            toast.success('Lead updated successfully');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update lead');
        }
    }
);

export const deleteLead = createAsyncThunk(
    'leads/deleteLead',
    async (id, { rejectWithValue }) => {
        try {
            await leadService.deleteLead(id);
            toast.success('Lead deleted successfully');
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete lead');
        }
    }
);

export const addNote = createAsyncThunk(
    'leads/addNote',
    async ({ id, content }, { rejectWithValue }) => {
        try {
            const response = await leadService.addNote(id, content);
            toast.success('Note added successfully');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to add note');
        }
    }
);

export const fetchAnalytics = createAsyncThunk(
    'leads/fetchAnalytics',
    async (_, { rejectWithValue }) => {
        try {
            const response = await leadService.getAnalytics();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch analytics');
        }
    }
);

const leadSlice = createSlice({
    name: 'leads',
    initialState: {
        leads: [],
        selectedLead: null,
        analytics: null,
        pagination: {
            page: 1,
            limit: 10,
            total: 0,
            pages: 0
        },
        loading: false,
        error: null,
        filters: {
            status: 'all',
            search: '',
            sort: 'newest'
        }
    },
    reducers: {
        setSelectedLead: (state, action) => {
            state.selectedLead = action.payload;
        },
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        clearFilters: (state) => {
            state.filters = {
                status: 'all',
                search: '',
                sort: 'newest'
            };
        },
        setPage: (state, action) => {
            state.pagination.page = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Leads
            .addCase(fetchLeads.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchLeads.fulfilled, (state, action) => {
                state.loading = false;
                state.leads = action.payload.data;
                state.pagination = action.payload.pagination;
            })
            .addCase(fetchLeads.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                toast.error(action.payload);
            })
            // Create Lead
            .addCase(createLead.fulfilled, (state, action) => {
                state.leads.unshift(action.payload);
            })
            // Update Lead
            .addCase(updateLead.fulfilled, (state, action) => {
                const index = state.leads.findIndex(lead => lead._id === action.payload._id);
                if (index !== -1) {
                    state.leads[index] = action.payload;
                }
                if (state.selectedLead?._id === action.payload._id) {
                    state.selectedLead = action.payload;
                }
            })
            // Delete Lead
            .addCase(deleteLead.fulfilled, (state, action) => {
                state.leads = state.leads.filter(lead => lead._id !== action.payload);
                if (state.selectedLead?._id === action.payload) {
                    state.selectedLead = null;
                }
            })
            // Add Note
            .addCase(addNote.fulfilled, (state, action) => {
                const index = state.leads.findIndex(lead => lead._id === action.payload._id);
                if (index !== -1) {
                    state.leads[index] = action.payload;
                }
                if (state.selectedLead?._id === action.payload._id) {
                    state.selectedLead = action.payload;
                }
            })
            // Fetch Analytics
            .addCase(fetchAnalytics.fulfilled, (state, action) => {
                state.analytics = action.payload;
            });
    }
});

export const { setSelectedLead, setFilters, clearFilters, setPage } = leadSlice.actions;
export default leadSlice.reducer;