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
    },

    getMyReviews: async (params = {}) => {
        const response = await api.get('/reviews/my-reviews', { params })
        return response.data
    },

    getDoctorOwnReviews: async (params = {}) => {
        const response = await api.get('/reviews/my-rating', { params })
        return response.data
    },

    getDoctorOwnSummary: async () => {
        const response = await api.get('/reviews/my-rating/summary')
        return response.data
    },

    updateReview: async (id, data) => {
        const response = await api.patch(`/reviews/${id}`, data)
        return response.data
    },

    deleteReview: async (id) => {
        const response = await api.delete(`/reviews/${id}`)
        return response.data
    }
}

export default reviewService
