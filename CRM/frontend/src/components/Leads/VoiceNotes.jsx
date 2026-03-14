// src/components/Leads/VoiceNotes.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { FiMic, FiSquare, FiPlay, FiTrash2, FiDownload, FiLoader } from 'react-icons/fi';
import { ReactMic } from 'react-mic';
import toast from 'react-hot-toast';

const VoiceNotes = ({ onSave }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [recordings, setRecordings] = useState([]);
    const [currentRecording, setCurrentRecording] = useState(null);
    const [transcribing, setTranscribing] = useState(false);
    
    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    useEffect(() => {
        // Load saved recordings from localStorage
        const saved = localStorage.getItem('voiceNotes');
        if (saved) {
            setRecordings(JSON.parse(saved));
        }
    }, []);

    const startRecording = () => {
        setIsRecording(true);
        resetTranscript();
        SpeechRecognition.startListening({ continuous: true });
    };

    const stopRecording = () => {
        setIsRecording(false);
        SpeechRecognition.stopListening();
        
        // Save recording
        const newRecording = {
            id: Date.now(),
            transcript,
            timestamp: new Date().toISOString(),
            duration: 0 // In real app, calculate actual duration
        };
        
        const updatedRecordings = [newRecording, ...recordings];
        setRecordings(updatedRecordings);
        localStorage.setItem('voiceNotes', JSON.stringify(updatedRecordings));
        
        if (onSave) {
            onSave(newRecording);
        }
        
        toast.success('Voice note saved!');
    };

    const deleteRecording = (id) => {
        const updated = recordings.filter(r => r.id !== id);
        setRecordings(updated);
        localStorage.setItem('voiceNotes', JSON.stringify(updated));
        toast.success('Recording deleted');
    };

    const playRecording = (transcript) => {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(transcript);
            window.speechSynthesis.speak(utterance);
        }
    };

    const downloadTranscript = (transcript, id) => {
        const blob = new Blob([transcript], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `voice-note-${id}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    };

    if (!browserSupportsSpeechRecognition) {
        return (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <p className="text-yellow-800 dark:text-yellow-400">
                    Browser doesn't support speech recognition. Try Chrome or Edge.
                </p>
            </div>
        );
    }

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
                                ? 'bg-red-600 hover:bg-red-700 text-white'
                                : 'bg-primary-600 hover:bg-primary-700 text-white'
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
                                        {recording.transcript || 'No transcript available'}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        {new Date(recording.timestamp).toLocaleString()}
                                    </p>
                                </div>
                                
                                <div className="flex items-center space-x-2 ml-4">
                                    <button
                                        onClick={() => playRecording(recording.transcript)}
                                        className="p-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                                        title="Play"
                                    >
                                        <FiPlay className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => downloadTranscript(recording.transcript, recording.id)}
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
                            <div className="text-gray-400 dark:text-gray-600 text-4xl mb-3">🎤</div>
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