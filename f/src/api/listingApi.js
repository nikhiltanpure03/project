import axios from 'axios'

// One Axios client keeps every frontend request pointed at the Spring Boot API.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
})

// Listing endpoints used by the discover and detail pages.
export const getListings = () => api.get('/listings')
export const getListingById = (id) => api.get(`/listings/${id}`)
export const createListing = (listing) => api.post('/listings', listing)
export const updateListing = (id, listing) => api.put(`/listings/${id}`, listing)
export const deleteListing = (id) => api.delete(`/listings/${id}`)

// Booking endpoints used by checkout and the admin bookings page.
export const createBooking = (booking) => api.post('/bookings', booking)
export const getBookings = () => api.get('/bookings')
export const deleteBooking = (id) => api.delete(`/bookings/${id}`)
export const createAccount = (account) => api.post('/accounts', account)
