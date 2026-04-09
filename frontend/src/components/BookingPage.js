import React, { useState } from 'react';
import BookingForm from './BookingForm';
import BookingList from './BookingList';

const BookingPage = () => {
    const [refresh, setRefresh] = useState(0);

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-7xl mx-auto">
                {/* We use a heading that matches the teammate's style */}
                <h1 className="text-2xl font-bold text-slate-900 mb-8">Campus Resource Booking</h1>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1">
                        <BookingForm onBookingAdded={() => setRefresh(prev => prev + 1)} />
                    </div>
                    <div className="lg:col-span-2">
                        <BookingList refreshTrigger={refresh} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingPage;