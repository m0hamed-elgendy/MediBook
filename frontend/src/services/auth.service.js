import api from './api'
const authServices = {
    Login: async (data) => {
        const response = await api.post('/auth/login', data)
        return response.data
    },
    register: async (data) => {
        const response = await api.post('/auth/register', data)
        return response
    },
    logout: async () => {
        const response = await api.post('/auth/logout')
        return response
    },
    

}
export default authServices