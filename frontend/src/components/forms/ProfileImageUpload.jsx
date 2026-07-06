import { useState } from 'react'
import uploadService from '../../services/upload.service'
import { useToast } from '../../context/ToastContext'
import ImageUpload from './ImageUpload'

const ProfileImageUpload = ({ currentImage, onSuccess, className = '' }) => {
  const { addToast } = useToast()
  const [isUploading, setIsUploading] = useState(false)

  const handleUpload = async (file) => {
    try {
      setIsUploading(true)
      const res = await uploadService.uploadProfileImage(file)
      if (onSuccess) onSuccess(res.profileImage)
      addToast('Profile image updated successfully!')
    } catch {
      addToast('Failed to upload profile image.', 'error')
      throw new Error('Upload failed')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <ImageUpload
      currentImage={currentImage}
      onUpload={handleUpload}
      disabled={isUploading}
      className={className}
    />
  )
}

export default ProfileImageUpload
