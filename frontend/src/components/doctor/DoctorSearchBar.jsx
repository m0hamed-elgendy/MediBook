import { FiSearch } from 'react-icons/fi'

const DoctorSearchBar = ({
    search,
    setSearch,
}) => {
    return (
        <div className="bg-white rounded-3xl shadow-sm border p-4">

            <div className="flex flex-col lg:flex-row gap-4">

                <div className="relative flex-1">

                    <FiSearch
                        className="
                            absolute
                            left-4
                            top-1/2
                            -translate-y-1/2
                            text-gray-400
                        "
                    />

                    <input
                        type="text"
                        placeholder="Search by doctor name, specialty, or service..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="
                            w-full
                            border
                            rounded-xl
                            py-3
                            pl-12
                            pr-4
                            outline-none
                            focus:border-blue-500
                        "
                    />

                </div>

                <button
                    className="
                        px-8
                        py-3
                        bg-blue-600
                        text-white
                        rounded-xl
                        hover:bg-blue-700
                        transition
                    "
                >
                    Search
                </button>

            </div>

        </div>
    )
}

export default DoctorSearchBar