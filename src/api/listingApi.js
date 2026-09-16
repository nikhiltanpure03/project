import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8081/api',
})

export const getListings = () => api.get('/listings')
export const getListingById = (id) => api.get(`/listings/${id}`)
