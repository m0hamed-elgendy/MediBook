import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { FiChevronDown, FiUser, FiLogOut, FiGrid } from 'react-icons/fi'

// Heartbeat logo SVG component matching the image
const Logo = ({ isDark = false }) => (
    <div className="flex items-center gap-2">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill={isDark ? "#ffffff" : "#185FA5"}/>
            <path d="M6 9.5h2l1.5-2.5 1.5 5 1.5-3.5 1.5 2H18" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span className={`text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Medi<span className={isDark ? 'text-white/90' : 'text-blue-600'}>Book</span>
        </span>
    </div>
)

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const getDashboardPath = () => {
    if (user?.role === 'admin') return '/admin/dashboard'
    if (user?.role === 'doctor') return '/doctor/dashboard'
    return '/patient/dashboard'
  }

  const navLinkClass = ({ isActive }) => 
    `font-semibold text-sm transition-all duration-300 relative py-5 ${
      isActive 
        ? 'text-blue-600 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-blue-600' 
        : 'text-slate-600 hover:text-blue-600'
    }`

  return (
    <nav className="bg-white border-b border-slate-100 sticky top-0 z-50 shadow-xs">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-20">

        {/* Logo */}
        <Link to="/" className="flex items-center shrink-0">
          <Logo />
        </Link>

        {/* Links */}
        <div className="hidden md:flex items-center gap-10">
          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/doctors" className={navLinkClass}>
            Doctors
          </NavLink>
          <NavLink to="/about" className={navLinkClass}>
            About
          </NavLink>
          <NavLink to="/contact" className={navLinkClass}>
            Contact
          </NavLink>
        </div>

        {/* Auth */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl px-4 py-2 transition duration-300 cursor-pointer"
              >
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-sm">
                    {user.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-slate-700 font-semibold text-sm">{user.name}</span>
                <FiChevronDown className={`text-slate-400 transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-100 rounded-2xl shadow-xl py-2.5 z-50 animate-fadeIn">
                  <Link
                    to={getDashboardPath()}
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition"
                  >
                    <FiGrid className="text-blue-500 text-lg" />
                    <span className="font-medium">Dashboard</span>
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition"
                  >
                    <FiUser className="text-blue-500 text-lg" />
                    <span className="font-medium">Profile</span>
                  </Link>
                  <hr className="my-2 border-slate-100" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50/60 transition cursor-pointer"
                  >
                    <FiLogOut className="text-lg" />
                    <span className="font-semibold">Logout</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link 
                to="/login"
                className="px-5 py-2.5 border border-blue-200 text-blue-600 rounded-xl font-semibold text-sm hover:bg-blue-50/70 hover:border-blue-300 transition duration-300 active:scale-98"
              >
                Login
              </Link>
              <Link 
                to="/register"
                className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 transition duration-300 shadow-sm hover:shadow-md hover:shadow-blue-100 active:scale-98"
              >
                Register
              </Link>
            </div>
          )}
        </div>

      </div>
    </nav>
  )
}

export { Logo }
export default Navbar