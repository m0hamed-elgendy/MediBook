import {LayoutDashboard,Users,Stethoscope,FileCheck,CalendarDays,Star,Settings,} from 'lucide-react'

export const adminNavigation  = [
    {
        title: 'Dashboard',
        path: '/admin/dashboard',
        icon: LayoutDashboard,
    },
    {
        title: 'Users',
        path: '/admin/users',
        icon: Users,
    },
    {
        title: 'Doctors',
        path: '/admin/doctors',
        icon: Stethoscope,
    },
    {
        title: 'Applications',
        path: '/admin/applications',
        icon: FileCheck,
        badge: 3,
    },
    {
        title: 'Appointments',
        path: '/admin/appointments',
        icon: CalendarDays,
    },
    {
        title: 'Reviews',
        path: '/admin/reviews',
        icon: Star,
    },
    {
        title: 'Settings',
        path: '/admin/settings',
        icon: Settings,
    },
]