import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'
import PublicRoutes from './publicRoutes'
import ProtectedRoute from './ProtectedRoute'
import AdminDashboard from '../pages/admin/Dashboard'
import Users from '../pages/admin/Users'
import Doctors from '../pages/admin/Doctors'
import DoctorApplications from '../pages/admin/DoctorApplications'
import Appointments from '../pages/admin/Appointments'
import Reviews from '../pages/admin/Reviews'
import Settings from '../pages/admin/Settings'
import DoctorDashboard from '../pages/doctor/Dashboard'
import DoctorAppointments from '../pages/doctor/Appointments'
import DoctorReviews from '../pages/doctor/Reviews'
import DoctorSchedule from '../pages/doctor/Schedule'
import DoctorProfile from '../pages/doctor/Profile'
import PatientDashboard from '../pages/patient/Dashboard'
import MyAppointments from '../pages/patient/MyAppointments'
import PatientProfile from '../pages/patient/Profile'
import PublicLayout from '../layouts/PublicLayout'
import PatientLayout from '../layouts/PatientLayout'
import DoctorLayout from '../layouts/DoctorLayout'
import AdminLayout from '../layouts/AdminLayout'
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
                <Route element={<AdminLayout />}>
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    <Route path="/admin/users" element={<Users />} />
                    <Route path="/admin/doctors" element={<Doctors />} />
                    <Route path="/admin/applications" element={<DoctorApplications />} />
                    <Route path="/admin/appointments" element={<Appointments />} />
                    <Route path="/admin/reviews" element={<Reviews />} />
                    <Route path="/admin/settings" element={<Settings />} />
                </Route>
            </Route>

            {/* Doctor Routes – wrapped with DoctorLayout */}
            <Route element={<ProtectedRoute allowedRoles={['doctor']} />}>
                <Route element={<DoctorLayout />}>
                    <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
                    <Route path="/doctor/schedule" element={<DoctorSchedule />} />
                    <Route path="/doctor/appointments" element={<DoctorAppointments />} />
                    <Route path="/doctor/reviews" element={<DoctorReviews />} />
                    <Route path="/doctor/profile" element={<DoctorProfile />} />
                </Route>
            </Route>

            {/* Patient Routes – wrapped with PatientLayout */}
            <Route element={<ProtectedRoute allowedRoles={['patient']} />}>
                <Route element={<PatientLayout />}>
                    <Route path="/patient/dashboard" element={<PatientDashboard />} />
                    <Route path="/patient/appointments" element={<MyAppointments />} />
                    <Route path="/patient/settings" element={<PatientProfile />} />
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