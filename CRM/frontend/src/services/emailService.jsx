import api from "./api";

const emailService = {
  async sendToLead(leadId, subject, message) {
    const response = await api.post("/email/send-to-lead", {
      leadId,
      subject,
      message,
    });
    return response.data;
  },

  async sendBulk(leadIds, subject, message) {
    const response = await api.post("/email/send-bulk", {
      leadIds,
      subject,
      message,
    });
    return response.data;
  },
};

export default emailService;
