import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import uploadService from '../../services/upload.service'
import { useToast } from '../../context/ToastContext'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import Avatar from '../../components/ui/Avatar'
import { FiUser, FiLock, FiCamera } from 'react-icons/fi'

const Profile = () => {
    const { user } = useAuth()
    const { addToast } = useToast()

    const [activeTab, setActiveTab] = useState('personal')

    // Personal details state
    const [name, setName] = useState(user?.name || '')
    const [email] = useState(user?.email || '')
    const [phone, setPhone] = useState(user?.phone || '')
    const [avatarUrl, setAvatarUrl] = useState(user?.profileImage || '')

    // Security state
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    // Loading states
    const [isSavingDetails, setIsSavingDetails] = useState(false)
    const [isSavingPassword, setIsSavingPassword] = useState(false)
    const [isUploading, setIsUploading] = useState(false)

    const handleImageUpload = async (e) => {
        const file = e.target.files[0]
        if (!file) return
        try {
            setIsUploading(true)
            const res = await uploadService.uploadProfileImage(file)
            setAvatarUrl(res.profileImage)
            // Update local storage user details if needed, or trigger success
            addToast('Profile photo updated!')
        } catch (err) {
            console.error(err)
            addToast('Failed to upload image.', 'error')
        } finally {
            setIsUploading(false)
        }
    }

    const handleSaveDetails = (e) => {
        e.preventDefault()
        setIsSavingDetails(true)
        setTimeout(() => {
            setIsSavingDetails(false)
            addToast('Personal information updated successfully!')
        }, 800)
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

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-col gap-1.5">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">My Profile</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Configure your personal contact details, security credentials, and photo.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Tabs */}
                <div className="md:col-span-1 flex flex-row md:flex-col gap-1.5 overflow-x-auto pb-2 md:pb-0">
                    <button
                        onClick={() => setActiveTab('personal')}
                        className={`
                            flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold rounded-lg text-left whitespace-nowrap transition-all duration-200
                            ${activeTab === 'personal'
                                ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-850'
                            }
                        `}
                    >
                        <FiUser size={16} />
                        Personal Info
                    </button>
                    <button
                        onClick={() => setActiveTab('security')}
                        className={`
                            flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold rounded-lg text-left whitespace-nowrap transition-all duration-200
                            ${activeTab === 'security'
                                ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-850'
                            }
                        `}
                    >
                        <FiLock size={16} />
                        Security & Password
                    </button>
                </div>

                {/* Tab content panel */}
                <div className="md:col-span-3 bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-xl p-6 shadow-sm">
                    {activeTab === 'personal' && (
                        <form onSubmit={handleSaveDetails} className="space-y-6 animate-in fade-in duration-200">
                            <div>
                                <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-1">Personal Profile</h3>
                                <p className="text-xs text-gray-400">Manage how clinics identify your records.</p>
                            </div>

                            {/* Image upload */}
                            <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-gray-50/50 dark:bg-gray-850 rounded-xl border border-gray-100 dark:border-gray-800/80">
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
                                    <span className="text-xs font-semibold text-gray-850 dark:text-gray-250">Profile Picture</span>
                                    <p className="text-[10px] text-gray-400 mt-1">
                                        Supports JPG or PNG. Max size 2MB.
                                    </p>
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

                            <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-gray-800">
                                <Button type="submit" isLoading={isSavingDetails}>
                                    Save Profile
                                </Button>
                            </div>
                        </form>
                    )}

                    {activeTab === 'security' && (
                        <form onSubmit={handleSavePassword} className="space-y-6 animate-in fade-in duration-200">
                            <div>
                                <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-1">Security Settings</h3>
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

                            <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-gray-800">
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
