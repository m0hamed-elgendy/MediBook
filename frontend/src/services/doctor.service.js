import api from './api'

const doctorService = {
    getAll: async (params = {}) => {
        const response = await api.get('/doctors', { params })
        return response.data
    },

    getById: async (id) => {
        const response = await api.get(`/doctors/${id}`)
        return response.data
    },

    getTop: async () => {
        const response = await api.get('/doctors', { params: { limit: 3 } })
        return response.data
    },
}

export default doctorService