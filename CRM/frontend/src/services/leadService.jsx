// src/services/leadService.js
import api from './api';

const leadService = {
    async getLeads(params = {}) {
        const queryParams = new URLSearchParams(params).toString();
        const url = queryParams ? `/leads?${queryParams}` : '/leads';
        const response = await api.get(url);
        return response.data;
    },

    async getLeadById(id) {
        const response = await api.get(`/leads/${id}`);
        return response.data;
    },

    async createLead(leadData) {
        const response = await api.post('/leads', leadData);
        return response.data;
    },

    async updateLead(id, leadData) {
        const response = await api.put(`/leads/${id}`, leadData);
        return response.data;
    },

    async deleteLead(id) {
        const response = await api.delete(`/leads/${id}`);
        return response.data;
    },

    async addNote(id, content) {
        const response = await api.post(`/leads/${id}/notes`, { content });
        return response.data;
    },

    async getAnalytics(url='/leads/analytics') {
        const response = await api.get(url);
        return response.data;
    }
};

export default leadService;