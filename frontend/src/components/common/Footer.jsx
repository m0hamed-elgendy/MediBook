import { Link } from 'react-router-dom'
import { FiFacebook, FiTwitter, FiInstagram, FiMail, FiPhone, FiMapPin } from 'react-icons/fi'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Logo & Description */}
          <div className="col-span-1 md:col-span-2">
            <img src="/images/logo.png" alt="MediBook" className="h-10 object-contain mb-4"
              onError={(e) => e.target.style.display = 'none'} />
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Egypt's #1 medical booking platform — over 500 specialist doctors waiting for you
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition cursor-pointer">
                <FiFacebook size={16} />
              </a>
              <a href="#" className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-400 transition cursor-pointer">
                <FiTwitter size={16} />
              </a>
              <a href="#" className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-pink-600 transition cursor-pointer">
                <FiInstagram size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Quick Links</h3>
            <div className="flex flex-col gap-2">
              <Link to="/" className="text-gray-400 hover:text-white text-sm transition">Home</Link>
              <Link to="/doctors" className="text-gray-400 hover:text-white text-sm transition">Doctors</Link>
              <Link to="/specialties" className="text-gray-400 hover:text-white text-sm transition">Specialties</Link>
              <Link to="/about" className="text-gray-400 hover:text-white text-sm transition">About Us</Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white mb-4">Contact Us</h3>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 text-gray-400 text-sm">
                <FiMail size={14} className="text-blue-400" />
                <span>support@medibook.com</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400 text-sm">
                <FiPhone size={14} className="text-blue-400" />
                <span>01000000000</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400 text-sm">
                <FiMapPin size={14} className="text-blue-400" />
                <span>Cairo, Egypt</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">© 2026 MediBook — All rights reserved</p>
          <div className="flex gap-6">
            <Link to="/privacy" className="text-gray-500 hover:text-white text-sm transition">Privacy Policy</Link>
            <Link to="/terms" className="text-gray-500 hover:text-white text-sm transition">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer