import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import uploadService from '../../services/upload.service'
import { useToast } from '../../context/ToastContext'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import Avatar from '../../components/ui/Avatar'
import Textarea from '../../components/ui/Textarea'
import Select from '../../components/ui/Select'
import Skeleton from '../../components/ui/Skeleton'
import doctorService from '../../services/doctor.service'
import { FiUser, FiLock, FiCamera, FiPlus, FiX, FiClock } from 'react-icons/fi'

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

const Profile = () => {
    const { user, updateUser } = useAuth()
    const { addToast } = useToast()
    const isDoctor = user?.role === 'doctor'

    const [activeTab, setActiveTab] = useState('personal')
    const [loading, setLoading] = useState(true)

    const [name, setName] = useState(user?.name || '')
    const [email] = useState(user?.email || '')
    const [phone, setPhone] = useState(user?.phone || '')
    const [avatarUrl, setAvatarUrl] = useState(user?.profileImage || '')

    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const [isSavingDetails, setIsSavingDetails] = useState(false)
    const [isSavingPassword, setIsSavingPassword] = useState(false)
    const [isUploading, setIsUploading] = useState(false)

    const [doctorProfile, setDoctorProfile] = useState(null)
    const [bio, setBio] = useState('')
    const [consultationPrice, setConsultationPrice] = useState(0)
    const [sessionDuration, setSessionDuration] = useState(20)
    const [availability, setAvailability] = useState([])
    const [specialty, setSpecialty] = useState('')

    useEffect(() => {
        if (isDoctor) {
            const loadDoctorProfile = async () => {
                try {
                    const res = await doctorService.getProfile()
                    setDoctorProfile(res)
                    setBio(res.bio || '')
                    setConsultationPrice(res.consultationPrice || 0)
                    setSessionDuration(res.sessionDuration || 20)
                    setAvailability(res.availability || [])
                    setSpecialty(res.specialty || '')
                    setPhone(res.phone || user?.phone || '')
                } catch (err) {
                    console.error(err)
                } finally {
                    setLoading(false)
                }
            }
            loadDoctorProfile()
        } else {
            setLoading(false)
        }
    }, [isDoctor, user?.phone])

    const handleImageUpload = async (e) => {
        const file = e.target.files[0]
        if (!file) return
        try {
            setIsUploading(true)
            const res = await uploadService.uploadProfileImage(file)
            setAvatarUrl(res.profileImage)
            updateUser({ ...user, profileImage: res.profileImage })
            addToast('Profile photo updated!')
        } catch (err) {
            console.error(err)
            addToast('Failed to upload image.', 'error')
        } finally {
            setIsUploading(false)
        }
    }

    const handleSaveDetails = async (e) => {
        e.preventDefault()
        try {
            setIsSavingDetails(true)
            updateUser({ ...user, name, phone })
            if (isDoctor && doctorProfile) {
                await doctorService.update(doctorProfile._id, {
                    bio,
                    consultationPrice: Number(consultationPrice),
                    sessionDuration: Number(sessionDuration),
                    availability,
                    phone,
                    specialty,
                })
            }
            addToast('Profile updated successfully!')
        } catch (err) {
            console.error(err)
            addToast('Failed to update profile.', 'error')
        } finally {
            setIsSavingDetails(false)
        }
    }

    const handleSavePassword = (e) => {
        e.preventDefault()
        if (newPassword !== confirmPassword) {
            addToast('Passwords do not match!', 'error')
            return
        }
        setIsSavingPassword(true)
        setTimeout(() => {
            setIsSavingPassword(false)
            setCurrentPassword('')
            setNewPassword('')
            setConfirmPassword('')
            addToast('Security credentials updated!')
        }, 1000)
    }

    const addAvailabilityRow = () => {
        setAvailability([...availability, { day: '', from: '', to: '' }])
    }

    const removeAvailabilityRow = (index) => {
        setAvailability(availability.filter((_, i) => i !== index))
    }

    const updateAvailability = (index, field, value) => {
        const updated = availability.map((slot, i) =>
            i === index ? { ...slot, [field]: value } : slot
        )
        setAvailability(updated)
    }

    if (loading) {
        return (
            <div className="space-y-6 p-6">
                <Skeleton variant="rectangular" height={400} />
            </div>
        )
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-col gap-1.5">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">My Profile</h1>
                <p className="text-sm text-gray-500">
                    Configure your personal contact details, security credentials, and photo.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-1 flex flex-row md:flex-col gap-1.5 overflow-x-auto pb-2 md:pb-0">
                    <button
                        onClick={() => setActiveTab('personal')}
                        className={`flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold rounded-lg text-left whitespace-nowrap transition-all duration-200 ${
                            activeTab === 'personal'
                                ? 'bg-blue-50 text-blue-700'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                    >
                        <FiUser size={16} />
                        Personal Info
                    </button>
                    {isDoctor && (
                        <button
                            onClick={() => setActiveTab('professional')}
                            className={`flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold rounded-lg text-left whitespace-nowrap transition-all duration-200 ${
                                activeTab === 'professional'
                                    ? 'bg-blue-50 text-blue-700'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                        >
                            <FiClock size={16} />
                            Professional
                        </button>
                    )}
                    <button
                        onClick={() => setActiveTab('security')}
                        className={`flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold rounded-lg text-left whitespace-nowrap transition-all duration-200 ${
                            activeTab === 'security'
                                ? 'bg-blue-50 text-blue-700'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                    >
                        <FiLock size={16} />
                        Security
                    </button>
                </div>

                <div className="md:col-span-3 bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    {activeTab === 'personal' && (
                        <form onSubmit={handleSaveDetails} className="space-y-6 animate-in fade-in duration-200">
                            <div>
                                <h3 className="text-base font-bold text-gray-900 mb-1">Personal Profile</h3>
                                <p className="text-xs text-gray-400">Manage how clinics identify your records.</p>
                            </div>

                            <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                                <div className="relative">
                                    <Avatar src={avatarUrl} name={name} size="xl" />
                                    <label className="absolute bottom-0 right-0 p-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full cursor-pointer shadow-md transition-colors duration-150">
                                        <FiCamera size={12} />
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                            disabled={isUploading}
                                        />
                                    </label>
                                </div>
                                <div className="text-center sm:text-left">
                                    <span className="text-xs font-semibold text-gray-800">Profile Picture</span>
                                    <p className="text-[10px] text-gray-400 mt-1">Supports JPG or PNG. Max size 2MB.</p>
                                    {isUploading && (
                                        <span className="text-xs font-semibold text-blue-600 animate-pulse mt-1.5 block">Uploading photo...</span>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Input
                                    label="Full Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                                <Input
                                    label="Phone Number"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                                <div className="sm:col-span-2">
                                    <Input
                                        type="email"
                                        label="Email Address"
                                        value={email}
                                        disabled
                                        helperText="Email changes require security verification overrides."
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end pt-4 border-t border-gray-100">
                                <Button type="submit" isLoading={isSavingDetails}>
                                    Save Profile
                                </Button>
                            </div>
                        </form>
                    )}

                    {isDoctor && activeTab === 'professional' && (
                        <form onSubmit={handleSaveDetails} className="space-y-6 animate-in fade-in duration-200">
                            <div>
                                <h3 className="text-base font-bold text-gray-900 mb-1">Professional Settings</h3>
                                <p className="text-xs text-gray-400">Manage your medical practice details and availability.</p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Input
                                    label="Specialty"
                                    value={specialty}
                                    onChange={(e) => setSpecialty(e.target.value)}
                                    required
                                />
                                <Input
                                    label="Consultation Fee ($)"
                                    type="number"
                                    value={consultationPrice}
                                    onChange={(e) => setConsultationPrice(e.target.value)}
                                    min={0}
                                />
                                <Input
                                    label="Session Duration (minutes)"
                                    type="number"
                                    value={sessionDuration}
                                    onChange={(e) => setSessionDuration(e.target.value)}
                                    min={5}
                                    helperText="Default: 20 minutes per session"
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <Textarea
                                    label="Biography"
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    placeholder="Brief background, credentials, and achievements..."
                                    rows={4}
                                />
                            </div>

                            <div className="pt-4 border-t border-gray-100">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-800">Availability Schedule</h4>
                                        <p className="text-xs text-gray-400">Set your weekly working days and hours.</p>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={addAvailabilityRow}
                                        icon={FiPlus}
                                    >
                                        Add Day
                                    </Button>
                                </div>

                                {availability.length === 0 ? (
                                    <div className="p-4 border border-dashed border-gray-200 rounded-xl text-center text-xs text-gray-400">
                                        No availability set. Click "Add Day" to configure your weekly schedule.
                                    </div>
                                ) : (
                                    <div className="space-y-2.5">
                                        {availability.map((slot, index) => (
                                            <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                                                <div className="flex-1">
                                                    <Select
                                                        value={slot.day}
                                                        onChange={(val) => updateAvailability(index, 'day', val)}
                                                        options={[
                                                            { value: '', label: 'Select day' },
                                                            ...DAYS.map(d => ({ value: d, label: d })),
                                                        ]}
                                                        placeholder="Day"
                                                    />
                                                </div>
                                                <div className="w-28">
                                                    <input
                                                        type="text"
                                                        value={slot.from}
                                                        onChange={(e) => updateAvailability(index, 'from', e.target.value)}
                                                        placeholder="09:00 AM"
                                                        className="w-full h-11 px-3 text-sm rounded-xl border border-gray-200 bg-white text-gray-900 shadow-sm placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                                    />
                                                </div>
                                                <span className="text-xs text-gray-400 shrink-0">to</span>
                                                <div className="w-28">
                                                    <input
                                                        type="text"
                                                        value={slot.to}
                                                        onChange={(e) => updateAvailability(index, 'to', e.target.value)}
                                                        placeholder="05:00 PM"
                                                        className="w-full h-11 px-3 text-sm rounded-xl border border-gray-200 bg-white text-gray-900 shadow-sm placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                                    />
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeAvailabilityRow(index)}
                                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <FiX size={16} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end pt-4 border-t border-gray-100">
                                <Button type="submit" isLoading={isSavingDetails}>
                                    Save Professional Info
                                </Button>
                            </div>
                        </form>
                    )}

                    {activeTab === 'security' && (
                        <form onSubmit={handleSavePassword} className="space-y-6 animate-in fade-in duration-200">
                            <div>
                                <h3 className="text-base font-bold text-gray-900 mb-1">Security Settings</h3>
                                <p className="text-xs text-gray-400">Configure credentials for secure logging.</p>
                            </div>

                            <div className="space-y-4 max-w-md">
                                <Input
                                    type="password"
                                    label="Current Password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    required
                                />
                                <Input
                                    type="password"
                                    label="New Password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                />
                                <Input
                                    type="password"
                                    label="Confirm New Password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="flex justify-end pt-4 border-t border-gray-100">
                                <Button type="submit" isLoading={isSavingPassword}>
                                    Update Password
                                </Button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Profile