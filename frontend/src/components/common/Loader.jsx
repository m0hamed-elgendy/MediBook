import { FaUserMd } from 'react-icons/fa'

const Loader = () => {
    return (
        <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50">

            {/* Doctor Icon */}
            <div className="w-24 h-24 rounded-full border-4 border-blue-600 flex items-center justify-center mb-8">
                <FaUserMd className="doctor-icon text-5xl text-blue-600" />
            </div>


            <div className="flex items-center justify-center">
                <svg
                    width="220"
                    height="80"
                    viewBox="0 0 220 80"
                >
                    <path
                        d="M0 40 H60 L75 40 L85 15 L100 65 L115 5 L130 40 H220"
                        fill="none"
                        stroke="#d1d5db"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />

                    <circle
                        cx="115"
                        cy="5"
                        r="6"
                        className="pulse-dot"
                    />
                </svg>
            </div>

        </div>
    )
}

export default Loader