import React, { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiCheckCircle, FiFileText, FiUpload, FiAlertCircle, FiArrowLeft, FiUserCheck, FiClock, FiX } from 'react-icons/fi'
import doctorApplicationService from '../../services/doctor-application.service'
import Select from '../../components/ui/Select'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Skeleton from '../../components/ui/Skeleton'

const SPECIALTIES = [
  'Cardiology',
  'Dermatology',
  'Orthopedics',
  'Pediatrics',
  'ENT',
  'Neurology',
  'Ophthalmology',
  'Internal Medicine',
  'Gynecology',
  'Psychiatry',
  'General Medicine',
]

const ApplyDoctor = () => {
  const [specialty, setSpecialty] = useState('')
  const [licenseImage, setLicenseImage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const [existingApp, setExistingApp] = useState(null)
  const [checkingApp, setCheckingApp] = useState(true)

  const fetchExistingApplication = useCallback(async () => {
    try {
      setCheckingApp(true)
      const apps = await doctorApplicationService.getApplications()
      const myApps = Array.isArray(apps) ? apps : []
      const pendingApp = myApps.find(a => a.status === 'pending' || a.status === 'approved' || a.status === 'rejected')
      if (pendingApp) {
        setExistingApp(pendingApp)
        if (pendingApp.status === 'approved') {
          setSubmitted(true)
        }
      }
    } catch (err) {
      console.error(err)
    } finally {
      setCheckingApp(false)
    }
  }, [])

  useEffect(() => {
    fetchExistingApplication()
  }, [fetchExistingApplication])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!specialty) {
      setError('Please select your medical specialty')
      return
    }
    if (!licenseImage) {
      setError('Please provide a medical license URL')
      return
    }

    try {
      setSubmitting(true)
      setError('')
      await doctorApplicationService.applyAsDoctor({ specialty, licenseImage })
      setSubmitted(true)
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.message || 'Failed to submit application.')
    } finally {
      setSubmitting(false)
    }
  }

  const fillMockLicense = () => {
    setLicenseImage('https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=600&q=80')
  }

  if (checkingApp) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <Skeleton variant="rectangular" width={500} height={500} />
      </div>
    )
  }

  if (existingApp && existingApp.status !== 'rejected') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl p-8 md:p-10 border border-gray-200 shadow-sm max-w-md w-full text-center">
          {existingApp.status === 'approved' ? (
            <>
              <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto mb-6">
                <FiCheckCircle size={44} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Application Approved!
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-8">
                Congratulations! Your doctor application has been approved. You can now log in with your doctor account and start managing appointments.
              </p>
              <Link
                to="/login"
                className="block w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition duration-300"
              >
                Go to Login
              </Link>
            </>
          ) : (
            <>
              <div className="w-20 h-20 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mx-auto mb-6">
                <FiClock size={44} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Application Pending
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                Your application to join as a doctor is currently under review. Our administration team will verify your credentials soon.
              </p>
              <div className="bg-gray-50 rounded-xl p-4 text-left text-sm space-y-2 border border-gray-100">
                <div className="flex justify-between">
                  <span className="text-gray-500">Specialty</span>
                  <span className="font-semibold text-gray-800">{existingApp.specialty}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Status</span>
                  <Badge variant="pending">Pending Review</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Submitted</span>
                  <span className="text-gray-800">{new Date(existingApp.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
              </div>
              <Link
                to="/patient/dashboard"
                className="block w-full py-3 mt-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition duration-300"
              >
                Go to Dashboard
              </Link>
            </>
          )}
        </div>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl p-8 md:p-10 border border-gray-200 shadow-sm max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto mb-6">
            <FiCheckCircle size={44} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Application Submitted!
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-8">
            Your medical application has been successfully received. Our administration team will verify your credentials and approve your profile soon.
          </p>
          <div className="space-y-3">
            <Link
              to="/patient/dashboard"
              className="block w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition duration-300 shadow-sm"
            >
              Go to Dashboard
            </Link>
            <Link
              to="/"
              className="block w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold text-sm transition duration-300"
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-6 flex items-center justify-center">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm max-w-lg w-full overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600"></div>

        <div className="p-8 md:p-10">
          <div className="mb-8">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 font-bold transition mb-4 uppercase tracking-wider"
            >
              <FiArrowLeft />
              <span>Back to Home</span>
            </Link>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
              Apply to Join as a Doctor
            </h1>
            <p className="text-gray-500 text-sm">
              Verify your professional credentials and start booking patients on MediBook.
            </p>
          </div>

          {existingApp && existingApp.status === 'rejected' && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl space-y-2">
              <div className="flex items-start gap-2">
                <FiAlertCircle className="text-red-500 mt-0.5 shrink-0" size={16} />
                <div>
                  <p className="text-sm font-semibold text-red-700">Previous Application Rejected</p>
                  <p className="text-xs text-red-600 mt-1">{existingApp.rejectionReason || 'No reason provided.'}</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">You can submit a new application with corrected information.</p>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-600 text-xs font-semibold leading-relaxed">
              <FiAlertCircle className="text-base shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                Medical Specialty
              </label>
              <Select
                value={specialty}
                onChange={setSpecialty}
                options={[
                  { value: '', label: 'Select your specialty' },
                  ...SPECIALTIES.map(s => ({ value: s, label: s })),
                ]}
                placeholder="Select your specialty"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Medical License Image
                </label>
                <button
                  type="button"
                  onClick={fillMockLicense}
                  className="text-[10px] text-blue-600 hover:underline font-bold"
                >
                  Use Mock URL
                </button>
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <FiFileText />
                </span>
                <input
                  type="url"
                  placeholder="https://example.com/license-image.jpg"
                  value={licenseImage}
                  onChange={(e) => setLicenseImage(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-gray-700 text-sm focus:bg-white focus:border-blue-500 focus:outline-none transition"
                />
              </div>
              <p className="text-[11px] text-gray-400">
                Upload your medical practice license to an image host and paste the URL above.
              </p>
            </div>

            {licenseImage && (
              <div className="border border-gray-200 rounded-lg overflow-hidden max-h-[200px] bg-gray-50 flex items-center justify-center relative">
                <img src={licenseImage} alt="License Preview" className="max-h-[200px] object-contain" />
              </div>
            )}

            <div className="p-4 bg-blue-50/50 border border-blue-50 rounded-xl flex gap-3 text-gray-600 text-xs leading-relaxed font-medium">
              <FiUserCheck className="text-blue-500 text-lg shrink-0 mt-0.5" />
              <span>
                By submitting this application, you certify that all provided details and credentials are legally valid and correct.
              </span>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl font-bold text-sm transition duration-300 shadow-sm active:scale-98 cursor-pointer flex items-center justify-center"
            >
              {submitting ? 'Submitting Application...' : 'Submit Doctor Application'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ApplyDoctor