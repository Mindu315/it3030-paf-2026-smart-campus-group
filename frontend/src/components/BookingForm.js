import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Send, Info } from 'lucide-react';
import BookingService from '../services/BookingService';

const BookingForm = ({ onBookingAdded }) => {
    const rawUser = localStorage.getItem("smartCampusUser");
    const savedUser = rawUser ? JSON.parse(rawUser) : null;

    const [booking, setBooking] = useState({
        studentId: savedUser?.studentId || savedUser?.id || "",
        studentName: savedUser?.name || savedUser?.email || "",
        resourceName: '',
        startTime: '',
        endTime: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!booking.studentId || !booking.studentName) {
            alert("You must be logged in to submit a booking.");
            return;
        }
        e.preventDefault();
        try {
            await BookingService.createBooking(booking);
            alert("Booking Request Sent!");
            onBookingAdded(); // This triggers the List to refresh
        } catch (error) {
            alert(error.response?.data || "Conflict: This time slot is already taken.");
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
        >
            <div className="flex items-center gap-2 mb-6 text-slate-900">
                <div className="p-2 bg-sky-50 rounded-lg text-sky-600">
                    <Calendar size={20} />
                </div>
                <h3 className="text-lg font-bold">New Booking</h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Resource Selection */}
                <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                        Select Resource
                    </label>
                    <select 
                        required
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none transition"
                        onChange={(e) => setBooking({...booking, resourceName: e.target.value})}
                    >
                        <option value="">-- Choose --</option>
                        <option value="Common Lab">Lab A</option>
                        <option value="Discussion Room B">Lab B</option>
                        <option value="Main Auditorium">conference Room A</option>
                    </select>
                </div>

                {/* Time Selection */}
                <div className="grid grid-cols-1 gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                            Start Time
                        </label>
                        <input 
                            type="datetime-local" 
                            required
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-sky-500 outline-none"
                            onChange={(e) => setBooking({...booking, startTime: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                            End Time
                        </label>
                        <input 
                            type="datetime-local" 
                            required
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-sky-500 outline-none"
                            onChange={(e) => setBooking({...booking, endTime: e.target.value})}
                        />
                    </div>
                </div>

                {/* Note/Info */}
                <div className="flex gap-2 p-3 bg-amber-50 rounded-2xl border border-amber-100 text-amber-700">
                    <Info size={16} className="shrink-0 mt-0.5" />
                    <p className="text-xs">Bookings are subject to approval by campus administration.</p>
                </div>

                {/* Submit Button */}
                <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit" 
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-sky-600 px-4 py-4 text-sm font-bold text-white shadow-lg shadow-sky-200 hover:bg-sky-700 transition"
                >
                    <Send size={18} />
                    Submit Request
                </motion.button>
            </form>
        </motion.div>
    );
};

export default BookingForm;