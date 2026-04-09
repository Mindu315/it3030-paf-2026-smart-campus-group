import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Clock, User, Building2 } from 'lucide-react';
import BookingService from '../services/BookingService';

const AdminBookingList = () => {
    
    const [bookings, setBookings] = useState([]); 

    const loadAllBookings = async () => {
        try {
            const res = await BookingService.getPendingBookings();
            setBookings(res.data); // Save the data into the state
        } catch (err) {
            console.error("Error loading bookings:", err);
            setBookings([]); // Fallback to empty array if error
        }
    };

    const handleAction = async (id, status) => {
        try {
            // 1. Call the service to update the status in the DB
            await BookingService.updateStatus(id, status);
            
            // 2. Show a quick success message
            alert(`Booking has been ${status.toLowerCase()} successfully!`);
            
            // 3. Refresh the list to remove the processed booking
            loadAllBookings(); 
        } catch (err) {
            console.error("Error updating booking:", err);
            alert("Failed to update booking status. Check if the backend is running.");
        }
    };

    useEffect(() => {
        loadAllBookings();
    }, []);

    return (
        <div className="max-w-5xl mx-auto mt-10">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Booking Management</h2>
                <p className="text-slate-500 text-sm">Review and approve campus resource requests.</p>
            </div>

            <div className="grid gap-4">
                {bookings.map(b => (
                    <div key={b.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between transition hover:shadow-md">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 bg-slate-50 rounded-2xl flex items-center justify-center text-sky-600">
                                <Building2 size={24} />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900">{b.resourceName}</h4>
                                <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                                    <span className="flex items-center gap-1"><User size={14}/> {b.studentName}</span>
                                    <span className="flex items-center gap-1"><Clock size={14}/> {new Date(b.startTime).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button 
                                onClick={() => handleAction(b.id, 'APPROVED')}
                                className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-bold hover:bg-emerald-100 transition flex items-center gap-2"
                            >
                                <CheckCircle size={16} /> Approve
                            </button>
                            <button 
                                onClick={() => handleAction(b.id, 'REJECTED')}
                                className="px-4 py-2 bg-rose-50 text-rose-700 rounded-xl text-sm font-bold hover:bg-rose-100 transition flex items-center gap-2"
                            >
                                <XCircle size={16} /> Reject
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminBookingList;