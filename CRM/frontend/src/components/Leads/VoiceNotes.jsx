// src/components/Leads/VoiceNotes.jsx
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
    FiDownload,
    FiLoader,
    FiMic,
    FiPlay,
    FiSquare,
    FiTrash2,
} from "react-icons/fi";

const VoiceNotes = ({ onSave }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordings, setRecordings] = useState([]);
  const [transcript, setTranscript] = useState("");
  const [listening, setListening] = useState(false);
  const [recognition, setRecognition] = useState(null);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  useEffect(() => {
    // Load saved recordings from localStorage
    const saved = localStorage.getItem("voiceNotes");
    if (saved) {
      setRecordings(JSON.parse(saved));
    }

    // Initialize speech recognition
    if (
      typeof window !== "undefined" &&
      ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)
    ) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;

      recognitionInstance.onresult = (event) => {
        const current = event.resultIndex;
        const transcript = event.results[current][0].transcript;
        setTranscript(transcript);
      };

      recognitionInstance.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setListening(false);
        setIsRecording(false);
      };

      recognitionInstance.onend = () => {
        setListening(false);
      };

      setRecognition(recognitionInstance);
    }

    return () => {
      if (recognition) {
        recognition.abort();
      }
    };
  }, []);

  const startRecording = async () => {
    setIsRecording(true);
    setTranscript("");

    // Start speech recognition
    if (recognition) {
      recognition.start();
      setListening(true);
    }

    // Start audio recording
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });
        const audioUrl = URL.createObjectURL(audioBlob);

        // Save recording
        const newRecording = {
          id: Date.now(),
          transcript,
          audioUrl,
          timestamp: new Date().toISOString(),
          duration: audioChunksRef.current.length, // Approximate
        };

        const updatedRecordings = [newRecording, ...recordings];
        setRecordings(updatedRecordings);
        localStorage.setItem("voiceNotes", JSON.stringify(updatedRecordings));

        if (onSave) {
          onSave(newRecording);
        }

        toast.success("Voice note saved!");

        // Stop all tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast.error("Could not access microphone");
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    setIsRecording(false);

    // Stop speech recognition
    if (recognition) {
      recognition.stop();
      setListening(false);
    }

    // Stop media recorder
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.stop();
    }
  };

  const deleteRecording = (id) => {
    const updated = recordings.filter((r) => r.id !== id);
    setRecordings(updated);
    localStorage.setItem("voiceNotes", JSON.stringify(updated));
    toast.success("Recording deleted");
  };

  const playRecording = (audioUrl) => {
    const audio = new Audio(audioUrl);
    audio.play();
  };

  const downloadTranscript = (transcript, id) => {
    const blob = new Blob([transcript], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `voice-note-${id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Recording Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <FiMic className="mr-2 h-5 w-5 text-primary-500" />
          Voice Notes
        </h3>

        <div className="flex items-center space-x-4 mb-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={isRecording ? stopRecording : startRecording}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
              isRecording
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-primary-600 hover:bg-primary-700 text-white"
            }`}
          >
            {isRecording ? (
              <>
                <FiSquare className="h-5 w-5" />
                <span>Stop Recording</span>
              </>
            ) : (
              <>
                <FiMic className="h-5 w-5" />
                <span>Start Recording</span>
              </>
            )}
          </motion.button>

          {listening && (
            <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
              <FiLoader className="h-5 w-5 animate-spin" />
              <span>Listening...</span>
            </div>
          )}
        </div>

        {/* Live Transcript */}
        <AnimatePresence>
          {transcript && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4"
            >
              <p className="text-gray-700 dark:text-gray-300">{transcript}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Recordings List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">
          Recent Recordings
        </h4>

        <div className="space-y-3">
          <AnimatePresence>
            {recordings.map((recording) => (
              <motion.div
                key={recording.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 dark:text-white truncate">
                    {recording.transcript || "No transcript available"}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {new Date(recording.timestamp).toLocaleString()}
                  </p>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  {recording.audioUrl && (
                    <button
                      onClick={() => playRecording(recording.audioUrl)}
                      className="p-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                      title="Play"
                    >
                      <FiPlay className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={() =>
                      downloadTranscript(recording.transcript, recording.id)
                    }
                    className="p-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                    title="Download"
                  >
                    <FiDownload className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => deleteRecording(recording.id)}
                    className="p-2 text-red-600 dark:text-red-400 hover:text-red-700 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20"
                    title="Delete"
                  >
                    <FiTrash2 className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {recordings.length === 0 && (
            <div className="text-center py-8">
              <div className="text-gray-400 dark:text-gray-600 text-4xl mb-3">
                🎤
              </div>
              <p className="text-gray-500 dark:text-gray-400">
                No voice notes yet. Start recording!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VoiceNotes;
