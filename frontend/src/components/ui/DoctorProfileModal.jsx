import React, { useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX } from 'react-icons/fi'
import { Star } from 'lucide-react'
import Avatar from './Avatar'
import Badge from './Badge'
import Button from './Button'

const FOCUSABLE = 'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

const formatTime = (time) => {
  if (!time) return ''
  const [h, m] = time.split(':').map(Number)
  if (isNaN(h) || isNaN(m)) return time
  const period = h >= 12 ? 'PM' : 'AM'
  const d = h % 12 || 12
  return `${String(d).padStart(2, '0')}:${String(m).padStart(2, '0')} ${period}`
}

const InfoItem = ({ label, value }) => (
  <div>
    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</p>
    <p className="text-sm font-medium text-gray-900 mt-1.5">{value}</p>
  </div>
)

const DoctorProfileModal = ({
  isOpen,
  onClose,
  doctor,
  onEdit,
  onDeactivate,
}) => {
  const modalRef = useRef(null)
  const prevFocus = useRef(null)

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') { onClose(); return }
    if (e.key !== 'Tab' || !modalRef.current) return
    const focusable = modalRef.current.querySelectorAll(FOCUSABLE)
    if (!focusable.length) return
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus() }
    } else {
      if (document.activeElement === last) { e.preventDefault(); first.focus() }
    }
  }, [onClose])

  useEffect(() => {
    if (!isOpen) return
    prevFocus.current = document.activeElement
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)
    requestAnimationFrame(() => {
      if (modalRef.current) {
        const el = modalRef.current.querySelector(FOCUSABLE)
        if (el) el.focus()
      }
    })
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
      if (prevFocus.current?.focus) prevFocus.current.focus()
    }
  }, [isOpen, handleKeyDown])

  if (!doctor) return null

  const { user, specialty, bio, phone, address, consultationPrice, sessionDuration, averageRating, reviewsCount, services, symptoms, availability } = doctor
  const name = user?.name || 'Unknown Doctor'
  const email = user?.email || ''
  const img = user?.profileImage || ''
  const isActive = user?.isActive !== false
  const rating = averageRating || 0
  const rCount = reviewsCount || 0

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-label="Doctor Profile"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="relative w-full max-w-[700px] bg-white rounded-2xl shadow-xl border border-gray-100 flex flex-col max-h-[90vh] overflow-hidden"
          >
            <button
              onClick={onClose}
              className="absolute top-5 right-5 z-10 p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-200"
              aria-label="Close modal"
            >
              <FiX size={18} />
            </button>

            <div className="overflow-y-auto flex-1 p-6 sm:p-8 space-y-7">

              <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                <Avatar src={img} name={name} size="2xl" className="shrink-0" />
                <div className="min-w-0 flex-1">
                  <h2 className="text-xl font-bold text-gray-900 truncate">
                    Dr. {name}
                  </h2>
                  {email && (
                    <p className="text-sm text-gray-500 mt-0.5 truncate">{email}</p>
                  )}
                  <div className="flex flex-wrap items-center gap-3 mt-2.5">
                    <Badge variant="info">{specialty}</Badge>
                    <div className="flex items-center gap-1">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Star
                            key={i}
                            size={14}
                            className={i <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'}
                            strokeWidth={0}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-semibold text-gray-800 ml-1">
                        {rating ? rating.toFixed(1) : '—'}
                      </span>
                      <span className="text-xs text-gray-400">
                        ({rCount} review{rCount !== 1 ? 's' : ''})
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <section>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2.5">
                  Biography
                </p>
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {bio || <span className="italic text-gray-400">No bio listed.</span>}
                  </p>
                </div>
              </section>

              <section>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  Information
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                  <InfoItem label="Phone" value={phone || '—'} />
                  <InfoItem label="Address" value={address || '—'} />
                  <InfoItem label="Consultation Fee" value={consultationPrice ? `${consultationPrice} EGP` : '—'} />
                  <InfoItem label="Experience" value="—" />
                  <InfoItem label="Session Duration" value={sessionDuration ? `${sessionDuration} min` : '—'} />
                  <InfoItem label="Average Rating" value={rating ? `${rating.toFixed(1)} / 5` : '—'} />
                </div>
              </section>

              {services?.length > 0 && (
                <section>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                    Services
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {services.map((srv, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border border-indigo-200 bg-indigo-50 text-indigo-700"
                      >
                        {srv}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {symptoms?.length > 0 && (
                <section>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                    Symptoms Treated
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {symptoms.map((sym, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border border-emerald-200 bg-emerald-50 text-emerald-700"
                      >
                        {sym}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              <section>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  Availability
                </p>
                {availability?.length > 0 ? (
                  <div className="space-y-1.5">
                    {availability.map((slot, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between py-2.5 px-4 bg-gray-50 border border-gray-100 rounded-lg"
                      >
                        <span className="text-sm font-medium text-gray-900">{slot.day}</span>
                        <span className="text-sm text-gray-500">
                          {formatTime(slot.from)} - {formatTime(slot.to)}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm italic text-gray-400">No availability set.</p>
                )}
              </section>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2.5 px-6 sm:px-8 py-4 border-t border-gray-100 bg-white shrink-0">
              <Button variant="ghost" size="sm" onClick={onClose}>
                Close
              </Button>
              <Button variant="outline" size="sm" onClick={onEdit}>
                Edit Doctor
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onDeactivate}
                disabled={!isActive}
                className={isActive ? '!border-rose-300 !text-rose-600 hover:!bg-rose-50' : ''}
              >
                {isActive ? 'Deactivate Doctor' : 'Deactivated'}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default DoctorProfileModal
