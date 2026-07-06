import { FiStar } from 'react-icons/fi'

const SPECIALTY_COLORS = {
    'Cardiology': '#3B82F6',
    'Dermatology': '#10B981',
    'Pediatrics': '#F59E0B',
    'Orthopedics': '#EF4444',
    'Neurology': '#EC4899',
    'Others': '#8B5CF6',
}

const TopDoctorsTable = ({ doctors = [] }) => {
    const displayDoctors = doctors.length > 0 ? doctors : [
        { name: 'Dr. Ahmed Ali', specialty: 'Cardiology', appointments: 18, rating: 4.9 },
        { name: 'Dr. Sara Mohamed', specialty: 'Dermatology', appointments: 15, rating: 4.8 },
        { name: 'Dr. Mohamed Hassan', specialty: 'Orthopedics', appointments: 12, rating: 4.7 },
        { name: 'Dr. Noha Ahmed', specialty: 'Pediatrics', appointments: 10, rating: 4.6 },
        { name: 'Dr. Mostafa Yehia', specialty: 'Neurology', appointments: 8, rating: 4.5 },
    ]

    return (
        <div className="admin-chart-card admin-table-card">
            <div className="admin-chart-header">
                <h3 className="admin-chart-title">Top Doctors</h3>
                <button className="admin-view-all-btn">View All</button>
            </div>

            <div className="admin-table-wrapper">
                <table className="admin-top-doctors-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Doctor</th>
                            <th>Specialty</th>
                            <th>Appointments</th>
                            <th>Rating</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayDoctors.map((doctor, index) => (
                            <tr key={index}>
                                <td className="admin-table-rank">{index + 1}</td>
                                <td>
                                    <div className="admin-doctor-cell">
                                        <div
                                            className="admin-doctor-avatar"
                                            style={{
                                                background: Object.values(SPECIALTY_COLORS)[index % 6],
                                            }}
                                        >
                                            {doctor.name.split(' ').slice(1).map(n => n[0]).join('').slice(0, 2)}
                                        </div>
                                        <span className="admin-doctor-name">{doctor.name}</span>
                                    </div>
                                </td>
                                <td>
                                    <span
                                        className="admin-specialty-badge"
                                        style={{
                                            backgroundColor: `${SPECIALTY_COLORS[doctor.specialty] || '#8B5CF6'}18`,
                                            color: SPECIALTY_COLORS[doctor.specialty] || '#8B5CF6',
                                        }}
                                    >
                                        {doctor.specialty}
                                    </span>
                                </td>
                                <td className="admin-table-appointments">{doctor.appointments}</td>
                                <td>
                                    <div className="admin-rating-cell">
                                        <span>{doctor.rating}</span>
                                        <FiStar className="admin-rating-star" />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default TopDoctorsTable
