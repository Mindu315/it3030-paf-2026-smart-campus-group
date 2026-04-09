import React, { useEffect, useState } from 'react';
import { Clock, CheckCircle, Loader2, ArrowLeft } from 'lucide-react';
import BookingService from '../services/BookingService';
import { useNavigate } from 'react-router-dom';

const BookingHistory = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                // Calls the new /all endpoint we discussed
                const response = await BookingService.getAllBookings();
                const sortedData = response.data.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
                setBookings(sortedData);
                
            } catch (error) {
                console.error("Error fetching history:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-5xl mx-auto">
                <button 
                    onClick={() => navigate(-1)} 
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
                                                'bg-amber-100 text-amber-700'
                                            }`}>
                                                {b.status || 'PENDING'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingHistory;