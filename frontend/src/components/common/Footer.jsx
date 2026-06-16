import { Link } from 'react-router-dom'
import { FiFacebook, FiTwitter, FiInstagram, FiLinkedin, FiMail, FiPhone, FiMapPin } from 'react-icons/fi'
import { Logo } from './Navbar'

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-300">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 mb-12">

          {/* Logo & Description */}
          <div className="col-span-1 md:col-span-4 flex flex-col items-start">
            <div className="mb-4">
              <Logo isDark={true} />
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-sm">
              Book appointments with trusted doctors and manage your healthcare easily.
            </p>
            {/* Social Icons */}
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-center hover:bg-blue-600 hover:text-white hover:border-blue-600 transition duration-300 cursor-pointer">
                <FiFacebook size={16} />
              </a>
              <a href="#" className="w-9 h-9 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-center hover:bg-sky-500 hover:text-white hover:border-sky-500 transition duration-300 cursor-pointer">
                <FiTwitter size={16} />
              </a>
              <a href="#" className="w-9 h-9 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-center hover:bg-pink-600 hover:text-white hover:border-pink-600 transition duration-300 cursor-pointer">
                <FiInstagram size={16} />
              </a>
              <a href="#" className="w-9 h-9 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-center hover:bg-blue-700 hover:text-white hover:border-blue-700 transition duration-300 cursor-pointer">
                <FiLinkedin size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="font-bold text-white text-sm uppercase tracking-wider mb-5">Quick Links</h3>
            <div className="flex flex-col gap-3">
              <Link to="/" className="text-slate-400 hover:text-white text-sm transition duration-300">Home</Link>
              <Link to="/doctors" className="text-slate-400 hover:text-white text-sm transition duration-300">Doctors</Link>
              <Link to="/about" className="text-slate-400 hover:text-white text-sm transition duration-300">About</Link>
              <Link to="/contact" className="text-slate-400 hover:text-white text-sm transition duration-300">Contact</Link>
            </div>
          </div>

          {/* For Patients */}
          <div className="col-span-1 md:col-span-3">
            <h3 className="font-bold text-white text-sm uppercase tracking-wider mb-5">For Patients</h3>
            <div className="flex flex-col gap-3">
              <Link to="/doctors" className="text-slate-400 hover:text-white text-sm transition duration-300">Search Doctors</Link>
              <Link to="/doctors" className="text-slate-400 hover:text-white text-sm transition duration-300">Book Appointment</Link>
              <Link to="/patient/dashboard" className="text-slate-400 hover:text-white text-sm transition duration-300">My Appointments</Link>
              <Link to="/apply-doctor" className="text-slate-400 hover:text-white text-sm transition duration-300 font-semibold text-blue-400 hover:text-blue-300">Join as Doctor</Link>
              <Link to="/help" className="text-slate-400 hover:text-white text-sm transition duration-300">Help Center</Link>
            </div>
          </div>

          {/* Contact */}
          <div className="col-span-1 md:col-span-3">
            <h3 className="font-bold text-white text-sm uppercase tracking-wider mb-5">Contact Us</h3>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 text-slate-400 text-sm">
                <FiMail size={16} className="text-blue-500 shrink-0" />
                <span>support@medibook.com</span>
              </div>
              <div className="flex items-center gap-3 text-slate-400 text-sm">
                <FiPhone size={16} className="text-blue-500 shrink-0" />
                <span>+20 100 123 4567</span>
              </div>
              <div className="flex items-center gap-3 text-slate-400 text-sm">
                <FiMapPin size={16} className="text-blue-500 shrink-0" />
                <span>Cairo, Egypt</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom */}
        <div className="border-t border-slate-900 pt-8 flex flex-col md:flex-row items-center justify-center gap-4">
          <p className="text-slate-500 text-sm">© 2025 MediBook. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer