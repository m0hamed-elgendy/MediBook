const AuthBanner = () => {
  return (
<div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-blue-900 to-blue-500 text-white p-8 w-[45%] min-h-screen">
      {/* Text */}
      <div className="pt-8">
        <h1 className="text-3xl font-bold leading-tight mb-3">
          Your Health, <br />
          <span className="text-yellow-300">Our Priority</span>
        </h1>
        <p className="text-blue-100 text-sm leading-relaxed">
          Book appointments with trusted doctors, manage your visits, and access quality healthcare anytime, anywhere.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white/10 rounded-xl p-3 text-center">
          <div className="text-xl font-bold text-yellow-300">500+</div>
          <div className="text-xs text-blue-100">Doctors</div>
        </div>
        <div className="bg-white/10 rounded-xl p-3 text-center">
          <div className="text-xl font-bold text-yellow-300">50+</div>
          <div className="text-xs text-blue-100">Specialties</div>
        </div>
        <div className="bg-white/10 rounded-xl p-3 text-center">
          <div className="text-xl font-bold text-yellow-300">10K+</div>
          <div className="text-xs text-blue-100">Bookings</div>
        </div>
      </div>

      {/* Image */}
      {/* Image */}
      <div className="flex justify-center">
        <img
          src="/images/healthcare.png"
          alt="Healthcare"
          className="w-100 max-w-xs  object-contain rounded-2xl"
        />
      </div>

    </div>
  )
}

export default AuthBanner