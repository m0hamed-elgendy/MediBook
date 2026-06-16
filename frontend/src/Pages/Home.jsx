import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  FiCalendar, FiPlayCircle, FiUsers, FiClock, FiShield, 
  FiSearch, FiMessageSquare, FiStar, FiMapPin, FiDollarSign, FiArrowRight 
} from 'react-icons/fi'
import doctorService from '../services/doctor.service'

const SPECIALTIES = [
  { name: 'Cardiology', icon: '❤️', color: 'bg-rose-50 text-rose-600 border-rose-100/50', desc: 'Heart care & diagnostics' },
  { name: 'Dermatology', icon: '✨', color: 'bg-amber-50 text-amber-600 border-amber-100/50', desc: 'Skin & cosmetic' },
  { name: 'Orthopedics', icon: '🦴', color: 'bg-emerald-50 text-emerald-600 border-emerald-100/50', desc: 'Bones & joints' },
  { name: 'Pediatrics', icon: '👶', color: 'bg-indigo-50 text-indigo-600 border-indigo-100/50', desc: 'Child healthcare' },
  { name: 'ENT', icon: '👂', color: 'bg-purple-50 text-purple-600 border-purple-100/50', desc: 'Ear, nose & throat' }
]

const Home = () => {
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true)
        const response = await doctorService.getDoctors({ limit: 3 })
        if (response && response.data) {
          setDoctors(response.data)
        }
      } catch (err) {
        console.error('Error fetching doctors:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchDoctors()
  }, [])

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-20 md:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column */}
          <div className="lg:col-span-6 flex flex-col items-start text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50/70 border border-blue-100 rounded-full mb-6 transition-all hover:bg-blue-50">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
              <span className="text-blue-600 font-bold text-xs uppercase tracking-wider">
                Your health, our priority
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
              Book Appointments <br />
              with <span className="text-blue-600 relative inline-block">
                Trusted Doctors
                <span className="absolute bottom-1 left-0 w-full h-1.5 bg-blue-100 -z-10 rounded-full"></span>
              </span>
            </h1>

            <p className="text-slate-600 text-base md:text-lg mb-8 max-w-lg leading-relaxed">
              Easily find and book appointments with experienced doctors near you. Your health is in safe hands.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link 
                to="/doctors" 
                className="px-6 py-3.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all duration-300 hover:shadow-lg hover:shadow-blue-200 flex items-center gap-2.5 active:scale-98"
              >
                <FiCalendar className="text-lg" />
                <span>Book Appointment</span>
              </Link>
              <a 
                href="#how-it-works" 
                className="px-6 py-3.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:text-blue-600 hover:border-blue-200 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2.5 active:scale-98"
              >
                <FiPlayCircle className="text-lg" />
                <span>How It Works</span>
              </a>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-6 relative w-full flex justify-center">
            <div className="relative w-full max-w-[540px]">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-radial from-blue-100/40 via-transparent to-transparent -z-10 rounded-full blur-2xl"></div>
              
              <div className="rounded-3xl overflow-hidden shadow-2xl shadow-slate-200/80 border-4 border-white">
                <img 
                  src="/images/doctor-hero.png" 
                  alt="Doctor Consultation" 
                  className="w-full h-auto object-cover transform hover:scale-102 transition duration-700 ease-out"
                />
              </div>

              {/* Floating Stats */}
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[90%] md:w-[95%] bg-white/95 backdrop-blur shadow-xl border border-slate-100 rounded-2xl p-4 md:p-5 flex items-center justify-between gap-3 md:gap-4">
                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                    <FiUsers className="text-blue-600 text-lg" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-extrabold text-slate-800 text-sm md:text-base tracking-tight truncate">100+</div>
                    <div className="text-[10px] md:text-xs text-slate-500 font-medium truncate">Expert Doctors</div>
                  </div>
                </div>
                
                <div className="h-8 w-[1px] bg-slate-100 shrink-0"></div>

                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50/70 flex items-center justify-center shrink-0">
                    <FiShield className="text-emerald-600 text-lg" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-extrabold text-slate-800 text-sm md:text-base tracking-tight truncate">Trusted</div>
                    <div className="text-[10px] md:text-xs text-slate-500 font-medium truncate">Healthcare</div>
                  </div>
                </div>

                <div className="h-8 w-[1px] bg-slate-100 shrink-0"></div>

                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
                    <FiClock className="text-purple-600 text-lg" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-extrabold text-slate-800 text-sm md:text-base tracking-tight truncate">24/7</div>
                    <div className="text-[10px] md:text-xs text-slate-500 font-medium truncate">Support</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Features Bar */}
      <div className="bg-white border-t border-b border-slate-100 shadow-xs">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 lg:divide-x divide-slate-100 py-2">
            <div className="flex items-start gap-4 p-6 hover:bg-slate-50/40 transition duration-300">
              <div className="w-12 h-12 rounded-2xl bg-blue-50/70 flex items-center justify-center shrink-0">
                <FiSearch className="text-blue-600 text-xl" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-base mb-1">Find Doctors</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Search and explore top doctors by specialty.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 hover:bg-slate-50/40 transition duration-300">
              <div className="w-12 h-12 rounded-2xl bg-blue-50/70 flex items-center justify-center shrink-0">
                <FiCalendar className="text-blue-600 text-xl" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-base mb-1">Book Appointment</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Choose a time and book your appointment easily.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 hover:bg-slate-50/40 transition duration-300">
              <div className="w-12 h-12 rounded-2xl bg-blue-50/70 flex items-center justify-center shrink-0">
                <FiMessageSquare className="text-blue-600 text-xl" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-base mb-1">Consult Online</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Consult with doctors from the comfort of your home.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 hover:bg-slate-50/40 transition duration-300">
              <div className="w-12 h-12 rounded-2xl bg-blue-50/70 flex items-center justify-center shrink-0">
                <FiShield className="text-blue-600 text-xl" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-base mb-1">Secure & Safe</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Your data is protected and your privacy is our priority.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Specialties Section */}
      <div className="max-w-7xl mx-auto px-6 py-20 md:py-24">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Find Doctors by Specialty
          </h2>
          <p className="text-slate-500 text-base md:text-lg">
            Choose from our extensive range of medical specialties to find the right care for you.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {SPECIALTIES.map((spec) => (
            <Link 
              key={spec.name}
              to={`/doctors?specialty=${spec.name}`}
              className="group p-6 bg-white border border-slate-100 hover:border-blue-200 rounded-2xl shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center"
            >
              <div className={`w-14 h-14 rounded-2xl ${spec.color} flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition duration-300`}>
                {spec.icon}
              </div>
              <h3 className="font-bold text-slate-800 text-base mb-1 group-hover:text-blue-600 transition">
                {spec.name}
              </h3>
              <p className="text-slate-400 text-xs font-medium">
                {spec.desc}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* Top Doctors Section */}
      <div className="bg-slate-100/40 border-t border-slate-100 py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 md:mb-16 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
                Our Top Specialists
              </h2>
              <p className="text-slate-500 text-base max-w-xl">
                Get treatment from highly rated and verified doctors recognized for excellence in patient care.
              </p>
            </div>
            <Link 
              to="/doctors" 
              className="inline-flex items-center gap-2 text-blue-600 font-bold text-sm hover:text-blue-700 hover:underline transition shrink-0"
            >
              <span>View All Doctors</span>
              <FiArrowRight />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs animate-pulse">
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-16 h-16 rounded-full bg-slate-200"></div>
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-slate-200 rounded-sm w-3/4"></div>
                      <div className="h-3 bg-slate-200 rounded-sm w-1/2"></div>
                    </div>
                  </div>
                  <div className="space-y-2 mb-6">
                    <div className="h-3 bg-slate-200 rounded-sm w-full"></div>
                    <div className="h-3 bg-slate-200 rounded-sm w-5/6"></div>
                  </div>
                  <div className="h-10 bg-slate-200 rounded-xl w-full"></div>
                </div>
              ))}
            </div>
          ) : doctors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {doctors.map((doctor) => (
                <div 
                  key={doctor._id}
                  className="bg-white border border-slate-100 hover:border-blue-100 rounded-2xl shadow-xs hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col h-full"
                >
                  <div className="p-6 flex-1 flex flex-col">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 overflow-hidden">
                        {doctor.user?.profileImage ? (
                          <img 
                            src={doctor.user.profileImage} 
                            alt={doctor.user.name} 
                            className="w-full h-full object-cover" 
                          />
                        ) : (
                          <span className="text-blue-600 font-extrabold text-xl">
                            {doctor.user?.name?.charAt(0).toUpperCase() || 'Dr'}
                          </span>
                        )}
                      </div>
                      <div>
                        <span className="inline-block px-2.5 py-0.5 bg-blue-50 text-blue-600 text-xs font-bold rounded-full mb-1">
                          {doctor.specialty}
                        </span>
                        <h3 className="font-bold text-slate-800 text-lg line-clamp-1">
                          {doctor.user?.name}
                        </h3>
                      </div>
                    </div>

                    {/* Bio */}
                    <p className="text-slate-500 text-sm mb-5 line-clamp-2 leading-relaxed flex-1">
                      {doctor.bio || 'Experienced medical practitioner providing high quality, patient-focused clinical services.'}
                    </p>

                    {/* Meta info */}
                    <div className="space-y-2.5 pt-4 border-t border-slate-50 mb-5">
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <div className="flex items-center gap-1.5 font-medium">
                          <FiStar className="text-amber-500 fill-amber-500 text-sm" />
                          <span className="text-slate-700 font-bold">{doctor.averageRating || '0'}</span>
                          <span>({doctor.reviewsCount || '0'} reviews)</span>
                        </div>
                        <div className="flex items-center gap-1 font-bold text-slate-800">
                          <FiDollarSign className="text-sm text-slate-400" />
                          <span>{doctor.consultationPrice} EGP</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <FiMapPin className="text-slate-400 text-sm shrink-0" />
                        <span className="truncate">{doctor.address || 'Cairo, Egypt'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-4 bg-slate-50 border-t border-slate-50 flex gap-3">
                    <Link 
                      to={`/doctors?id=${doctor._id}`}
                      className="flex-1 text-center py-2.5 border border-slate-200 hover:border-slate-300 text-slate-700 bg-white rounded-xl font-semibold text-xs transition active:scale-98"
                    >
                      View Profile
                    </Link>
                    <Link 
                      to={`/doctors?book=${doctor._id}`}
                      className="flex-1 text-center py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-xs transition hover:shadow-xs active:scale-98"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center bg-white border border-slate-100 rounded-2xl py-12 px-6">
              <p className="text-slate-500 font-semibold mb-4">No verified specialists found.</p>
              <Link 
                to="/register" 
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition"
              >
                Join as Doctor
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Join as Doctor Banner Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 md:p-12 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8 border border-blue-500/20">
          <div className="text-left text-white max-w-xl">
            <h2 className="text-3xl font-extrabold mb-4">Are You a Certified Doctor?</h2>
            <p className="text-blue-100 text-sm md:text-base leading-relaxed">
              Join our network of healthcare specialists and start consultation bookings. Grow your practice, manage appointments, and reach thousands of patients effortlessly.
            </p>
          </div>
          <Link 
            to="/apply-doctor" 
            className="px-7 py-4 bg-white hover:bg-slate-50 text-blue-600 rounded-xl font-bold text-sm transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-indigo-900/10 shrink-0 active:scale-98"
          >
            Join as Doctor
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Home
