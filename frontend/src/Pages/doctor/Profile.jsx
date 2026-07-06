import React, { useState, useEffect } from 'react'
import doctorService from '../../services/doctor.service'
import uploadService from '../../services/upload.service'
import { useToast } from '../../context/ToastContext'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Skeleton from '../../components/ui/Skeleton'
import ErrorState from '../../components/ui/ErrorState'
import { FiCamera, FiPlus, FiX } from 'react-icons/fi'

const Profile = () => {
    const { addToast } = useToast()
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [isSaving, setIsSaving] = useState(false)
    const [isUploading, setIsUploading] = useState(false)

    // Form fields
    const [specialty, setSpecialty] = useState('')
    const [bio, setBio] = useState('')
    const [phone, setPhone] = useState('')
    const [address, setAddress] = useState('')
    const [consultationPrice, setConsultationPrice] = useState(0)

    // Tags
    const [services, setServices] = useState([])
    const [serviceInput, setServiceInput] = useState('')

    const [symptoms, setSymptoms] = useState([])
    const [symptomInput, setSymptomInput] = useState('')

    const fetchProfile = async () => {
        try {
            setLoading(true)
            setError('')
            const res = await doctorService.getProfile()
            setProfile(res)
            setSpecialty(res.specialty || '')
            setBio(res.bio || '')
            setPhone(res.phone || '')
            setAddress(res.address || '')
            setConsultationPrice(res.consultationPrice || 0)
            setServices(res.services || [])
            setSymptoms(res.symptoms || [])
        } catch (err) {
            console.error(err)
            setError('Failed to load doctor profile details.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProfile()
    }, [])

    const handleImageUpload = async (e) => {
        const file = e.target.files[0]
        if (!file) return
        try {
            setIsUploading(true)
            const res = await uploadService.uploadProfileImage(file)
            setProfile(prev => ({ ...prev, user: { ...prev.user, profileImage: res.profileImage } }))
            addToast('Profile image uploaded successfully!')
        } catch (err) {
            console.error(err)
            addToast('Failed to upload image.', 'error')
        } finally {
            setIsUploading(false)
        }
    }

    const handleAddService = (e) => {
        e.preventDefault()
        if (serviceInput.trim() && !services.includes(serviceInput.trim())) {
            setServices([...services, serviceInput.trim()])
            setServiceInput('')
        }
    }

    const handleRemoveService = (index) => {
        setServices(services.filter((_, i) => i !== index))
    }

    const handleAddSymptom = (e) => {
        e.preventDefault()
        if (symptomInput.trim() && !symptoms.includes(symptomInput.trim())) {
            setSymptoms([...symptoms, symptomInput.trim()])
            setSymptomInput('')
        }
    }

    const handleRemoveSymptom = (index) => {
        setSymptoms(symptoms.filter((_, i) => i !== index))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!profile) return
        try {
            setIsSaving(true)
            await doctorService.update(profile._id, {
                specialty,
                bio,
                phone,
                address,
                consultationPrice: Number(consultationPrice),
                services,
                symptoms
            })
            addToast('Doctor professional profile updated!')
        } catch (err) {
            console.error(err)
            addToast('Failed to update profile details.', 'error')
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-col gap-1.5">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Professional Profile</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Update your biography, pricing, services, and list treated symptoms.
                </p>
            </div>

            {error ? (
                <ErrorState message={error} onRetry={fetchProfile} />
            ) : loading ? (
                <div className="space-y-4">
                    <Skeleton variant="rectangular" height={150} />
                    <Skeleton variant="rectangular" height={250} />
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left: Image / Avatar Config */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-xl p-6 flex flex-col items-center justify-center text-center shadow-sm">
                            <div className="relative group">
                                <div className="w-28 h-28 rounded-full border-2 border-gray-200 dark:border-gray-800 overflow-hidden bg-slate-50 flex items-center justify-center">
                                    {profile?.user?.profileImage ? (
                                        <img
                                            src={profile.user.profileImage}
                                            alt={profile.user.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-4xl font-extrabold text-blue-600">
                                            {profile?.user?.name?.charAt(0).toUpperCase()}
                                        </span>
                                    )}
                                </div>
                                <label className="absolute bottom-1.5 right-1.5 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full cursor-pointer shadow-md transition-colors duration-150">
                                    <FiCamera size={14} />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                        disabled={isUploading}
                                    />
                                </label>
                            </div>
                            <h3 className="text-base font-bold text-gray-850 dark:text-gray-200 mt-4">
                                Dr. {profile?.user?.name}
                            </h3>
                            <p className="text-xs text-gray-400 mt-0.5">{profile?.user?.email}</p>
                            
                            {isUploading && (
                                <span className="text-xs font-semibold text-blue-600 animate-pulse mt-2">Uploading image...</span>
                            )}
                        </div>

                        {/* Consultation Price Config */}
                        <div className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-xl p-5 space-y-4 shadow-sm">
                            <h3 className="text-sm font-bold text-gray-850 dark:text-gray-200">Consultation Pricing</h3>
                            <Input
                                type="number"
                                label="Consultation Fee ($)"
                                value={consultationPrice}
                                onChange={(e) => setConsultationPrice(e.target.value)}
                                min={0}
                                required
                            />
                        </div>
                    </div>

                    {/* Right: Bio & Profile details */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-xl p-6 space-y-6 shadow-sm">
                            <h3 className="text-base font-bold text-gray-850 dark:text-gray-200 border-b border-gray-100 dark:border-gray-800 pb-3">
                                Professional Details
                            </h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Input
                                    label="Medical Specialty"
                                    value={specialty}
                                    onChange={(e) => setSpecialty(e.target.value)}
                                    required
                                />
                                <Input
                                    label="Clinic Phone Number"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    required
                                />
                                <div className="sm:col-span-2">
                                    <Input
                                        label="Clinic Address"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="sm:col-span-2 flex flex-col gap-1.5">
                                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Biography & Background
                                    </label>
                                    <textarea
                                        value={bio}
                                        onChange={(e) => setBio(e.target.value)}
                                        placeholder="Brief background, credentials, and achievements..."
                                        className="w-full min-h-[100px] p-3.5 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Services Offered */}
                            <div className="space-y-3">
                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    Services Offered
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={serviceInput}
                                        onChange={(e) => setServiceInput(e.target.value)}
                                        placeholder="Add a service tag (e.g. ECG)..."
                                        className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-gray-300 bg-white text-gray-800 focus:outline-none dark:bg-gray-900 dark:border-gray-700 dark:text-gray-200"
                                    />
                                    <Button onClick={handleAddService} variant="secondary" size="sm" icon={FiPlus}>Add</Button>
                                </div>
                                <div className="flex flex-wrap gap-1.5 mt-2">
                                    {services.map((srv, i) => (
                                        <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-50 border border-gray-200 rounded-full text-xs font-medium text-gray-700 dark:bg-gray-850 dark:border-gray-800 dark:text-gray-350">
                                            {srv}
                                            <button type="button" onClick={() => handleRemoveService(i)} className="text-gray-400 hover:text-gray-600">
                                                <FiX size={12} />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Symptoms Treated */}
                            <div className="space-y-3">
                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    Symptoms Treated
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={symptomInput}
                                        onChange={(e) => setSymptomInput(e.target.value)}
                                        placeholder="Add a symptom tag (e.g. Fever)..."
                                        className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-gray-300 bg-white text-gray-800 focus:outline-none dark:bg-gray-900 dark:border-gray-700 dark:text-gray-200"
                                    />
                                    <Button onClick={handleAddSymptom} variant="secondary" size="sm" icon={FiPlus}>Add</Button>
                                </div>
                                <div className="flex flex-wrap gap-1.5 mt-2">
                                    {symptoms.map((sym, i) => (
                                        <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-50 border border-gray-200 rounded-full text-xs font-medium text-gray-700 dark:bg-gray-850 dark:border-gray-800 dark:text-gray-350">
                                            {sym}
                                            <button type="button" onClick={() => handleRemoveSymptom(i)} className="text-gray-400 hover:text-gray-600">
                                                <FiX size={12} />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-end pt-4 border-t border-gray-150 dark:border-gray-800">
                                <Button type="submit" isLoading={isSaving}>
                                    Update Profile
                                </Button>
                            </div>
                        </div>
                    </div>
                </form>
            )}
        </div>
    )
}

export default Profile
