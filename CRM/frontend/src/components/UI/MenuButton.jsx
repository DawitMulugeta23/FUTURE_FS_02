// src/components/UI/MenuButton.jsx
import { FiMenu } from "react-icons/fi";

const MenuButton = ({ onClick, isOpen }) => {
  return (
    <button
      onClick={onClick}
      className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      aria-label="Menu"
    >
      <FiMenu className="h-6 w-6 text-gray-600 dark:text-gray-400" />
    </button>
  );
};

export default MenuButton;
