import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Appointments', path: '/appointments' },
    { name: 'Doctors', path: '/doctors' },
    { name: 'Services', path: '/services' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-[0_4px_30px_rgba(0,0,0,0.03)] transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-teal-400 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform duration-300">
              M
            </div>
            <span className="font-bold text-2xl tracking-tight text-gray-900">
              Medi<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-400">Book</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`relative px-1 py-2 text-sm font-medium transition-colors duration-300 ${
                  location.pathname === link.path
                    ? 'text-blue-600'
                    : 'text-gray-600 hover:text-blue-600'
                } group`}
              >
                {link.name}
                <span className={`absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-blue-600 to-teal-400 rounded-full transition-transform duration-300 origin-left ${
                  location.pathname === link.path ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                }`}></span>
              </Link>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="text-gray-600 hover:text-blue-600 font-medium text-sm transition-colors duration-300"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-600 to-teal-400 text-white font-medium text-sm shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all duration-300"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
