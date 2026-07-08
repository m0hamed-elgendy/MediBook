import { useState, useEffect, useCallback } from 'react'
import doctorService from '../../services/doctor.service'
import uploadService from '../../services/upload.service'
import { useToast } from '../../context/ToastContext'
import { useAuth } from '../../context/AuthContext'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Skeleton from '../../components/ui/Skeleton'
import ErrorState from '../../components/ui/ErrorState'
import { FiCamera, FiPlus, FiX, FiMail, FiStar, FiDollarSign } from 'react-icons/fi'
import { Stethoscope } from 'lucide-react'
import Textarea from '../../components/ui/Textarea'

const Profile = () => {
    const { addToast } = useToast()
    const { user, updateUser } = useAuth()
    const [profile, setProfile] = useState(null)
    const [isNewDoctor, setIsNewDoctor] = useState(false)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [isSaving, setIsSaving] = useState(false)
    const [isUploading, setIsUploading] = useState(false)

    const [specialty, setSpecialty] = useState('')
    const [bio, setBio] = useState('')
    const [phone, setPhone] = useState('')
    const [address, setAddress] = useState('')
    const [consultationPrice, setConsultationPrice] = useState(0)

    const [services, setServices] = useState([])
    const [serviceInput, setServiceInput] = useState('')

    const [symptoms, setSymptoms] = useState([])
    const [symptomInput, setSymptomInput] = useState('')

    const fetchProfile = useCallback(async () => {
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
            if (err.response?.status === 404) {
                setIsNewDoctor(true)
            } else {
                setError('Failed to load doctor profile details.')
            }
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
                setProfile(res)
                setSpecialty(res.specialty || '')
                setBio(res.bio || '')
                setPhone(res.phone || '')
                setAddress(res.address || '')
                setConsultationPrice(res.consultationPrice || 0)
                setServices(res.services || [])
                setSymptoms(res.symptoms || [])
            } catch (err) {
                if (active) {
                    console.error(err)
                    if (err.response?.status === 404) {
                        setIsNewDoctor(true)
                    } else {
                        setError('Failed to load doctor profile details.')
                    }
                }
            } finally {
                if (active) setLoading(false)
            }
        }
        load()
        return () => { active = false }
    }, [])

    const handleImageUpload = async (e) => {
        const file = e.target.files[0]
        if (!file) return
        try {
            setIsUploading(true)
            const res = await uploadService.uploadProfileImage(file)
            const imageUrl = res.profileImage
            setProfile(prev => prev ? ({ ...prev, user: { ...prev.user, profileImage: imageUrl } }) : null)
            updateUser({ ...user, profileImage: imageUrl })
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
        try {
            setIsSaving(true)
            if (isNewDoctor) {
                const res = await doctorService.create({
                    specialty,
                    bio,
                    phone,
                    address,
                    consultationPrice: Number(consultationPrice),
                    services,
                    symptoms
                })
                setProfile(res)
                setIsNewDoctor(false)
                addToast('Doctor professional profile created successfully!')
            } else {
                if (!profile) return
                const res = await doctorService.update(profile._id, {
                    specialty,
                    bio,
                    phone,
                    address,
                    consultationPrice: Number(consultationPrice),
                    services,
                    symptoms
                })
                setProfile(res)
                const updatedUser = { ...user, specialty }
                updateUser(updatedUser)
                addToast('Doctor professional profile updated!')
            }
        } catch (err) {
            console.error(err)
            addToast('Failed to save profile details.', 'error')
        } finally {
            setIsSaving(false)
        }
    }

    const displayName = profile?.user?.name || user?.name || 'Doctor'
    const displayEmail = profile?.user?.email || user?.email || ''
    const displayImage = profile?.user?.profileImage || user?.profileImage || null
    const displayRating = profile?.averageRating || profile?.rating || 0
    const displayFee = profile?.consultationPrice || consultationPrice || 0

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                    {isNewDoctor ? 'Create Professional Profile' : 'Professional Profile'}
                </h1>
                <p className="text-sm text-gray-500">
                    {isNewDoctor ? 'Fill in your clinic and consultation details to start receiving appointments.' : 'Update your biography, pricing, services, and list treated symptoms.'}
                </p>
            </div>

            {error ? (
                <ErrorState message={error} onRetry={fetchProfile} />
            ) : loading ? (
                <div className="space-y-4">
                    <Skeleton variant="rectangular" height={180} />
                    <Skeleton variant="rectangular" height={320} />
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Profile Summary Card */}
                        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                            <div className="flex flex-col items-center text-center">
                                <div className="relative group">
                                    <div className="w-28 h-28 rounded-full border-2 border-gray-100 overflow-hidden bg-gray-50 flex items-center justify-center shadow-sm">
                                        {displayImage ? (
                                            <img
                                                src={displayImage}
                                                alt={displayName}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-4xl font-extrabold text-blue-600">
                                                {displayName.charAt(0).toUpperCase()}
                                            </span>
                                        )}
                                    </div>
                                    <label className="absolute bottom-1 right-1 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full cursor-pointer shadow-md transition-colors duration-150">
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

                                {isUploading && (
                                    <span className="text-xs font-semibold text-blue-600 animate-pulse mt-2">Uploading image...</span>
                                )}

                                <h3 className="text-lg font-bold text-gray-900 mt-4">
                                    Dr. {displayName}
                                </h3>

                                <div className="flex items-center gap-1.5 mt-1 text-gray-500 text-sm">
                                    <FiMail size={14} />
                                    <span className="text-xs">{displayEmail}</span>
                                </div>

                                <div className="w-full mt-4 space-y-2.5">
                                    <div className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Stethoscope size={15} className="text-blue-500" />
                                            <span>Specialty</span>
                                        </div>
                                        <span className="text-sm font-semibold text-gray-800">{specialty || '—'}</span>
                                    </div>
                                    <div className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <FiStar size={15} className="text-amber-500" />
                                            <span>Rating</span>
                                        </div>
                                        <span className="text-sm font-semibold text-gray-800">{displayRating ? `${displayRating.toFixed(1)} / 5` : '—'}</span>
                                    </div>
                                    <div className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <FiDollarSign size={15} className="text-green-500" />
                                            <span>Fee</span>
                                        </div>
                                        <span className="text-sm font-semibold text-gray-800">${displayFee}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Consultation Price Card */}
                        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                            <h3 className="text-sm font-semibold text-gray-800 mb-4">Consultation Pricing</h3>
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

                    {/* Right Column */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                            <h3 className="text-base font-semibold text-gray-900 border-b border-gray-100 pb-3 mb-6">
                                Professional Details
                            </h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
                                <div className="sm:col-span-2">
                                    <Textarea
                                        label="Biography & Background"
                                        value={bio}
                                        onChange={(e) => setBio(e.target.value)}
                                        placeholder="Brief background, credentials, and achievements..."
                                        rows={4}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Services Offered */}
                            <div className="mt-6 pt-6 border-t border-gray-100">
                                <label className="text-sm font-medium text-gray-700 mb-2 block">
                                    Services Offered
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={serviceInput}
                                        onChange={(e) => setServiceInput(e.target.value)}
                                        placeholder="Add a service tag (e.g. ECG)..."
                                        className="flex-1 h-11 px-4 text-sm rounded-xl border border-gray-200 bg-white text-gray-900 shadow-sm placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 hover:border-gray-300"
                                    />
                                    <Button onClick={handleAddService} variant="secondary" size="md" icon={FiPlus}>Add</Button>
                                </div>
                                {services.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        {services.map((srv, i) => (
                                            <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-lg text-xs font-medium text-blue-700">
                                                {srv}
                                                <button type="button" onClick={() => handleRemoveService(i)} className="text-blue-400 hover:text-red-500 cursor-pointer transition-colors">
                                                    <FiX size={13} />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Symptoms Treated */}
                            <div className="mt-6 pt-6 border-t border-gray-100">
                                <label className="text-sm font-medium text-gray-700 block mb-2">
                                    Symptoms Treated
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={symptomInput}
                                        onChange={(e) => setSymptomInput(e.target.value)}
                                        placeholder="Add a symptom tag (e.g. Fever)..."
                                        className="flex-1 h-11 px-4 text-sm rounded-xl border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 hover:border-gray-300"
                                    />
                                    <Button onClick={handleAddSymptom} variant="secondary" size="md" icon={FiPlus}>Add</Button>
                                </div>
                                {symptoms.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        {symptoms.map((sym, i) => (
                                            <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-lg text-xs font-medium text-emerald-700">
                                                {sym}
                                                <button type="button" onClick={() => handleRemoveSymptom(i)} className="text-emerald-400 hover:text-red-500 cursor-pointer transition-colors">
                                                    <FiX size={13} />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end pt-6 mt-6 border-t border-gray-100">
                                <Button type="submit" isLoading={isSaving} disabled={isSaving}>
                                    {isNewDoctor ? 'Create Profile' : 'Update Profile'}
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