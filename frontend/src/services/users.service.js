import api from './api'

const usersService = {
    getUsers: async (params = {}) => {
        const response = await api.get('/users', { params })
        return response.data
    },

    suspendUser: async (id) => {
        const response = await api.patch(`/users/${id}/suspend`)
        return response.data
    },

    uploadProfileImage: async (file) => {
        const formData = new FormData()
        formData.append('image', file)
        const response = await api.patch('/users/profile-image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        return response.data
    }
}

export default usersService
