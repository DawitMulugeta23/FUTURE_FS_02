// src/components/Calendar/LeadCalendar.jsx
import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiClock, FiMapPin, FiUsers } from 'react-icons/fi';
import { format } from 'date-fns';

const localizer = momentLocalizer(moment);

const LeadCalendar = ({ events = [], onEventAdd, onEventSelect }) => {
    const [view, setView] = useState('month');
    const [date, setDate] = useState(new Date());
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [showEventModal, setShowEventModal] = useState(false);
    const [newEvent, setNewEvent] = useState({
        title: '',
        start: new Date(),
        end: new Date(),
        type: 'meeting',
        description: '',
        location: ''
    });

    const eventStyleGetter = (event) => {
        const colors = {
            call: {
                backgroundColor: '#3b82f6',
                borderColor: '#2563eb'
            },
            meeting: {
                backgroundColor: '#8b5cf6',
                borderColor: '#7c3aed'
            },
            task: {
                backgroundColor: '#10b981',
                borderColor: '#059669'
            },
            followup: {
                backgroundColor: '#f59e0b',
                borderColor: '#d97706'
            },
            other: {
                backgroundColor: '#6b7280',
                borderColor: '#4b5563'
            }
        };

        return {
            style: {
                ...colors[event.type] || colors.other,
                borderRadius: '4px',
                opacity: 0.8,
                color: 'white',
                border: 'none',
                display: 'block'
            }
        };
    };

    const handleSelectSlot = ({ start, end }) => {
        setNewEvent({
            ...newEvent,
            start,
            end
        });
        setShowEventModal(true);
    };

    const handleSelectEvent = (event) => {
        setSelectedEvent(event);
        onEventSelect && onEventSelect(event);
    };

    const handleSaveEvent = () => {
        onEventAdd && onEventAdd(newEvent);
        setShowEventModal(false);
        setNewEvent({
            title: '',
            start: new Date(),
            end: new Date(),
            type: 'meeting',
            description: '',
            location: ''
        });
    };

    const CustomToolbar = (toolbar) => {
        const goToBack = () => {
            toolbar.date.setMonth(toolbar.date.getMonth() - 1);
            toolbar.onNavigate('prev');
        };

        const goToNext = () => {
            toolbar.date.setMonth(toolbar.date.getMonth() + 1);
            toolbar.onNavigate('next');
        };

        const goToToday = () => {
            toolbar.onNavigate('today');
        };

        const goToView = (view) => {
            toolbar.onView(view);
        };

        return (
            <div className="flex items-center justify-between mb-4 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-center space-x-2">
                    <button
                        onClick={goToBack}
                        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                    >
                        ←
                    </button>
                    <button
                        onClick={goToToday}
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                        Today
                    </button>
                    <button
                        onClick={goToNext}
                        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                    >
                        →
                    </button>
                </div>
                
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {format(toolbar.date, 'MMMM yyyy')}
                </h2>
                
                <div className="flex items-center space-x-2">
                    {['month', 'week', 'day', 'agenda'].map(viewName => (
                        <button
                            key={viewName}
                            onClick={() => goToView(viewName)}
                            className={`px-3 py-1 rounded-lg capitalize transition-colors ${
                                toolbar.view === viewName
                                    ? 'bg-primary-600 text-white'
                                    : 'hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
                            }`}
                        >
                            {viewName}
                        </button>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <div className="h-[600px]">
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: '100%' }}
                    eventPropGetter={eventStyleGetter}
                    onSelectSlot={handleSelectSlot}
                    onSelectEvent={handleSelectEvent}
                    selectable
                    views={['month', 'week', 'day', 'agenda']}
                    step={30}
                    timeslots={2}
                    toolbar={true}
                    components={{
                        toolbar: CustomToolbar
                    }}
                    className="dark:bg-gray-800 dark:text-white"
                />
            </div>

            {/* Event Modal */}
            <AnimatePresence>
                {showEventModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                        onClick={() => setShowEventModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white dark:bg-gray-800 rounded-xl max-w-lg w-full p-6"
                            onClick={e => e.stopPropagation()}
                        >
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                                Schedule Event
                            </h3>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Title
                                    </label>
                                    <input
                                        type="text"
                                        value={newEvent.title}
                                        onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                                                 focus:outline-none focus:ring-2 focus:ring-primary-500
                                                 dark:bg-gray-700 dark:text-white"
                                        placeholder="Event title"
                                    />
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Start
                                        </label>
                                        <input
                                            type="datetime-local"
                                            value={format(newEvent.start, "yyyy-MM-dd'T'HH:mm")}
                                            onChange={(e) => setNewEvent({...newEvent, start: new Date(e.target.value)})}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                                                     focus:outline-none focus:ring-2 focus:ring-primary-500
                                                     dark:bg-gray-700 dark:text-white"
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            End
                                        </label>
                                        <input
                                            type="datetime-local"
                                            value={format(newEvent.end, "yyyy-MM-dd'T'HH:mm")}
                                            onChange={(e) => setNewEvent({...newEvent, end: new Date(e.target.value)})}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                                                     focus:outline-none focus:ring-2 focus:ring-primary-500
                                                     dark:bg-gray-700 dark:text-white"
                                        />
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Type
                                    </label>
                                    <select
                                        value={newEvent.type}
                                        onChange={(e) => setNewEvent({...newEvent, type: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                                                 focus:outline-none focus:ring-2 focus:ring-primary-500
                                                 dark:bg-gray-700 dark:text-white"
                                    >
                                        <option value="meeting">Meeting</option>
                                        <option value="call">Call</option>
                                        <option value="task">Task</option>
                                        <option value="followup">Follow-up</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        value={newEvent.description}
                                        onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                                        rows="3"
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                                                 focus:outline-none focus:ring-2 focus:ring-primary-500
                                                 dark:bg-gray-700 dark:text-white"
                                        placeholder="Event description"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Location
                                    </label>
                                    <input
                                        type="text"
                                        value={newEvent.location}
                                        onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                                                 focus:outline-none focus:ring-2 focus:ring-primary-500
                                                 dark:bg-gray-700 dark:text-white"
                                        placeholder="Location or meeting link"
                                    />
                                </div>
                            </div>
                            
                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    onClick={() => setShowEventModal(false)}
                                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveEvent}
                                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                                >
                                    Schedule
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default LeadCalendar;