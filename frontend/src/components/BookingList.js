import React, { useEffect, useState } from 'react';
import { Trash2, Loader2, CheckCircle } from 'lucide-react';
import BookingService from '../services/BookingService';

const BookingList = ({ refreshTrigger }) => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch bookings from your Spring Boot API
    const fetchBookings = async () => {
        setLoading(true);
        try {
            const response = await BookingService.getPendingBookings();
            setBookings(response.data);
        } catch (error) {
            console.error("Error fetching bookings:", error);
        } finally {
            setLoading(false);
        }
    };

    // Run this when the component loads OR when a new booking is added
    useEffect(() => {
        fetchBookings();
    }, [refreshTrigger]);

    const handleCancel = async (id) => {
        if (window.confirm("Are you sure you want to cancel this booking?")) {
            try {
                await BookingService.deleteBooking(id);
                fetchBookings(); // Refresh the list after deleting
            } catch (error) {
                alert("Failed to cancel booking");
            }
        }
    };

    if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-blue-500" /></div>;

    return (
        <div className="mt-8 bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800">
                <CheckCircle className="text-green-500" /> My Pending Bookings
            </h3>
            
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b">
                            <th className="p-3 text-sm font-semibold text-gray-600">Resource</th>
                            <th className="p-3 text-sm font-semibold text-gray-600">Start Time</th>
                            <th className="p-3 text-sm font-semibold text-gray-600 text-center">Status</th>
                            <th className="p-3 text-sm font-semibold text-gray-600">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.length === 0 ? (
                            <tr><td colSpan="3" className="p-4 text-center text-gray-400">No pending bookings found.</td></tr>
                        ) : (
                            bookings.map((b) => (
                                <tr key={b.id} className="border-b hover:bg-gray-50 transition-colors">
                                    <td className="p-3 font-medium text-gray-700">{b.resourceName}</td>
                                    <td className="p-3 text-sm text-gray-500">
                                        {new Date(b.startTime).toLocaleString()}
                                    </td>

                                    <td className="p-3 text-center">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                            b.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                                            b.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                                            'bg-yellow-100 text-yellow-700'
                                        }`}>
                                            {b.status || 'PENDING'}
                                        </span>
                                    </td>

                                    <td className="p-3">
                                        <button 
                                            onClick={() => handleCancel(b.id)}
                                            className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-full transition-all"
                                            title="Cancel Booking"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BookingList;