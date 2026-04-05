// src/components/Settings/SettingsLayout.jsx
const SettingsLayout = ({ children }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
      {children}
    </div>
  );
};

export default SettingsLayout;
