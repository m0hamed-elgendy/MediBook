import api from './api'

const doctorService = {
    getDoctors: async (params = {}) => {
        const response = await api.get('/doctors', { params })
        return response.data
    },
    getDoctorById: async (id) => {
        const response = await api.get(`/doctors/${id}`)
        return response.data
    }
}

export default doctorService
