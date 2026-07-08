import { useState, useEffect, useCallback } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { FiStar, FiMapPin, FiDollarSign, FiChevronLeft, FiChevronRight, FiX } from 'react-icons/fi'
import doctorService from '../../services/doctor.service'
import Select from '../../components/ui/Select'

const SPECIALTIES = ['Cardiology', 'Dermatology', 'Orthopedics', 'Pediatrics', 'ENT', 'Neurology']

const DoctorSearch = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const [doctors, setDoctors] = useState([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [total, setTotal] = useState(0)

    const [specialty, setSpecialty] = useState(searchParams.get('specialty') || '')
    const [search, setSearch] = useState('')

    const fetchDoctors = useCallback(async () => {
        try {
            setLoading(true)
            const params = { page, limit: 10 }
            if (specialty) params.specialty = specialty
            if (search) params.search = search

            const response = await doctorService.getDoctors(params)
            setDoctors(response.data || [])
            setTotal(response.total || 0)
            setTotalPages(response.totalPages || 1)
        } catch (err) {
            console.error('Error fetching doctors:', err)
            setDoctors([])
        } finally {
            setLoading(false)
        }
    }, [page, specialty, search])

    useEffect(() => {
        fetchDoctors()
    }, [fetchDoctors])

    const handleApplyFilters = () => {
        setPage(1)
        fetchDoctors()
    }

    const handleClearFilters = () => {
        setSpecialty('')
        setSearch('')
        setPage(1)
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="flex flex-col md:flex-row gap-8">

                    {/* Sidebar Filters */}
                    <aside className="w-full md:w-72 shrink-0">
                        <div className="bg-white rounded-2xl p-6 border border-gray-100 sticky top-24">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-bold text-gray-800">Filters</h2>
                                <button onClick={handleClearFilters}
                                    className="text-blue-600 text-xs font-semibold hover:underline cursor-pointer">
                                    Clear all
                                </button>
                            </div>

                            {/* Specialty */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-600 mb-2">Specialty</label>
                                <Select
                                    value={specialty}
                                    onChange={setSpecialty}
                                    options={[
                                        { value: '', label: 'All Specialties' },
                                        ...SPECIALTIES.map(s => ({ value: s, label: s })),
                                    ]}
                                    placeholder="All Specialties"
                                />
                            </div>

                            {/* Doctor Name Search */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-600 mb-2">Doctor Name</label>
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search by name..."
                                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                                />
                            </div>

                            <button
                                onClick={handleApplyFilters}
                                className="w-full bg-blue-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition cursor-pointer"
                            >
                                Apply Filters
                            </button>
                        </div>
                    </aside>

                    {/* Main Area */}
                    <section className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-3">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">
                                    {loading ? 'Searching...' : `Found ${total} Doctors`}
                                </h1>
                                <p className="text-gray-500 text-sm">Book appointments with top-rated medical specialists</p>
                            </div>
                        </div>

                        {/* Doctor Grid */}
                        {loading ? (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-10">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 animate-pulse flex gap-4">
                                        <div className="w-20 h-20 bg-gray-200 rounded-xl shrink-0"></div>
                                        <div className="flex-1 space-y-2">
                                            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                            <div className="h-8 bg-gray-200 rounded w-full mt-3"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : doctors.length === 0 ? (
                            <div className="text-center bg-white border border-gray-100 rounded-2xl py-16 px-6">
                                <p className="text-gray-500 font-semibold mb-1">No doctors found</p>
                                <p className="text-gray-400 text-sm mb-4">Try adjusting your filters</p>
                                <button onClick={handleClearFilters}
                                    className="px-5 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold cursor-pointer">
                                    Clear Filters
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-10">
                                {doctors.map(doc => (
                                    <div key={doc._id}
                                        className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-lg hover:-translate-y-0.5 transition-all flex gap-4">

                                        <div className="w-20 h-20 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 overflow-hidden">
                                            {doc.user?.profileImage ? (
                                                <img src={doc.user.profileImage} alt={doc.user.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-blue-600 font-bold text-2xl">
                                                    {doc.user?.name?.charAt(0).toUpperCase() || 'D'}
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex-1 flex flex-col justify-between">
                                            <div>
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h3 className="font-bold text-gray-800">{doc.user?.name}</h3>
                                                        <p className="text-blue-600 text-sm font-medium">{doc.specialty}</p>
                                                    </div>
                                                    <span className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-1 rounded-lg text-xs font-semibold shrink-0">
                                                        <FiStar className="fill-amber-500 text-amber-500" size={12} />
                                                        {doc.averageRating || '0.0'}
                                                    </span>
                                                </div>

                                                <div className="mt-2 flex flex-wrap gap-2 items-center">
                                                    <span className="flex items-center gap-1 text-gray-500 text-xs">
                                                        <FiDollarSign size={14} /> {doc.consultationPrice} EGP
                                                    </span>
                                                    {doc.isActive && (
                                                        <span className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-0.5 rounded-full text-xs font-medium">
                                                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                                                            Available
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="mt-3 flex gap-2">
                                                <Link to={`/doctors/${doc._id}`}
                                                    className="flex-1 text-center px-3 py-2 border border-blue-200 text-blue-600 rounded-xl text-xs font-semibold hover:bg-blue-50 transition">
                                                    View Profile
                                                </Link>
                                                <Link to={`/doctors/${doc._id}?book=true`}
                                                    className="flex-1 text-center px-3 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition">
                                                    Book Now
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Pagination */}
                        {!loading && totalPages > 1 && (
                            <div className="flex justify-center items-center gap-2">
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 hover:border-blue-300 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition"
                                >
                                    <FiChevronLeft />
                                </button>

                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                                    <button
                                        key={p}
                                        onClick={() => setPage(p)}
                                        className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium cursor-pointer transition ${p === page
                                                ? 'bg-blue-600 text-white'
                                                : 'border border-gray-200 text-gray-600 hover:border-blue-300'
                                            }`}
                                    >
                                        {p}
                                    </button>
                                ))}

                                <button
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                    className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 hover:border-blue-300 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition"
                                >
                                    <FiChevronRight />
                                </button>
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </div>
    )
}

export default DoctorSearch