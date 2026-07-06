import api from "./api"

const adminService = {
    getDashboardStats: async () => {
        const response = await api.get('/admin/dashboard')
        return response.data
    },

    getReviewsStats: async () => {
        const response = await api.get('/admin/dashboard/reviews-stats')
        return response.data
    },

    getAppointmentsAnalytics: async () => {
        const response = await api.get('/admin/dashboard/appointments-analytics')
        return response.data
    },

    getTopDoctors: async () => {
        const response = await api.get('/admin/dashboard/top-doctors')
        return response.data
    },

    getDoctorsBySpecialty: async () => {
        const response = await api.get('/admin/dashboard/getDoctorsBySpecialty')
        return response.data
    },

    getUsers: async (params = {}) => {
        const response = await api.get('/users', { params })
        return response.data
    },

    suspendUser: async (id) => {
        const response = await api.patch(`/users/${id}/suspend`)
        return response.data
    }
}

export default adminService