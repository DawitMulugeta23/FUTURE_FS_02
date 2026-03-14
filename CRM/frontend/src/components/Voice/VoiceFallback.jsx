// src/components/Voice/VoiceFallback.jsx
import { FiVolumeX } from "react-icons/fi";

const VoiceFallback = () => {
  return (
    <button
      className="p-2 rounded-lg opacity-50 cursor-not-allowed"
      title="Voice mode not available"
      disabled
    >
      <FiVolumeX className="h-5 w-5 text-gray-400" />
    </button>
  );
};

export default VoiceFallback;
