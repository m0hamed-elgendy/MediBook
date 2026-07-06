import React, { useState, useEffect } from 'react'
import doctorService from '../../services/doctor.service'
import { useToast } from '../../context/ToastContext'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Skeleton from '../../components/ui/Skeleton'
import ErrorState from '../../components/ui/ErrorState'
import { FiClock, FiPlus, FiTrash2, FiCalendar } from 'react-icons/fi'

const DAYS_OF_WEEK = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
]

const Schedule = () => {
    const { addToast } = useToast()
    const [doctorProfile, setDoctorProfile] = useState(null)
    const [availability, setAvailability] = useState([])
    const [sessionDuration, setSessionDuration] = useState(20)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [isSaving, setIsSaving] = useState(false)

    // Form for adding slot
    const [newDay, setNewDay] = useState('Monday')
    const [newFrom, setNewFrom] = useState('09:00')
    const [newTo, setNewTo] = useState('17:00')

    const fetchProfile = async () => {
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
    }

    useEffect(() => {
        fetchProfile()
    }, [])

    const handleAddSlot = (e) => {
        e.preventDefault()

        // Validation
        const [fromH, fromM] = newFrom.split(':').map(Number)
        const [toH, toM] = newTo.split(':').map(Number)
        const fromTotal = fromH * 60 + fromM
        const toTotal = toH * 60 + toM

        if (fromTotal >= toTotal) {
            addToast('The start time must be before the end time.', 'error')
            return
        }

        // Add
        const newSlot = { day: newDay, from: newFrom, to: newTo }
        setAvailability(prev => [...prev, newSlot])
        addToast('Time slot added. Click save to apply changes.')
    }

    const handleRemoveSlot = (index) => {
        setAvailability(prev => prev.filter((_, i) => i !== index))
        addToast('Time slot removed. Click save to apply changes.')
    }

    const handleSave = async () => {
        if (!doctorProfile) return
        try {
            setIsSaving(true)
            await doctorService.update(doctorProfile._id, {
                availability,
                sessionDuration: Number(sessionDuration)
            })
            addToast('Weekly schedule availability updated successfully!')
        } catch (err) {
            console.error(err)
            addToast('Failed to update weekly availability schedule.', 'error')
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-col gap-1.5">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Weekly Schedule</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Configure your weekly consultation availabilities and session duration.
                </p>
            </div>

            {error ? (
                <ErrorState message={error} onRetry={fetchProfile} />
            ) : loading ? (
                <div className="space-y-4">
                    <Skeleton variant="rectangular" height={120} />
                    <Skeleton variant="rectangular" height={220} />
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left: Configuration Form */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Session Duration Card */}
                        <div className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-xl p-5 space-y-4 shadow-sm">
                            <h3 className="text-sm font-bold text-gray-850 dark:text-gray-200">Consultation Config</h3>
                            <Input
                                type="number"
                                label="Session Duration (Minutes)"
                                value={sessionDuration}
                                onChange={(e) => setSessionDuration(e.target.value)}
                                min={5}
                                max={120}
                                required
                            />
                            <p className="text-[10px] text-gray-400 leading-normal">
                                Determines the length of each appointment slot booked by patients.
                            </p>
                        </div>

                        {/* Add Availability Slot */}
                        <form onSubmit={handleAddSlot} className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-xl p-5 space-y-4 shadow-sm">
                            <h3 className="text-sm font-bold text-gray-850 dark:text-gray-200">Add Time Slot</h3>
                            
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Day of Week</label>
                                <select
                                    value={newDay}
                                    onChange={(e) => setNewDay(e.target.value)}
                                    className="w-full px-3.5 py-2 text-sm rounded-lg border border-gray-300 bg-white text-gray-800 focus:outline-none focus:border-blue-500 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-200"
                                >
                                    {DAYS_OF_WEEK.map(d => (
                                        <option key={d} value={d}>{d}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <Input
                                    type="time"
                                    label="From"
                                    value={newFrom}
                                    onChange={(e) => setNewFrom(e.target.value)}
                                    required
                                />
                                <Input
                                    type="time"
                                    label="To"
                                    value={newTo}
                                    onChange={(e) => setNewTo(e.target.value)}
                                    required
                                />
                            </div>

                            <Button type="submit" variant="secondary" size="sm" className="w-full" icon={FiPlus}>
                                Add Slot
                            </Button>
                        </form>
                    </div>

                    {/* Right: Availability List View */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-xl p-5 shadow-sm flex flex-col min-h-[350px]">
                            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3 mb-4">
                                <h3 className="text-sm font-bold text-gray-850 dark:text-gray-200 flex items-center gap-1.5">
                                    <FiCalendar /> Weekly Availability List
                                </h3>
                                <Button
                                    variant="primary"
                                    size="sm"
                                    isLoading={isSaving}
                                    onClick={handleSave}
                                >
                                    Save Schedule
                                </Button>
                            </div>

                            {availability.length === 0 ? (
                                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-gray-400">
                                    <FiClock size={36} className="mb-2" />
                                    <p className="text-xs font-semibold">No schedule configured.</p>
                                    <p className="text-[10px] text-gray-400">Use the form to add weekly time slots.</p>
                                </div>
                            ) : (
                                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                                    {availability.map((slot, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between p-3.5 bg-gray-50/70 dark:bg-gray-850 border border-gray-100 dark:border-gray-800 rounded-xl animate-in slide-in-from-top-1 fade-in duration-200"
                                        >
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                                                <span className="text-xs font-bold text-gray-800 dark:text-gray-250 w-24">
                                                    {slot.day}
                                                </span>
                                                <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 flex items-center gap-1">
                                                    <FiClock size={12} /> {slot.from} — {slot.to}
                                                </span>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleRemoveSlot(index)}
                                                className="!p-1 text-red-500 hover:bg-red-50"
                                            >
                                                <FiTrash2 size={15} />
                                            </Button>
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
