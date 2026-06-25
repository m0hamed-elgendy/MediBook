import api from './api'

const reviewService = {
    create: async (data) => {
        const response = await api.post('/reviews', data)
        return response.data
    },

    getDoctorReviews: async (doctorId, params = {}) => {
        const response = await api.get(`/reviews/doctor/${doctorId}`, { params })
        return response.data
    },

    getDoctorReviewsSummary: async (doctorId) => {
        const response = await api.get(`/reviews/doctor/${doctorId}/summary`)
        return response.data
    }
}

export default reviewService
