import { useState, useEffect, useCallback } from 'react'
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

// Normalizes any time format to a standardized 12-Hour format: "09:00 AM" or "05:00 PM"
const ensure12Hour = (timeStr) => {
    if (!timeStr) return ''
    const trimmed = timeStr.trim()
    
    // Check if already in 12-hour format with AM/PM
    if (trimmed.toLowerCase().includes('am') || trimmed.toLowerCase().includes('pm')) {
        const parts = trimmed.split(/\s+/)
        if (parts.length === 2) {
            const timePart = parts[0]
            const [h, m] = timePart.split(':')
            const hours = parseInt(h, 10)
            const minutes = parseInt(m, 10)
            if (!isNaN(hours) && !isNaN(minutes)) {
                return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${parts[1].toUpperCase()}`
            }
            return `${parts[0]} ${parts[1].toUpperCase()}`
        }
        return trimmed.toUpperCase()
    }
    
    // Parse 24-hour format
    const [hStr, mStr] = trimmed.split(':')
    let h = parseInt(hStr, 10)
    let m = parseInt(mStr, 10)
    if (isNaN(h) || isNaN(m)) return trimmed
    
    const period = h >= 12 ? 'PM' : 'AM'
    h = h % 12 || 12
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')} ${period}`
}

// Normalizes any time format to standard 24-Hour format for HTML5 time input: "HH:mm"
const ensure24Hour = (timeStr) => {
    if (!timeStr) return '09:00'
    const trimmed = timeStr.trim()
    
    // Check if it is already in 24-hour style and does not have AM/PM
    if (!trimmed.toLowerCase().includes('am') && !trimmed.toLowerCase().includes('pm')) {
        const [h, m] = trimmed.split(':')
        const hours = parseInt(h, 10)
        const minutes = parseInt(m, 10)
        if (!isNaN(hours) && !isNaN(minutes)) {
            return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
        }
        return trimmed
    }
    
    // Parse 12-hour format: "09:00 AM" or "5:00 PM"
    const match = trimmed.match(/^(\d{1,2}):(\d{2})\s*(AM|PM|am|pm)$/i)
    if (!match) return trimmed
    
    let hours = parseInt(match[1], 10)
    const minutes = match[2]
    const period = match[3].toUpperCase()
    
    if (period === 'PM' && hours !== 12) {
        hours += 12
    } else if (period === 'AM' && hours === 12) {
        hours = 0
    }
    
    return `${String(hours).padStart(2, '0')}:${minutes}`
}

const Schedule = () => {
    const { addToast } = useToast()
    const [doctorProfile, setDoctorProfile] = useState(null)
    const [availability, setAvailability] = useState([])
    const [sessionDuration, setSessionDuration] = useState(20)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [isSaving, setIsSaving] = useState(false)

    // Form inputs state (stored as 24h internally for the time input elements)
    const [newDay, setNewDay] = useState('Monday')
    const [newFrom, setNewFrom] = useState('09:00')
    const [newTo, setNewTo] = useState('17:00')
    
    // Edit state
    const [editingIndex, setEditingIndex] = useState(null)

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
            setError('Failed to fetch doctor schedule profile. Ensure you have submitted/approved a doctor application.')
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
                    setError('Failed to fetch doctor schedule profile. Ensure you have submitted/approved a doctor application.')
                }
            } finally {
                if (active) setLoading(false)
            }
        }
        load()
        return () => { active = false }
    }, [])

    // Compute whether there are any unsaved changes compared to the loaded profile
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
            addToast('Weekly availability schedule saved successfully!', 'success')
            // Refetch schedule to keep UI synchronized with backend
            await fetchProfile()
        } catch (err) {
            console.error(err)
            addToast('Failed to save weekly availability schedule.', 'error')
        } finally {
            setIsSaving(false)
        }
    }

    const handleAddSlot = (e) => {
        e.preventDefault()

        const from24 = ensure24Hour(newFrom)
        const to24 = ensure24Hour(newTo)
        const [fromH, fromM] = from24.split(':').map(Number)
        const [toH, toM] = to24.split(':').map(Number)
        const fromTotal = fromH * 60 + fromM
        const toTotal = toH * 60 + toM

        if (fromTotal >= toTotal) {
            addToast('The start time must be before the end time.', 'error')
            return
        }

        if (editingIndex !== null) {
            const updated = [...availability]
            updated[editingIndex] = {
                day: newDay,
                from: ensure12Hour(newFrom),
                to: ensure12Hour(newTo)
            }
            setAvailability(updated)
            setEditingIndex(null)
            addToast('Time slot updated locally. Click Save Schedule to persist changes.', 'info')
        } else {
            const newSlot = {
                day: newDay,
                from: ensure12Hour(newFrom),
                to: ensure12Hour(newTo)
            }
            setAvailability(prev => [...prev, newSlot])
            addToast('Time slot added locally. Click Save Schedule to persist changes.', 'info')
        }

        // Reset inputs
        setNewDay('Monday')
        setNewFrom('09:00')
        setNewTo('17:00')
    }

    const handleEditSlot = (index) => {
        const slot = availability[index]
        setNewDay(slot.day)
        setNewFrom(ensure24Hour(slot.from))
        setNewTo(ensure24Hour(slot.to))
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
        if (editingIndex === index) {
            setEditingIndex(null)
        }
        addToast('Time slot removed locally. Click Save Schedule to persist changes.', 'info')
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-xl font-semibold tracking-tight text-gray-900">Weekly Schedule</h1>
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
                        {/* Consultation Duration card */}
                        <div className="bg-white rounded-xl border border-gray-150 p-6 space-y-4 shadow-sm">
                            <div className="flex items-center gap-2">
                                <Timer size={16} className="text-gray-400" />
                                <h3 className="text-sm font-medium text-gray-900">Consultation Config</h3>
                            </div>
                            
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-gray-700">Duration</label>
                                <div className="relative flex items-center max-w-[120px]">
                                    <input
                                        type="number"
                                        value={sessionDuration}
                                        onChange={(e) => setSessionDuration(e.target.value)}
                                        min={5}
                                        max={120}
                                        className="w-full h-11 pl-4 pr-12 text-sm cursor-text rounded-xl border border-gray-200 bg-white text-gray-900 shadow-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    />
                                    <span className="absolute right-4 text-xs font-semibold text-gray-400 pointer-events-none select-none">
                                        min
                                    </span>
                                </div>
                            </div>
                            <p className="text-xs text-gray-400 leading-relaxed">
                                Determines the length of each appointment slot booked by patients.
                            </p>
                        </div>

                        {/* Add/Edit Slot card */}
                        <form onSubmit={handleAddSlot} className="bg-white rounded-xl border border-gray-150 p-6 space-y-6 shadow-sm">
                            <div className="flex items-center gap-2">
                                <Clock size={16} className="text-gray-400" />
                                <h3 className="text-sm font-medium text-gray-900">
                                    {editingIndex !== null ? 'Edit Time Slot' : 'Add Time Slot'}
                                </h3>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <Select
                                        value={newDay}
                                        onChange={setNewDay}
                                        options={DAYS_OF_WEEK.map(d => ({ value: d, label: d }))}
                                        label="Day"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-sm font-medium text-gray-700">From</label>
                                        <input
                                            type="time"
                                            value={newFrom}
                                            onChange={(e) => setNewFrom(e.target.value)}
                                            required
                                            className="w-full min-w-[130px] h-11 pl-3 pr-1.5 text-sm cursor-text rounded-xl border border-gray-200 bg-white text-gray-900 shadow-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-sm font-medium text-gray-700">To</label>
                                        <input
                                            type="time"
                                            value={newTo}
                                            onChange={(e) => setNewTo(e.target.value)}
                                            required
                                            className="w-full min-w-[130px] h-11 pl-3 pr-1.5 text-sm cursor-text rounded-xl border border-gray-200 bg-white text-gray-900 shadow-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                        />
                                    </div>
                                </div>
                                
                                <div className="flex gap-2 pt-2">
                                    {editingIndex !== null ? (
                                        <>
                                            <Button type="submit" variant="primary" className="flex-1 h-11" icon={Plus}>
                                                Save Slot
                                            </Button>
                                            <Button type="button" variant="outline" onClick={handleCancelEdit} className="flex-1 h-11" icon={X}>
                                                Cancel
                                            </Button>
                                        </>
                                    ) : (
                                        <Button type="submit" variant="primary" className="w-full h-11" icon={Plus}>
                                            Add Slot
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Availability List card */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl border border-gray-150 p-6 shadow-sm">
                            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-2">
                                <div className="flex items-center gap-2">
                                    <Calendar size={16} className="text-gray-400" />
                                    <h3 className="text-sm font-medium text-gray-900">Weekly Availability</h3>
                                </div>
                                <Button
                                    variant="primary"
                                    size="sm"
                                    disabled={!hasChanges}
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
                                    {availability.map((slot, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between py-3.5 hover:bg-slate-50/50 px-2 rounded-lg transition-colors duration-150"
                                        >
                                            <div className="flex items-center gap-3 text-sm text-gray-900">
                                                <span className="font-semibold text-gray-800 w-24 shrink-0">
                                                    {slot.day}
                                                </span>
                                                <span className="text-gray-300">|</span>
                                                <span className="text-gray-500 flex items-center gap-1.5 font-medium">
                                                    <Clock size={13} className="text-gray-400 shrink-0" />
                                                    {ensure12Hour(slot.from)} → {ensure12Hour(slot.to)}
                                                </span>
                                            </div>
                                            
                                            <div className="flex items-center gap-1">
                                                <button
                                                    type="button"
                                                    onClick={() => handleEditSlot(index)}
                                                    className="p-1.5 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-colors duration-150 cursor-pointer"
                                                    title="Edit slot"
                                                >
                                                    <Pencil size={14} />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveSlot(index)}
                                                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors duration-150 cursor-pointer"
                                                    title="Remove slot"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
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
