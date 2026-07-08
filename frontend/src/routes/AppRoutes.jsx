import { Suspense, lazy } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import PublicRoutes from './publicRoutes'
import ProtectedRoute from './ProtectedRoute'
import PublicLayout from '../layouts/PublicLayout'
import PatientLayout from '../layouts/PatientLayout'
import DoctorLayout from '../layouts/DoctorLayout'
import AdminLayout from '../layouts/AdminLayout'

const Login = lazy(() => import('../pages/auth/Login'))
const Register = lazy(() => import('../pages/auth/Register'))
const AdminDashboard = lazy(() => import('../pages/admin/Dashboard'))
const Users = lazy(() => import('../pages/admin/Users'))
const Doctors = lazy(() => import('../pages/admin/Doctors'))
const DoctorApplications = lazy(() => import('../pages/admin/DoctorApplications'))
const Appointments = lazy(() => import('../pages/admin/Appointments'))
const ReviewsAdmin = lazy(() => import('../pages/admin/Reviews'))
const Settings = lazy(() => import('../pages/admin/Settings'))
const DoctorDashboard = lazy(() => import('../pages/doctor/Dashboard'))
const DoctorAppointments = lazy(() => import('../pages/doctor/Appointments'))
const DoctorReviews = lazy(() => import('../pages/doctor/Reviews'))
const DoctorSchedule = lazy(() => import('../pages/doctor/Schedule'))
const DoctorProfile = lazy(() => import('../pages/doctor/Profile'))
const PatientDashboard = lazy(() => import('../pages/patient/Dashboard'))
const MyAppointments = lazy(() => import('../pages/patient/MyAppointments'))
const PatientProfile = lazy(() => import('../pages/patient/Profile'))
const DoctorSearch = lazy(() => import('../pages/patient/DoctorSearch'))
const Home = lazy(() => import('../pages/Home'))
const ApplyDoctor = lazy(() => import('../pages/patient/ApplyDoctor'))
const MyReviews = lazy(() => import('../pages/patient/MyReviews'))
const DoctorDetails = lazy(() => import('../pages/patient/DoctorDetails'))
const NotFound = lazy(() => import('../pages/NotFound'))

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
  </div>
)

const AppRoutes = () => {
    const location = useLocation()

    return (
        <AnimatePresence mode="wait">
            <Suspense fallback={<PageLoader />}>
                <Routes location={location} key={location.pathname}>
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
                            <Route path="/admin/reviews" element={<ReviewsAdmin />} />
                            <Route path="/admin/settings" element={<Settings />} />
                            <Route path="/admin/*" element={<NotFound />} />
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
                            <Route path="/doctor/*" element={<NotFound />} />
                        </Route>
                    </Route>

                    {/* Patient Routes – wrapped with PatientLayout */}
                    <Route element={<ProtectedRoute allowedRoles={['patient']} />}>
                        <Route element={<PatientLayout />}>
                            <Route path="/patient/dashboard" element={<PatientDashboard />} />
                            <Route path="/patient/appointments" element={<MyAppointments />} />
                            <Route path="/patient/settings" element={<PatientProfile />} />
                            <Route path="/patient/reviews" element={<MyReviews />} />
                            <Route path="/apply-doctor" element={<ApplyDoctor />} />
                            <Route path="/patient/*" element={<NotFound />} />
                        </Route>
                    </Route>

                    <Route element={<PublicLayout />}>
                        <Route path='/' element={<Home />} />
                        <Route path='/doctors' element={<DoctorSearch />} />
                        <Route path='/doctors/:id' element={<DoctorDetails />} />
                    </Route>

                    {/* 404 catch-all */}
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Suspense>
        </AnimatePresence>
    )
}

export default AppRoutes