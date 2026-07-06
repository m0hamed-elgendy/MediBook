import api from "./api"

const adminService = {
    getDashboardStats: async () => {
        const response = await api.get('/admin/dashboard')
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