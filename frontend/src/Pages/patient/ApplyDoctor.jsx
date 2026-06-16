import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiCheckCircle, FiFileText, FiUpload, FiAlertCircle, FiArrowLeft, FiUserCheck } from 'react-icons/fi'
import doctorApplicationService from '../../services/doctor-application.service'

const SPECIALTIES = [
  'Cardiology',
  'Dermatology',
  'Orthopedics',
  'Pediatrics',
  'ENT',
  'Neurology',
  'Ophthalmology',
  'Internal Medicine'
]

const ApplyDoctor = () => {
  const [specialty, setSpecialty] = useState('')
  const [licenseImage, setLicenseImage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!specialty) {
      setError('Please select your medical specialty')
      return
    }
    if (!licenseImage) {
      setError('Please provide a medical license URL or placeholder')
      return
    }

    try {
      setSubmitting(true)
      setError('')
      await doctorApplicationService.applyAsDoctor({ specialty, licenseImage })
      setSubmitted(true)
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.message || 'Failed to submit application. Please make sure you are logged in as a patient.')
    } finally {
      setSubmitting(false)
    }
  }

  // Pre-fill a mock license URL for testing convenience
  const fillMockLicense = () => {
    setLicenseImage('https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=600&q=80')
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl p-8 md:p-10 shadow-xl border border-slate-100 max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto mb-6">
            <FiCheckCircle size={44} />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 mb-3">
            Application Submitted!
          </h2>
          <p className="text-slate-500 text-sm leading-relaxed mb-8">
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
              className="block w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-sm transition duration-300"
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-6 flex items-center justify-center">
      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 max-w-lg w-full overflow-hidden">
        
        {/* Accent strip */}
        <div className="h-2 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600"></div>

        <div className="p-8 md:p-10">
          {/* Header */}
          <div className="mb-8">
            <Link 
              to="/" 
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 font-bold transition mb-4 uppercase tracking-wider"
            >
              <FiArrowLeft />
              <span>Back to Home</span>
            </Link>
            <h1 className="text-3xl font-extrabold text-slate-900 mb-2">
              Apply to Join as a Doctor
            </h1>
            <p className="text-slate-500 text-sm">
              Verify your professional credentials and start booking patients on MediBook.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-3 text-rose-600 text-xs font-semibold leading-relaxed">
              <FiAlertCircle className="text-base shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Specialty */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Medical Specialty
              </label>
              <select
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 text-sm focus:bg-white focus:border-blue-500 focus:outline-none transition"
              >
                <option value="">Select your specialty</option>
                {SPECIALTIES.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
            </div>

            {/* License Image URL */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Medical License Image URL
                </label>
                <button
                  type="button"
                  onClick={fillMockLicense}
                  className="text-[10px] text-blue-600 hover:underline font-bold"
                >
                  Use Mock License URL
                </button>
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <FiFileText />
                </span>
                <input
                  type="url"
                  placeholder="https://example.com/license-image.jpg"
                  value={licenseImage}
                  onChange={(e) => setLicenseImage(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-slate-700 text-sm focus:bg-white focus:border-blue-500 focus:outline-none transition"
                />
              </div>
              <p className="text-[11px] text-slate-400">
                Please upload your medical practice license to an image host or use the mock URL above for testing.
              </p>
            </div>

            {/* Terms Warning */}
            <div className="p-4 bg-blue-50/50 border border-blue-50 rounded-2xl flex gap-3 text-slate-600 text-xs leading-relaxed font-medium">
              <FiUserCheck className="text-blue-500 text-lg shrink-0 mt-0.5" />
              <span>
                By submitting this application, you certify that all provided details and credentials are legally valid and correct.
              </span>
            </div>

            {/* Submit */}
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
