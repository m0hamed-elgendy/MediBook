import api from "./api"

const adminService ={
    getDashboardStats:async()=>{
        const response= await api.get('/admin/dashboard')
        return response.data
    }
}

export default adminService