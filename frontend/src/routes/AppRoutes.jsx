import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'
import PublicRoutes from './publicRoutes'
import ProtectedRoute from './ProtectedRoute'
import AdminDashboard from '../pages/admin/Dashboard'
import DoctorDashboard from '../pages/doctor/Dashboard'
import PatientDashoard from '../pages/patient/Dashboard'

const AppRoutes = () => {
    return (
        <Routes>
            {/* public Route */}
            <Route path='/' element={<h1>Home</h1>} />
            <Route path="/login" element={
                <PublicRoutes>
                    <Login />
                </PublicRoutes>
            } />

            <Route path="/register" element={
                <PublicRoutes>
                    <Register />
                </PublicRoutes>
            } />

            {/* admin routes */}
            <Route element={<ProtectedRoute allwedUser={['admin']} />}>
                <Route path='/admin/dashboard' element={<AdminDashboard />} />
            </Route>

            {/* doctor dashboard */}
            <Route element={<ProtectedRoute allwedUser={'doctor'} />}>
                <Route path='/doctor/dashboard' element={<DoctorDashboard />} />
            </Route>

            {/* Patient Routes */}
            <Route element={<ProtectedRoute allowedRoles={['patient']} />}>
                <Route path="/patient/dashboard" element={<PatientDashoard />} />
            </Route>


        </Routes>
    )
}

export default AppRoutes