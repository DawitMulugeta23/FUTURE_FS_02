// src/services/leadService.js
import api from "./api";

const leadService = {
  async getLeads(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    const url = queryParams ? `/leads?${queryParams}` : "/leads";
    const response = await api.get(url);
    return response.data;
  },

  async getLeadById(id) {
    const response = await api.get(`/leads/${id}`);
    return response.data;
  },

  async createLead(leadData) {
    const response = await api.post("/leads", leadData);
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

  async sendEmail(id, emailData) {
    const response = await api.post(`/leads/${id}/email`, emailData);
    return response.data;
  },

  async getEmailHistory(id) {
    const response = await api.get(`/leads/${id}/emails`);
    return response.data;
  },

  async addLeadReply(id, replyMessage) {
    const response = await api.post(`/leads/${id}/reply`, { replyMessage });
    return response.data;
  },

  async getReplies(id) {
    const response = await api.get(`/leads/${id}/replies`);
    return response.data;
  },

  async getAnalytics() {
    const response = await api.get("/leads/analytics");
    return response.data;
  },
};

export default leadService;
