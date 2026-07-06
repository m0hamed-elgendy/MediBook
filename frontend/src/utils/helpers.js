export const getInitials = (name) => {
  if (!name) return 'U'
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export const getStatusVariant = (status) => {
  const map = {
    pending: 'pending',
    confirmed: 'confirmed',
    completed: 'completed',
    cancelled: 'cancelled',
    active: 'success',
    inactive: 'danger',
    approved: 'success',
    rejected: 'danger',
    admin: 'danger',
    doctor: 'primary',
    patient: 'neutral',
  }
  return map[status] || 'neutral'
}

export const formatCurrency = (amount, currency = 'EGP') => {
  if (amount === undefined || amount === null) return `0 ${currency}`
  return `${Number(amount).toLocaleString()} ${currency}`
}

export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text || ''
  return text.slice(0, maxLength).trimEnd() + '...'
}

export const getAvatarColor = (name) => {
  const colors = [
    'from-blue-500 to-indigo-600',
    'from-emerald-500 to-teal-600',
    'from-orange-500 to-amber-600',
    'from-purple-500 to-pink-600',
    'from-rose-500 to-red-600',
    'from-cyan-500 to-blue-600',
  ]
  let hash = 0
  for (let i = 0; i < (name || '').length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colors[Math.abs(hash) % colors.length]
}

export const generatePageNumbers = (currentPage, totalPages) => {
  if (totalPages <= 1) return []
  const pages = []
  const showMax = 5
  let start = Math.max(1, currentPage - Math.floor(showMax / 2))
  let end = Math.min(totalPages, start + showMax - 1)

  if (end - start + 1 < showMax) {
    start = Math.max(1, end - showMax + 1)
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
}

export const debounce = (fn, delay = 300) => {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

export const classNames = (...classes) => {
  return classes.filter(Boolean).join(' ')
}
