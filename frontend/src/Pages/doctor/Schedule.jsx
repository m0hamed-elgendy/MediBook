import { useState, useEffect, useCallback, useMemo } from 'react'
import doctorService from '../../services/doctor.service'
import { useToast } from '../../context/ToastContext'
import Button from '../../components/ui/Button'
import Skeleton from '../../components/ui/Skeleton'
import ErrorState from '../../components/ui/ErrorState'
import { Clock, Calendar, Trash2, Timer, Plus, Pencil, X } from 'lucide-react'
import Select from '../../components/ui/Select'

const DAYS_OF_WEEK = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
]

const TIME_OPTIONS = []
for (let h = 0; h < 24; h++) {
    const period = h < 12 ? 'AM' : 'PM'
    const displayH = h === 0 ? 12 : h > 12 ? h - 12 : h
    for (const m of ['00', '15', '30', '45']) {
        const value = `${String(h).padStart(2, '0')}:${m}`
        const label = `${displayH}:${m} ${period}`
        TIME_OPTIONS.push({ value, label })
    }
}

const parseToMinutes = (time24) => {
    const [h, m] = time24.split(':').map(Number)
    return h * 60 + m
}

const formatTo12Hour = (time24) => {
    const [hStr, m] = time24.split(':')
    let h = parseInt(hStr, 10)
    const period = h >= 12 ? 'PM' : 'AM'
    h = h % 12 || 12
    return `${h}:${m} ${period}`
}

