import React, { useEffect, useState, useCallback } from 'react';
import { Clock, Loader2, ArrowLeft, Trash2 } from 'lucide-react';
import BookingService from '../../services/BookingService';
import { useNavigate } from 'react-router-dom';

const BookingHistory = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const rawData = localStorage.getItem("smartCampusUser");
    const savedUser = rawData ? JSON.parse(rawData) : null;
    const studentId = savedUser?.studentId || savedUser?.id;

    const fetchMyBookings = useCallback(async () => {
        if (!studentId) {
            setBookings([]);
            setLoading(false);
            return;
        }

        try {
            const res = await BookingService.getBookingsByStudentId(studentId);
            const sortedData = res.data.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
            setBookings(sortedData);
        } catch (err) {
            console.error("Booking fetch error:", err);
        } finally {
            setLoading(false);
        }
    }, [studentId]);

    useEffect(() => {
        fetchMyBookings();
    }, [fetchMyBookings]);

    // 3. Updated Handle Cancel
    const handleCancel = async (booking) => {
        const confirmMsg = booking.status === 'PENDING' 
            ? "Delete this pending request?" 
            : "Cancel this approved booking? (Admin will be notified)";

        if (window.confirm(confirmMsg)) {
            try {
                // IMPORTANT: Ensure BookingService also sends the token if it's protected!
                if (booking.status === 'PENDING') {
                    await BookingService.deleteBooking(booking.id);
                    alert("Request deleted successfully.");
                } else {
                    await BookingService.updateStatus(booking.id, 'CANCELLED');
                    alert("Booking cancelled.");
                }
                
                // Refresh the list using our consolidated function
                fetchMyBookings(); 
            } catch (error) {
                console.error("Error during cancellation:", error);
                alert("Action failed. Check console for details.");
            }
        }
    };
    if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-blue-500" /></div>;

    return (
        <section className="mx-auto max-w-5xl">
                <button 
                    onClick={() => navigate('/home')} 
                    className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-6 transition-colors"
                >
                    <ArrowLeft size={20} /> Back to Dashboard
                </button>

                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
                    <h3 className="text-2xl font-bold mb-6 text-slate-800 flex items-center gap-2">
                        <Clock className="text-blue-500" /> My Booking History
                    </h3>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-slate-100">
                                    <th className="p-4 text-sm font-semibold text-slate-500">Resource</th>
                                    <th className="p-4 text-sm font-semibold text-slate-500">Date & Time</th>
                                    <th className="p-4 text-sm font-semibold text-slate-500 text-center">Status</th>
                                    <th className="p-4 text-sm font-semibold text-slate-500 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.map((b) => (
                                    <tr key={b.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                                        <td className="p-4 font-semibold text-slate-700">{b.resourceName}</td>
                                        <td className="p-4 text-slate-500">
                                            {new Date(b.startTime).toLocaleString()}
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                                b.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' :
                                                b.status === 'REJECTED' ? 'bg-rose-100 text-rose-700' :
                                                b.status === 'CANCELLED' ? 'bg-slate-100 text-slate-500' :
                                                'bg-amber-100 text-amber-700'
                                            }`}>
                                                {b.status || 'PENDING'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            {b.status !== 'REJECTED' && b.status !== 'CANCELLED' && (
                                                <button 
                                                    onClick={() => handleCancel(b)} 
                                                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
        </section>
    );
};

export default BookingHistory;
