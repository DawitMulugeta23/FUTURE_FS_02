// src/store/slices/leadSlice.js - Update the extraReducers

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
    async (leadData, { rejectWithValue, dispatch }) => {
        try {
            const response = await leadService.createLead(leadData);
            // After creating lead, refresh analytics
            dispatch(fetchAnalytics());
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || error.message || 'Failed to create lead';
            toast.error(message);
            return rejectWithValue(message);
        }
    }
);

export const updateLead = createAsyncThunk(
    'leads/updateLead',
    async ({ id, data }, { rejectWithValue, dispatch }) => {
        try {
            const response = await leadService.updateLead(id, data);
            // After updating lead, refresh analytics
            dispatch(fetchAnalytics());
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || error.message || 'Failed to update lead';
            toast.error(message);
            return rejectWithValue(message);
        }
    }
);

export const deleteLead = createAsyncThunk(
    'leads/deleteLead',
    async (id, { rejectWithValue, dispatch }) => {
        try {
            await leadService.deleteLead(id);
            // After deleting lead, refresh analytics
            dispatch(fetchAnalytics());
            return id;
        } catch (error) {
            const message = error.response?.data?.message || error.message || 'Failed to delete lead';
            toast.error(message);
            return rejectWithValue(message);
        }
    }
);

export const addNote = createAsyncThunk(
    'leads/addNote',
    async ({ id, content }, { rejectWithValue }) => {
        try {
            const response = await leadService.addNote(id, content);
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || error.message || 'Failed to add note';
            toast.error(message);
            return rejectWithValue(message);
        }
    }
);

export const fetchAnalytics = createAsyncThunk(
    'leads/fetchAnalytics',
    async (params = {}, { rejectWithValue }) => {
        try {
            const queryParams = new URLSearchParams();
            if(params.range){
                queryParams.append('range', params.range);
            }
            const url =`/leads/analytics${queryParams.toString()?`?${queryParams.toString()}}`:''}`;

            const response = await leadService.getAnalytics(url);
            console.log('Analytics response:', response);
            return response.data;
        } catch (error) {
            console.error('Error fetching analytics:', error);
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch analytics');
        }
    }
);

const leadSlice = createSlice({
    name: 'leads',
    initialState: {
        leads: [],
        selectedLead: null,
        analytics: {
            total: 0,
            recent: 0,
            conversionRate: '0',
            byStatus: {
                new: 0,
                contacted: 0,
                qualified: 0,
                converted: 0,
                lost: 0
            },
            bySource: []
        },
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
        },
        clearError: (state) => {
            state.error = null;
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
                state.leads = action.payload?.data || [];
                state.pagination = action.payload?.pagination || {
                    page: 1,
                    limit: 10,
                    total: 0,
                    pages: 0
                };
            })
            .addCase(fetchLeads.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.leads = [];
            })
            // Create Lead
            .addCase(createLead.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createLead.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload) {
                    state.leads = [action.payload, ...state.leads];
                    toast.success('Lead created successfully');
                }
            })
            .addCase(createLead.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update Lead
            .addCase(updateLead.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateLead.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload) {
                    const index = state.leads.findIndex(lead => lead._id === action.payload._id);
                    if (index !== -1) {
                        state.leads[index] = action.payload;
                    }
                    if (state.selectedLead?._id === action.payload._id) {
                        state.selectedLead = action.payload;
                    }
                }
            })
            .addCase(updateLead.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Delete Lead
            .addCase(deleteLead.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteLead.fulfilled, (state, action) => {
                state.loading = false;
                state.leads = state.leads.filter(lead => lead._id !== action.payload);
                if (state.selectedLead?._id === action.payload) {
                    state.selectedLead = null;
                }
            })
            .addCase(deleteLead.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Add Note
            .addCase(addNote.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addNote.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload) {
                    const index = state.leads.findIndex(lead => lead._id === action.payload._id);
                    if (index !== -1) {
                        state.leads[index] = action.payload;
                    }
                    if (state.selectedLead?._id === action.payload._id) {
                        state.selectedLead = action.payload;
                    }
                }
            })
            .addCase(addNote.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch Analytics
            .addCase(fetchAnalytics.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAnalytics.fulfilled, (state, action) => {
                state.loading = false;
                console.log('Updating analytics with:', action.payload);
                state.analytics = action.payload || {
                    total: 0,
                    recent: 0,
                    conversionRate: '0',
                    byStatus: {
                        new: 0,
                        contacted: 0,
                        qualified: 0,
                        converted: 0,
                        lost: 0
                    },
                    bySource: []
                };
            })
            .addCase(fetchAnalytics.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                console.error('Analytics fetch rejected:', action.payload);
            });
    }
});

export const { setSelectedLead, setFilters, clearFilters, setPage, clearError } = leadSlice.actions;
export default leadSlice.reducer;