const Schedule = () => {
    const { addToast } = useToast()
    const [doctorProfile, setDoctorProfile] = useState(null)
    const [availability, setAvailability] = useState([])
    const [sessionDuration, setSessionDuration] = useState(20)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [isSaving, setIsSaving] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const [newDay, setNewDay] = useState('Monday')
    const [newFrom, setNewFrom] = useState('09:00')
    const [newTo, setNewTo] = useState('17:00')
    const [editingIndex, setEditingIndex] = useState(null)

    const fromMinutes = useMemo(() => parseToMinutes(newFrom), [newFrom])
    const toMinutes = useMemo(() => parseToMinutes(newTo), [newTo])

    const timeError = useMemo(() => {
        if (toMinutes <= fromMinutes) return 'End time must be after start time.'
        return ''
    }, [fromMinutes, toMinutes])

    const overlappingError = useMemo(() => {
        return availability.some((slot, i) => {
            if (editingIndex === i) return false
            if (slot.day !== newDay) return false
            const slotFrom = parseToMinutes(slot.from.replace(/(\d+):(\d+).*/, (_, h, m) => {
                const period = slot.from.includes('PM') ? 'PM' : 'AM'
                let hours = parseInt(h, 10)
                if (period === 'PM' && hours !== 12) hours += 12
                if (period === 'AM' && hours === 12) hours = 0
                return `${String(hours).padStart(2, '0')}:${m}`
            }))
            const slotTo = parseToMinutes(slot.to.replace(/(\d+):(\d+).*/, (_, h, m) => {
                const period = slot.to.includes('PM') ? 'PM' : 'AM'
                let hours = parseInt(h, 10)
                if (period === 'PM' && hours !== 12) hours += 12
                if (period === 'AM' && hours === 12) hours = 0
                return `${String(hours).padStart(2, '0')}:${m}`
            }))
            return fromMinutes < slotTo && toMinutes > slotFrom
        })
    }, [availability, newDay, newFrom, newTo, fromMinutes, toMinutes, editingIndex])

    const isSlotValid = !timeError && !overlappingError

    const fetchProfile = useCallback(async () => {
        try {
            setLoading(true)
            setError('')
            const res = await doctorService.getProfile()
            setDoctorProfile(res)
            setAvailability(res.availability || [])
            setSessionDuration(res.sessionDuration || 20)
        } catch (err) {
            console.error(err)
            setError('Failed to fetch doctor schedule profile.')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        let active = true
        const load = async () => {
            try {
                setLoading(true)
                setError('')
                const res = await doctorService.getProfile()
                if (!active) return
                setDoctorProfile(res)
                setAvailability(res.availability || [])
                setSessionDuration(res.sessionDuration || 20)
            } catch (err) {
                if (active) {
                    console.error(err)
                    setError('Failed to fetch doctor schedule profile.')
                }
            } finally {
                if (active) setLoading(false)
            }
        }
        load()
        return () => { active = false }
    }, [])

    const hasChanges =
        JSON.stringify(availability) !== JSON.stringify(doctorProfile?.availability || []) ||
        Number(sessionDuration) !== (doctorProfile?.sessionDuration || 20)

    const handleSave = async () => {
        if (!doctorProfile) return
        try {
            setIsSaving(true)
            await doctorService.update(doctorProfile._id, {
                availability,
                sessionDuration: Number(sessionDuration)
            })
            addToast('Schedule saved successfully!', 'success')
            await fetchProfile()
        } catch (err) {
            console.error(err)
            addToast(err.response?.data?.message || 'Failed to save schedule.', 'error')
        } finally {
            setIsSaving(false)
        }
    }

    const handleAddSlot = async (e) => {
        e.preventDefault()
        if (isSubmitting) return
        if (!isSlotValid) return

        setIsSubmitting(true)
        try {
            if (editingIndex !== null) {
                const updated = [...availability]
                updated[editingIndex] = { day: newDay, from: format24To12(newFrom), to: format24To12(newTo) }
                setAvailability(updated)
                setEditingIndex(null)
                addToast('Slot updated. Save to persist.', 'info')
            } else {
                setAvailability(prev => [...prev, { day: newDay, from: format24To12(newFrom), to: format24To12(newTo) }])
                addToast('Slot added. Save to persist.', 'info')
            }
            setNewDay('Monday')
            setNewFrom('09:00')
            setNewTo('17:00')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleEditSlot = (index) => {
        const slot = availability[index]
        const fromParts = slot.from.match(/(\d+):(\d+)\s*(AM|PM)/i)
        const toParts = slot.to.match(/(\d+):(\d+)\s*(AM|PM)/i)
        if (fromParts) {
            let h = parseInt(fromParts[1], 10)
            if (fromParts[3].toUpperCase() === 'PM' && h !== 12) h += 12
            if (fromParts[3].toUpperCase() === 'AM' && h === 12) h = 0
            setNewFrom(`${String(h).padStart(2, '0')}:${fromParts[2]}`)
        }
        if (toParts) {
            let h = parseInt(toParts[1], 10)
            if (toParts[3].toUpperCase() === 'PM' && h !== 12) h += 12
            if (toParts[3].toUpperCase() === 'AM' && h === 12) h = 0
            setNewTo(`${String(h).padStart(2, '0')}:${toParts[2]}`)
        }
        setNewDay(slot.day)
        setEditingIndex(index)
    }

    const handleCancelEdit = () => {
        setEditingIndex(null)
        setNewDay('Monday')
        setNewFrom('09:00')
        setNewTo('17:00')
    }

    const handleRemoveSlot = (index) => {
        setAvailability(prev => prev.filter((_, i) => i !== index))
        if (editingIndex === index) setEditingIndex(null)
        addToast('Slot removed. Save to persist.', 'info')
    }

    const format24To12 = (time24) => {
        const [hStr, m] = time24.split(':')
        let h = parseInt(hStr, 10)
        const period = h >= 12 ? 'PM' : 'AM'
        h = h % 12 || 12
        return `${h}:${m} ${period}`
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">Weekly Schedule</h1>
                <p className="text-sm text-gray-500 mt-1">
                    Configure your weekly consultation availabilities and session duration.
                </p>
            </div>

            {error ? (
                <ErrorState message={error} onRetry={fetchProfile} />
            ) : loading ? (
                <div className="space-y-6">
                    <Skeleton variant="rectangular" height={120} />
                    <Skeleton variant="rectangular" height={220} />
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4 shadow-sm">
                            <div className="flex items-center gap-2">
                                <Timer size={16} className="text-gray-400" />
                                <h3 className="text-sm font-semibold text-gray-900">Consultation Config</h3>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-gray-700">
                                    Session Duration <span className="text-red-500">*</span>
                                </label>
                                <div className="relative flex items-center max-w-[140px]">
                                    <input
                                        type="number"
                                        value={sessionDuration}
                                        onChange={(e) => setSessionDuration(e.target.value)}
                                        min={5}
                                        max={120}
                                        className="w-full h-11 pl-4 pr-12 text-sm rounded-xl border border-gray-200 bg-white text-gray-900 shadow-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    />
                                    <span className="absolute right-4 text-xs font-semibold text-gray-400 pointer-events-none select-none">min</span>
                                </div>
                            </div>
                            <p className="text-xs text-gray-400 leading-relaxed">
                                Determines the length of each appointment slot.
                            </p>
                        </div>

                        <form onSubmit={handleAddSlot} className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5 shadow-sm" noValidate>
                            <div className="flex items-center gap-2">
                                <Clock size={16} className="text-gray-400" />
                                <h3 className="text-sm font-semibold text-gray-900">
                                    {editingIndex !== null ? 'Edit Time Slot' : 'Add Time Slot'}
                                </h3>
                            </div>

                            <Select
                                value={newDay}
                                onChange={setNewDay}
                                options={DAYS_OF_WEEK.map(d => ({ value: d, label: d }))}
                                label="Day"
                                required
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-medium text-gray-700">
                                        From <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={newFrom}
                                        onChange={(e) => setNewFrom(e.target.value)}
                                        className="w-full h-11 px-3 text-sm rounded-xl border border-gray-200 bg-white text-gray-900 shadow-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 appearance-none cursor-pointer"
                                    >
                                        {TIME_OPTIONS.map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-medium text-gray-700">
                                        To <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={newTo}
                                        onChange={(e) => setNewTo(e.target.value)}
                                        className="w-full h-11 px-3 text-sm rounded-xl border border-gray-200 bg-white text-gray-900 shadow-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 appearance-none cursor-pointer"
                                    >
                                        {TIME_OPTIONS.map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-1">
                                {timeError && (
                                    <p className="text-xs font-medium text-red-500">{timeError}</p>
                                )}
                                {overlappingError && (
                                    <p className="text-xs font-medium text-red-500">
                                        This slot overlaps with an existing slot for {newDay}.
                                    </p>
                                )}
                            </div>

                            <div className="flex gap-2 pt-1">
                                {editingIndex !== null ? (
                                    <>
                                        <Button type="submit" variant="primary" className="flex-1 h-11" icon={Plus} disabled={!isSlotValid} isLoading={isSubmitting}>
                                            Save Slot
                                        </Button>
                                        <Button type="button" variant="outline" onClick={handleCancelEdit} className="flex-1 h-11" icon={X}>
                                            Cancel
                                        </Button>
                                    </>
                                ) : (
                                    <Button type="submit" variant="primary" className="w-full h-11" icon={Plus} disabled={!isSlotValid} isLoading={isSubmitting}>
                                        Add Slot
                                    </Button>
                                )}
                            </div>
                        </form>
                    </div>

                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-2">
                                <div className="flex items-center gap-2">
                                    <Calendar size={16} className="text-gray-400" />
                                    <h3 className="text-sm font-semibold text-gray-900">Weekly Availability</h3>
                                </div>
                                <Button
                                    variant="primary"
                                    size="sm"
                                    disabled={!hasChanges || isSaving}
                                    isLoading={isSaving}
                                    onClick={handleSave}
                                >
                                    Save Schedule
                                </Button>
                            </div>

                            {availability.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-16 text-center">
                                    <Clock size={28} className="text-gray-300 mb-3" />
                                    <p className="text-sm font-medium text-gray-400">No schedule configured.</p>
                                    <p className="text-xs text-gray-400 mt-1">Use the form to add weekly time slots.</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-100">
                                    {availability.map((slot, index) => {
                                        const slotFromParts = slot.from.match(/(\d+):(\d+)\s*(AM|PM)/i)
                                        const slotToParts = slot.to.match(/(\d+):(\d+)\s*(AM|PM)/i)
                                        let from24 = slot.from
                                        if (slotFromParts) {
                                            let h = parseInt(slotFromParts[1], 10)
                                            if (slotFromParts[3].toUpperCase() === 'PM' && h !== 12) h += 12
                                            if (slotFromParts[3].toUpperCase() === 'AM' && h === 12) h = 0
                                            from24 = `${String(h).padStart(2, '0')}:${slotFromParts[2]}`
                                        }
                                        let to24 = slot.to
                                        if (slotToParts) {
                                            let h = parseInt(slotToParts[1], 10)
                                            if (slotToParts[3].toUpperCase() === 'PM' && h !== 12) h += 12
                                            if (slotToParts[3].toUpperCase() === 'AM' && h === 12) h = 0
                                            to24 = `${String(h).padStart(2, '0')}:${slotToParts[2]}`
                                        }
                                        const fromLabel = TIME_OPTIONS.find(t => t.value === from24)?.label || slot.from
                                        const toLabel = TIME_OPTIONS.find(t => t.value === to24)?.label || slot.to
                                        return (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between py-3.5 hover:bg-gray-50/50 px-2 rounded-lg transition-colors"
                                            >
                                                <div className="flex items-center gap-3 text-sm text-gray-900">
                                                    <span className="font-semibold text-gray-800 w-24 shrink-0">
                                                        {slot.day}
                                                    </span>
                                                    <span className="text-gray-300">|</span>
                                                    <span className="text-gray-500 flex items-center gap-1.5 font-medium">
                                                        <Clock size={13} className="text-gray-400 shrink-0" />
                                                        {fromLabel} - {toLabel}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-1">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleEditSlot(index)}
                                                        className="p-1.5 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-colors cursor-pointer"
                                                        title="Edit slot"
                                                    >
                                                        <Pencil size={14} />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveSlot(index)}
                                                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                                                        title="Remove slot"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Schedule