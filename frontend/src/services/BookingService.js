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

    // 3. Delete a booking (The Cancel button logic)
    deleteBooking: (id) => {
        return axios.delete(`${API_URL}/${id}`);
    },

    // Add this inside the BookingService object
    updateStatus: (id, status) => {
    return axios.put(`${API_URL}/${id}/status`, { status });
},

    getAllBookings: () => {
        return axios.get(`${API_URL}/all`);
    },
};

export default BookingService;