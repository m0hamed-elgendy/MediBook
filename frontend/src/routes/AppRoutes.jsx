import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'
import PublicRoutes from './publicRoutes'
import ProtectedRoute from './ProtectedRoute'
import AdminDashboard from '../pages/admin/Dashboard'
import DoctorDashboard from '../pages/doctor/Dashboard'
import PatientDashoard from '../pages/patient/Dashboard'
import PublicLayout from '../layouts/PublicLayout'
import DoctorSearch from '../pages/patient/DoctorSearch'
import Home from '../pages/Home'
import ApplyDoctor from '../pages/patient/ApplyDoctor'
import DoctorDetails from '../pages/patient/DoctorDetails'

const AppRoutes = () => {
    return (
        <Routes>
            {/* public Route */}
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
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route path='/admin/dashboard' element={<AdminDashboard />} />
            </Route>

            {/* doctor dashboard */}
            <Route element={<ProtectedRoute allowedRoles={['doctor']} />}>
                <Route path='/doctor/dashboard' element={<DoctorDashboard />} />
            </Route>

            {/* Patient Routes */}
            <Route element={<ProtectedRoute allowedRoles={['patient']} />}>
                <Route path="/patient/dashboard" element={<PatientDashoard />} />
                <Route path="/apply-doctor" element={<ApplyDoctor />} />
                <Route path="doctors/:id" element={<DoctorDetails />} />
            </Route>

            <Route element={<PublicLayout />}>
                <Route path='/' element={<Home />} />
                <Route path='/doctors' element={<DoctorSearch />} />
            </Route>


        </Routes>
    )
}

export default AppRoutes