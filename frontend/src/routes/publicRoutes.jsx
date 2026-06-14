import React from 'react'
import { useAuth } from '../context/AuthContext'
import { Navigate } from 'react-router-dom'

const PublicRoutes = ({ children }) => {
    const { user } = useAuth()

    if (user) {
        if (user.role == 'admin') return <Navigate to="/admin/dashboard" replace />
        if (user.role == 'doctor') return <Navigate to="/doctor/dashboard" replace />
        return <Navigate to="/patient/dashboard" replace />

    }
    return children

}
export default PublicRoutes