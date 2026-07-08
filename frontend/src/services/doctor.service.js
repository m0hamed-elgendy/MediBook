import api from './api'

const doctorService = {
    getDoctors: async (params = {}) => {
        const response = await api.get('/doctors', { params })
        return response.data
    },

    getById: async (id) => {
        const response = await api.get(`/doctors/${id}`)
        return response.data
    },

    getBusySlots: async (id, date) => {
        const response = await api.get(`/doctors/${id}/busy`, { params: { date } })
        return response.data
    },

    getProfile: async () => {
        const response = await api.get('/doctors/profile')
        return response.data
    },

    update: async (id, data) => {
        const response = await api.patch(`/doctors/${id}`, data)
        return response.data
    },

    getDashboard: async () => {
        const response = await api.get('/doctors/dashboard')
        return response.data
    },

    getTodaySchedule: async () => {
        const response = await api.get('/doctors/dashboard/today')
        return response.data
    },

    getRecentReviews: async () => {
        const response = await api.get('/doctors/dashboard/reviews')
        return response.data
    },

    getMonthlyAppointments: async () => {
        const response = await api.get('/doctors/dashboard/monthly')
        return response.data
    },

    getStatusDistribution: async () => {
        const response = await api.get('/doctors/dashboard/status')
        return response.data
    },
}

export default doctorService