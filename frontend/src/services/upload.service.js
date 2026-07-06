import api from './api'

const uploadService = {
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

export default uploadService
