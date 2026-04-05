// src/pages/Help.jsx
import { motion } from "framer-motion";
import { FiHelpCircle, FiSettings, FiUser } from "react-icons/fi";
import Navbar from "../components/Layout/Navbar";
import Sidebar from "../components/Layout/Sidebar";

const Help = () => {
  const faqs = [
    {
      question: "How do I change my profile picture?",
      answer:
        "Click on your profile picture in the navbar, then click on it again in the dropdown to upload a new photo or use Gravatar.",
    },
    {
      question: "How do I update my profile information?",
      answer:
        "Go to Settings > Profile to update your name, email, phone number, company details, and other personal information.",
    },
    {
      question: "How do I manage my leads?",
      answer:
        "You can manage leads from the Leads page. You can add new leads, edit existing ones, update their status, add notes, and delete leads as needed.",
    },
    {
      question: "How do I track lead analytics?",
      answer:
        "The Analytics dashboard shows key metrics like total leads, conversion rates, lead distribution by status, and source breakdown. You can also export analytics data as CSV.",
    },
    {
      question: "How do I change the theme?",
      answer:
        "Click on your profile picture in the navbar, then use the theme toggle switch to switch between Light and Dark mode.",
    },
    {
      question: "How do I adjust notification settings?",
      answer:
        "Go to Settings > Notifications to customize which notifications you receive, including email, push, and system notifications.",
    },
  ];

  const quickGuides = [
    {
      icon: FiUser,
      title: "Profile Settings",
      description: "Manage your account and profile photo",
      color: "bg-gradient-to-br from-purple-500 to-purple-600",
    },
    {
      icon: FiSettings,
      title: "Customize",
      description: "Adjust settings to your needs",
      color: "bg-gradient-to-br from-green-500 to-green-600",
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
              {quickGuides.map((guide, index) => {
                const Icon = guide.icon;
                return (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    className={`${guide.color} rounded-xl p-6 text-white cursor-pointer`}
                    onClick={() => {
                      // Navigate to settings with appropriate tab
                      if (guide.title === "Profile Settings") {
                        window.location.href = "/settings?tab=profile";
                      } else if (guide.title === "Customize") {
                        window.location.href = "/settings?tab=appearance";
                      }
                    }}
                  >
                    <Icon className="h-8 w-8 mb-3" />
                    <h3 className="font-semibold text-lg">{guide.title}</h3>
                    <p className="text-sm text-white/80">{guide.description}</p>
                  </motion.div>
                );
              })}
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
              <div className="space-y-6">
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

            {/* Keyboard Shortcuts */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Keyboard Shortcuts
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { keys: ["Ctrl", "K"], description: "Search leads" },
                  { keys: ["Ctrl", "N"], description: "Create new lead" },
                  { keys: ["Ctrl", "D"], description: "Go to dashboard" },
                  { keys: ["Ctrl", "L"], description: "Go to leads" },
                  { keys: ["Ctrl", "A"], description: "Go to analytics" },
                  { keys: ["Ctrl", "S"], description: "Go to settings" },
                  { keys: ["Esc"], description: "Close modal" },
                  { keys: ["?"], description: "Show this help" },
                ].map((shortcut, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                  >
                    <div className="flex items-center space-x-2">
                      {shortcut.keys.map((key, i) => (
                        <span key={i}>
                          <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded text-sm font-mono text-gray-800 dark:text-gray-200">
                            {key}
                          </kbd>
                          {i < shortcut.keys.length - 1 && (
                            <span className="mx-1 text-gray-500">+</span>
                          )}
                        </span>
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {shortcut.description}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Need More Help */}
            <div className="mt-8 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                Still need help?{" "}
                <a
                  href="mailto:support@crm.com"
                  className="text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium"
                >
                  Contact our support team
                </a>
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Help;
