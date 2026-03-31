// src/pages/Help.jsx
import { motion } from "framer-motion";
import { FiHelpCircle, FiSettings, FiUser } from "react-icons/fi";
import Navbar from "../components/Layout/Navbar";
import Sidebar from "../components/Layout/Sidebar";

const Help = () => {
  const faqs = [
    {
      question: "How do I add a new lead?",
      answer:
        "Click on the 'Add New Lead' button on the Leads page or Dashboard. Fill in the lead's information and click 'Create Lead'.",
    },
    {
      question: "How do I change my profile picture?",
      answer:
        "Click on your profile picture in the navbar, then click on it again in the dropdown to upload a new photo or use Gravatar.",
    },
    {
      question: "How do I send emails to leads?",
      answer:
        "You can send emails to leads by clicking the 'Email All Leads' button on the Leads page, or by clicking the 'Send Email' button on individual lead cards.",
    },
    {
      question: "How do I update lead status?",
      answer:
        "Click on a lead card to open the details view, then select the new status from the dropdown menu. You can also drag and drop leads in the Kanban view.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
                <FiHelpCircle className="mr-3 h-8 w-8 text-primary-600" />
                Help & Support
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Learn how to use the CRM system effectively
              </p>
            </motion.div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl p-6 text-white"
              >
                <FiUser className="h-8 w-8 mb-3" />
                <h3 className="font-semibold text-lg">Profile Settings</h3>
                <p className="text-sm text-white/80">
                  Manage your account and photo
                </p>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white"
              >
                <FiSettings className="h-8 w-8 mb-3" />
                <h3 className="font-semibold text-lg">Customize</h3>
                <p className="text-sm text-white/80">
                  Adjust settings to your needs
                </p>
              </motion.div>
            </div>

            {/* FAQs */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="border-b dark:border-gray-700 last:border-0 pb-4 last:pb-0"
                  >
                    <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                      {faq.question}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Contact Support */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Need More Help?
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                If you couldn't find the answer to your question, please contact
                our support team.
              </p>
              <a
                href="mailto:support@crmsystem.com"
                className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Contact Support
              </a>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Help;
