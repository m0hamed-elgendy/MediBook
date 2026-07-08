import api from './api'
const authServices = {
    Login: async (data) => {
        const response = await api.post('/auth/login', data)
        return response.data
    },
    register: async (data) => {
        const response = await api.post('/auth/register', data)
        return response.data
    },
    logout: async () => {
        const response = await api.post('/auth/logout')
        return response.data
    },
    refresh: async (refreshToken) => {
        const response = await api.post('/auth/refresh', { refreshToken })
        return response.data
    }
}
export default authServices