import api from './api'

const appointmentService = {
    create: async (data) => {
        const response = await api.post('/appointments', data)
        return response.data
    },

    getByPatient: async (params = {}) => {
        const response = await api.get('/appointments/my', { params })
        return response.data
    },

    getByDoctor: async (params = {}) => {
        const response = await api.get('/appointments/doctor', { params })
        return response.data
    },

    getAll: async (params = {}) => {
        const response = await api.get('/appointments', { params })
        return response.data
    },

    updateStatus: async (id, status, notes) => {
        const response = await api.patch(`/appointments/${id}/status`, { status, notes })
        return response.data
    }
}

export default appointmentService
