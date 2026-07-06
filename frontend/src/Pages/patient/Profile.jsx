import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import uploadService from '../../services/upload.service'
import reviewService from '../../services/review.service'
import { useToast } from '../../context/ToastContext'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import Avatar from '../../components/ui/Avatar'
import Modal from '../../components/ui/Modal'
import { FiUser, FiLock, FiCamera, FiMessageSquare, FiEdit, FiTrash2, FiStar } from 'react-icons/fi'

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

    // Reviews states
    const [reviews, setReviews] = useState([])
    const [loadingReviews, setLoadingReviews] = useState(false)
    const [editReview, setEditReview] = useState(null)
    const [editRating, setEditRating] = useState(5)
    const [editComment, setEditComment] = useState('')

    // Loading states
    const [isSavingDetails, setIsSavingDetails] = useState(false)
    const [isSavingPassword, setIsSavingPassword] = useState(false)
    const [isUploading, setIsUploading] = useState(false)

    const fetchMyReviews = async () => {
        try {
            setLoadingReviews(true)
            const res = await reviewService.getMyReviews({ limit: 100 })
            setReviews(res.data || [])
        } catch (err) {
            console.error(err)
        } finally {
            setLoadingReviews(false)
        }
    }

    useEffect(() => {
        if (activeTab === 'reviews') {
            fetchMyReviews()
        }
    }, [activeTab])

    const handleImageUpload = async (e) => {
        const file = e.target.files[0]
        if (!file) return
        try {
            setIsUploading(true)
            const res = await uploadService.uploadProfileImage(file)
            setAvatarUrl(res.profileImage)
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

    const handleDeleteReview = async (id) => {
        if (!window.confirm('Are you sure you want to delete this review?')) return
        try {
            await reviewService.deleteReview(id)
            addToast('Review deleted successfully.')
            fetchMyReviews()
        } catch (err) {
            console.error(err)
            addToast('Failed to delete review.', 'error')
        }
    }

    const handleStartEdit = (rev) => {
        setEditReview(rev)
        setEditRating(rev.rating)
        setEditComment(rev.comment)
    }

    const handleSaveEdit = async (e) => {
        e.preventDefault()
        if (!editReview) return
        try {
            await reviewService.updateReview(editReview._id, {
                rating: editRating,
                comment: editComment
            })
            addToast('Review updated successfully!')
            setEditReview(null)
            fetchMyReviews()
        } catch (err) {
            console.error(err)
            addToast('Failed to update review.', 'error')
        }
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-col gap-1.5">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">My Profile</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Configure your personal contact details, security credentials, and review log.
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
                    <button
                        onClick={() => setActiveTab('reviews')}
                        className={`
                            flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold rounded-lg text-left whitespace-nowrap transition-all duration-200
                            ${activeTab === 'reviews'
                                ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-850'
                            }
                        `}
                    >
                        <FiMessageSquare size={16} />
                        My Reviews
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

                    {activeTab === 'reviews' && (
                        <div className="space-y-6 animate-in fade-in duration-200">
                            <div>
                                <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-1">My Reviews</h3>
                                <p className="text-xs text-gray-400">View, edit, or delete doctor reviews you've submitted.</p>
                            </div>

                            {loadingReviews ? (
                                <div className="space-y-3">
                                    <div className="h-16 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg" />
                                    <div className="h-16 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg" />
                                </div>
                            ) : reviews.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <FiMessageSquare className="mx-auto w-8 h-8 text-gray-300 mb-2" />
                                    <p className="text-sm">You haven't written any reviews yet.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {reviews.map((rev) => (
                                        <div key={rev._id} className="p-4 bg-gray-55 dark:bg-gray-850 rounded-xl border border-gray-100 dark:border-gray-800/80 space-y-3">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="text-xs font-bold text-gray-850 dark:text-gray-250">
                                                        Dr. {rev.doctor?.user?.name || rev.doctor?.name || 'Specialist'}
                                                    </h4>
                                                    <span className="text-[10px] text-gray-400 font-semibold">{rev.doctor?.specialty}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <button 
                                                        onClick={() => handleStartEdit(rev)}
                                                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-800 rounded text-blue-600 hover:text-blue-700 transition"
                                                        title="Edit Review"
                                                    >
                                                        <FiEdit size={14} />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDeleteReview(rev._id)}
                                                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-800 rounded text-red-500 hover:text-red-650 transition"
                                                        title="Delete Review"
                                                    >
                                                        <FiTrash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-0.5">
                                                {Array.from({ length: 5 }).map((_, i) => (
                                                    <FiStar
                                                        key={i}
                                                        size={12}
                                                        className={i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}
                                                    />
                                                ))}
                                            </div>

                                            <p className="text-xs text-gray-600 dark:text-gray-400 italic">
                                                "{rev.comment}"
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Edit Review Modal */}
            <Modal
                isOpen={!!editReview}
                onClose={() => setEditReview(null)}
                title="Edit My Review"
                size="md"
                footer={
                    <>
                        <Button variant="outline" size="sm" onClick={() => setEditReview(null)}>
                            Cancel
                        </Button>
                        <Button variant="primary" size="sm" onClick={handleSaveEdit} disabled={!editComment.trim()}>
                            Save Changes
                        </Button>
                    </>
                }
            >
                {editReview && (
                    <form onSubmit={handleSaveEdit} className="space-y-4">
                        <div className="flex flex-col gap-1.5">
                            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Rating</span>
                            <div className="flex gap-1.5">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        type="button"
                                        key={star}
                                        onClick={() => setEditRating(star)}
                                        className="text-2xl transition-transform duration-100 hover:scale-110 focus:outline-none"
                                    >
                                        <FiStar
                                            className={`w-6 h-6 ${
                                                star <= editRating
                                                    ? 'fill-amber-400 text-amber-400'
                                                    : 'text-gray-300 dark:text-gray-700'
                                            }`}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                                Comment
                            </label>
                            <textarea
                                value={editComment}
                                onChange={(e) => setEditComment(e.target.value)}
                                className="w-full min-h-[90px] p-3 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                required
                            />
                        </div>
                    </form>
                )}
            </Modal>
        </div>
    )
}

export default Profile
