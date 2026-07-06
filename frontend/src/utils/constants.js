export const ROLES = {
  ADMIN: 'admin',
  DOCTOR: 'doctor',
  PATIENT: 'patient',
}

export const APPOINTMENT_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
}

export const APPLICATION_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
}

export const SPECIALTIES = [
  'Cardiology',
  'Dermatology',
  'Orthopedics',
  'Pediatrics',
  'ENT',
  'Neurology',
  'General Medicine',
  'Ophthalmology',
  'Psychiatry',
  'Gynecology',
]

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
}

export const DAYS_OF_WEEK = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday',
]

export const STATUS_COLORS = {
  pending: { bg: '#FFF7ED', color: '#C2410C', label: 'PENDING' },
  confirmed: { bg: '#EFF6FF', color: '#1D4ED8', label: 'CONFIRMED' },
  completed: { bg: '#F0FDF4', color: '#15803D', label: 'COMPLETED' },
  cancelled: { bg: '#FEF2F2', color: '#DC2626', label: 'CANCELLED' },
}

export const ERROR_MESSAGES = {
  NETWORK: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'Session expired. Please login again.',
  NOT_FOUND: 'Resource not found.',
  SERVER: 'Server error. Please try again later.',
}
