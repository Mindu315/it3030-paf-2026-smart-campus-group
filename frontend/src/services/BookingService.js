import axios from 'axios';

// This URL must match your Spring Boot Server port (usually 8080 or 8081)
const API_URL = "http://localhost:8081/api/bookings"; 

const BookingService = {
    // 1. Send a new booking to the DB
    createBooking: (data) => {
        return axios.post(`${API_URL}/add`, data);
    },

    // 2. Get all pending bookings for the table
    getPendingBookings: () => {
        return axios.get(`${API_URL}/pending`);
    },

    getBookingsByStudentId: (studentId) => {
        return axios.get(`${API_URL}/student/${studentId}`);
    },

    getPendingBookingsByStudent: (studentId) => {
        return axios.get(`${API_URL}/student/${studentId}/pending`);
    },

    // 3. Delete a booking (The Cancel button logic)
    deleteBooking: (id) => {
        return axios.delete(`${API_URL}/${id}`);
    },

    // 4. Update booking status with optional reason
    updateStatus: (id, status, reason = "") => {
        return axios.put(`${API_URL}/${id}/status`, { status, reason });
    },

    getAllBookings: () => {
        return axios.get(`${API_URL}/all`);
    },
};

export default BookingService;