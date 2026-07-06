import { useState, useRef } from 'react'
import { FiCamera, FiUpload, FiX } from 'react-icons/fi'

const ImageUpload = ({
  onUpload,
  currentImage,
  accept = 'image/*',
  maxSize = 2 * 1024 * 1024,
  className = '',
  disabled = false,
}) => {
  const [preview, setPreview] = useState(currentImage || '')
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef(null)

  const handleFileSelect = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setError('')

    if (file.size > maxSize) {
      setError(`File size exceeds ${maxSize / 1024 / 1024}MB limit.`)
      return
    }

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file.')
      return
    }

    const reader = new FileReader()
    reader.onload = (ev) => setPreview(ev.target.result)
    reader.readAsDataURL(file)

    if (onUpload) {
      try {
        setIsUploading(true)
        await onUpload(file)
      } catch {
        setError('Upload failed. Please try again.')
      } finally {
        setIsUploading(false)
      }
    }
  }

  const handleRemove = () => {
    setPreview('')
    setError('')
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      <div className="relative group">
        <div className="w-28 h-28 rounded-full border-2 border-dashed border-gray-300 dark:border-gray-700 overflow-hidden bg-gray-50 dark:bg-gray-850 flex items-center justify-center transition-all duration-200 group-hover:border-blue-400">
          {preview ? (
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
          ) : currentImage ? (
            <img src={currentImage} alt="Current" className="w-full h-full object-cover" />
          ) : (
            <FiUpload className="text-gray-400" size={28} />
          )}
        </div>
        <label className="absolute bottom-0 right-0 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full cursor-pointer shadow-md transition-colors duration-150 disabled:opacity-50">
          <FiCamera size={14} />
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            onChange={handleFileSelect}
            className="hidden"
            disabled={disabled || isUploading}
          />
        </label>
      </div>

      {isUploading && (
        <span className="text-xs font-semibold text-blue-600 animate-pulse">Uploading...</span>
      )}

      {error && (
        <span className="text-xs font-medium text-red-500">{error}</span>
      )}

      {preview && (
        <button
          type="button"
          onClick={handleRemove}
          className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 transition-colors"
        >
          <FiX size={14} /> Remove
        </button>
      )}
    </div>
  )
}

export default ImageUpload
