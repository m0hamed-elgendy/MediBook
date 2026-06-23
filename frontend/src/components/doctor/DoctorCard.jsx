import { Link } from 'react-router-dom'
import { FaUserDoctor } from 'react-icons/fa6'

const DoctorCard = ({ doctor }) => {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 p-6 flex flex-col">

            {/* Header */}
            <div className="flex items-center gap-4">

                <div className="w-16 h-16 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center">

                    {doctor.user?.profileImage ? (
                        <img
                            src={doctor.user.profileImage}
                            alt={doctor.user.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <span className="text-xl font-bold text-blue-600">
                            {doctor.user?.name?.charAt(0)}
                        </span>
                    )}

                </div>

                <div>
                    <h3 className="font-bold text-lg text-gray-800">
                        {doctor.user?.name}
                    </h3>

                    <p className="text-blue-600 font-medium">
                        {doctor.specialty}
                    </p>
                </div>

            </div>

            {/* Bio */}
            <p className="mt-4 text-sm text-gray-500 line-clamp-2">
                {doctor.bio}
            </p>

            {/* Address */}
            <p className="mt-3 text-gray-600">
                📍 {doctor.address}
            </p>

            {/* Rating */}
            <div className="mt-3 flex items-center gap-2">

                <span className="text-yellow-500">
                    ⭐
                </span>

                <span className="font-medium">
                    {doctor.averageRating?.toFixed(1) || '0.0'}
                </span>

                <span className="text-sm text-gray-500">
                    ({doctor.reviewsCount || 0} reviews)
                </span>

            </div>

            {/* Service */}
            {doctor.services?.length > 0 && (
                <div className="mt-3">
                    <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">
                        {doctor.services[0]}
                    </span>
                </div>
            )}

            {/* Price */}
            <div className="mt-4">
                <p className="text-lg font-bold text-gray-800">
                    {doctor.consultationPrice} EGP
                </p>
                <p className="text-sm text-gray-500">
                    Consultation Fee
                </p>
            </div>

            {/* Buttons */}
            <div className="mt-auto pt-6 grid grid-cols-2 gap-3">

                <Link
                    to={`/doctors/${doctor._id}`}
                    className="text-center border border-blue-600 text-blue-600 py-2 rounded-xl font-medium hover:bg-blue-50 transition"
                >
                    Profile
                </Link>

                <button
                    className="bg-blue-600 text-white py-2 rounded-xl font-medium hover:bg-blue-700 transition cursor-pointer"
                >
                    Book Now
                </button>

            </div>

        </div>
    )
}

export default DoctorCard