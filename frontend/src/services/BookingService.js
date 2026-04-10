import api from "../api/axiosConfig"

const BookingService = {
    // 1. Send a new booking to the DB
    createBooking: (data) => {
        return api.post(`/bookings/add`, data);
    },

    // 2. Get all pending bookings for the table
    getPendingBookings: () => {
        return api.get(`/bookings/pending`);
    },

    getBookingsByStudentId: (studentId) => {
        return api.get(`/bookings/student/${studentId}`);
    },

    getPendingBookingsByStudent: (studentId) => {
        return api.get(`/bookings/student/${studentId}/pending`);
    },

    // 3. Delete a booking (The Cancel button logic)
    deleteBooking: (id) => {
        return api.delete(`/bookings/${id}`);
    },

    // 4. Update booking status with optional reason
    updateStatus: (id, status, reason = "") => {
        return api.put(`/bookings/${id}/status`, { status, reason });
    },

    getAllBookings: () => {
        return api.get(`/bookings/all`);
    },
};

export default BookingService;
