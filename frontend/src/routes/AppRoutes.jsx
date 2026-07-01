import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'
import PublicRoutes from './publicRoutes'
import ProtectedRoute from './ProtectedRoute'
import AdminDashboard from '../pages/admin/Dashboard'
import DoctorDashboard from '../pages/doctor/Dashboard'
import PatientDashboard from '../pages/patient/Dashboard'
import PublicLayout from '../layouts/PublicLayout'
import PatientLayout from '../layouts/PatientLayout'
import DoctorLayout from '../layouts/DoctorLayout'
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

            {/* Doctor Routes – wrapped with DoctorLayout */}
            <Route element={<ProtectedRoute allowedRoles={['doctor']} />}>
                <Route element={<DoctorLayout />}>
                    <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
                    <Route path="/doctor/schedule" element={<DoctorDashboard />} />
                    <Route path="/doctor/appointments" element={<DoctorDashboard />} />
                    <Route path="/doctor/reviews" element={<DoctorDashboard />} />
                    <Route path="/doctor/profile" element={<DoctorDashboard />} />
                </Route>
            </Route>

            {/* Patient Routes – wrapped with PatientLayout */}
            <Route element={<ProtectedRoute allowedRoles={['patient']} />}>
                <Route element={<PatientLayout />}>
                    <Route path="/patient/dashboard" element={<PatientDashboard />} />
                    <Route path="/patient/appointments" element={<PatientDashboard />} />
                    <Route path="/apply-doctor" element={<ApplyDoctor />} />
                </Route>
            </Route>

            <Route element={<PublicLayout />}>
                <Route path='/' element={<Home />} />
                <Route path='/doctors' element={<DoctorSearch />} />
                <Route path='/doctors/:id' element={<DoctorDetails />} />
            </Route>


        </Routes>
    )
}

export default AppRoutes