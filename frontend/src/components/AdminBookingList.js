import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Clock, User, Building2, Inbox } from 'lucide-react';
import BookingService from '../services/BookingService';
import axios from 'axios';

const AdminBookingList = () => {
    const [bookings, setBookings] = useState([]); 
    const [activeTab, setActiveTab] = useState('PENDING');
    const [loading, setLoading] = useState(true);

    // 1. LOAD ALL DATA
    const loadAllBookings = async () => {
        setLoading(true);
        try {
            // This now calls the /all endpoint so we have everything in memory
            const res = await BookingService.getAllBookings();
            setBookings(res.data);
        } catch (err) {
            console.error("Error loading bookings:", err);
            setBookings([]);
        } finally {
            setLoading(false);
        }
    };

   const handleReject = async (id) => {
    const adminReason = window.prompt("Please enter the reason for rejection:");
    
    if (adminReason) {
        try {
            await BookingService.updateStatus(id, "REJECTED", adminReason);
            alert("Booking rejected successfully!");
            loadAllBookings();
        } catch (error) {
            console.error("Update failed:", error);
            alert("Could not update booking. Check if backend is running.");
        }
    }
};

    // 2. FILTER LOGIC
    // This variable automatically updates whenever 'activeTab' or 'bookings' changes
    const displayList = bookings.filter(b => {
        if (activeTab === 'ALL') return true;
        return b.status === activeTab;
    });

    const handleAction = async (id, status) => {
        try {
            await BookingService.updateStatus(id, status);
            alert(`Booking has been ${status.toLowerCase()} successfully!`);
            loadAllBookings(); // Refresh the data after the change
        } catch (err) {
            console.error("Error updating booking:", err);
            alert("Failed to update status.");
        }
    };

    useEffect(() => {
        loadAllBookings();
    }, []);

    return (
        <div className="max-w-5xl mx-auto mt-10 px-4">
            {/* HEADER */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Booking Management</h2>
                <p className="text-slate-500 text-sm">Review and manage campus resource requests.</p>
            </div>

            {/* --- FILTER TABS --- */}
            <div className="flex gap-2 mb-8 bg-slate-100 p-1.5 rounded-2xl w-fit border border-slate-200">
                {['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED', 'ALL'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${
                            activeTab === tab 
                            ? 'bg-white text-blue-600 shadow-sm' 
                            : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* --- LIST SECTION --- */}
            <div className="grid gap-4">
                {loading ? (
                    <p className="text-center text-slate-400 py-10">Loading bookings...</p>
                ) : displayList.length > 0 ? (
                    displayList.map(b => (
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

                            {/* --- ACTIONS OR STATUS --- */}
                            <div className="flex gap-2">
                                {b.status === 'PENDING' ? (
                                    <>
                                        <button 
                                            onClick={() => handleAction(b.id, 'APPROVED')}
                                            className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-bold hover:bg-emerald-100 transition flex items-center gap-2"
                                        >
                                            <CheckCircle size={16} /> Approve
                                        </button>
                                        <button 
                                            onClick={() => handleReject(b.id)} // <--- Make sure this name matches!
                                            className="px-3 py-1 bg-rose-100 text-rose-600 rounded-lg hover:bg-rose-200"
                                        >
                                            Reject
                                        </button>
                                    </>
                                ) : (
                                    /* Show status badge if not pending */
                                    <span className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider ${
                                        b.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                                    }`}>
                                        {b.status}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    /* EMPTY STATE */
                    <div className="text-center py-16 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                        <Inbox className="mx-auto text-slate-300 mb-3" size={40} />
                        <p className="text-slate-400 font-medium">No {activeTab.toLowerCase()} bookings to display.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminBookingList;