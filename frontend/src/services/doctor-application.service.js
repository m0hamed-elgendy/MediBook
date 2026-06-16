import api from './api'

const doctorApplicationService = {
    applyAsDoctor: async (data) => {
        const response = await api.post('/doctor-applications', data)
        return response.data
    },
    getApplications: async () => {
        const response = await api.get('/doctor-applications')
        return response.data
    },
    approveApplication: async (id) => {
        const response = await api.patch(`/doctor-applications/${id}/approve`)
        return response.data
    },
    rejectApplication: async (id, reason) => {
        const response = await api.patch(`/doctor-applications/${id}/reject`, { rejectionReason: reason })
        return response.data
    }
}

export default doctorApplicationService
