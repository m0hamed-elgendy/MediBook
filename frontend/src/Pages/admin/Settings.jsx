import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { useToast } from '../../context/ToastContext'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import { FiUser, FiLock, FiSliders, FiBell, FiMoon, FiSun } from 'react-icons/fi'

const Settings = () => {
    const { user } = useAuth()
    const { theme, toggleTheme } = useTheme()
    const { addToast } = useToast()

    const [activeTab, setActiveTab] = useState('profile')

    // Profile state
    const [profileName, setProfileName] = useState(user?.name || 'Admin')
    const [profileEmail, setProfileEmail] = useState(user?.email || 'admin@medibook.com')
    const [profilePhone, setProfilePhone] = useState(user?.phone || '555-0199')

    // Password state
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    // Notification states
    const [emailNotif, setEmailNotif] = useState(true)
    const [smsNotif, setSmsNotif] = useState(false)
    const [weeklyReport, setWeeklyReport] = useState(true)

    // Loading states
    const [isSavingProfile, setIsSavingProfile] = useState(false)
    const [isSavingPassword, setIsSavingPassword] = useState(false)
    const [isSavingPrefs, setIsSavingPrefs] = useState(false)

    const handleSaveProfile = (e) => {
        e.preventDefault()
        setIsSavingProfile(true)
        setTimeout(() => {
            setIsSavingProfile(false)
            addToast('Profile information updated successfully!')
        }, 800)
    }

    const handleSavePassword = (e) => {
        e.preventDefault()
        if (newPassword !== confirmPassword) {
            addToast('New passwords do not match!', 'error')
            return
        }
        setIsSavingPassword(true)
        setTimeout(() => {
            setIsSavingPassword(false)
            setCurrentPassword('')
            setNewPassword('')
            setConfirmPassword('')
            addToast('Security password updated successfully!')
        }, 1000)
    }

    const handleSavePrefs = (e) => {
        e.preventDefault()
        setIsSavingPrefs(true)
        setTimeout(() => {
            setIsSavingPrefs(false)
            addToast('Preferences and alerts saved.')
        }, 600)
    }

    const tabs = [
        { id: 'profile', label: 'Profile Settings', icon: FiUser },
        { id: 'password', label: 'Security & Password', icon: FiLock },
        { id: 'preferences', label: 'System Preferences', icon: FiSliders },
    ]

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-col gap-1.5">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Settings</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Configure your profile details, password, preferences, and workspace settings.
                </p>
            </div>

            {/* Layout Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Tabs Sidebar */}
                <div className="md:col-span-1 flex flex-row md:flex-col gap-1.5 overflow-x-auto pb-2 md:pb-0">
                    {tabs.map((tab) => {
                        const Icon = tab.icon
                        const isActive = activeTab === tab.id
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`
                                    flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold rounded-lg text-left whitespace-nowrap transition-all duration-200
                                    ${isActive
                                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-850 dark:hover:text-gray-200'
                                    }
                                `}
                            >
                                <Icon size={16} />
                                {tab.label}
                            </button>
                        )
                    })}
                </div>

                {/* Tab Contents */}
                <div className="md:col-span-3 bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-xl p-6">
                    {activeTab === 'profile' && (
                        <form onSubmit={handleSaveProfile} className="space-y-6 animate-in fade-in duration-200">
                            <div>
                                <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-1">Personal Info</h3>
                                <p className="text-xs text-gray-400">Update your public account information.</p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Input
                                    label="Name"
                                    value={profileName}
                                    onChange={(e) => setProfileName(e.target.value)}
                                    required
                                />
                                <Input
                                    label="Phone Number"
                                    value={profilePhone}
                                    onChange={(e) => setProfilePhone(e.target.value)}
                                />
                                <div className="sm:col-span-2">
                                    <Input
                                        type="email"
                                        label="Email Address"
                                        value={profileEmail}
                                        onChange={(e) => setProfileEmail(e.target.value)}
                                        required
                                        disabled
                                        helperText="Email changes require administrator security override."
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-gray-800">
                                <Button type="submit" isLoading={isSavingProfile}>
                                    Save Changes
                                </Button>
                            </div>
                        </form>
                    )}

                    {activeTab === 'password' && (
                        <form onSubmit={handleSavePassword} className="space-y-6 animate-in fade-in duration-200">
                            <div>
                                <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-1">Update Password</h3>
                                <p className="text-xs text-gray-400">Ensure your workspace credentials remain highly secure.</p>
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
                                    Change Password
                                </Button>
                            </div>
                        </form>
                    )}

                    {activeTab === 'preferences' && (
                        <form onSubmit={handleSavePrefs} className="space-y-6 animate-in fade-in duration-200">
                            <div>
                                <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-1">Workspace Preferences</h3>
                                <p className="text-xs text-gray-400">Configure visual themes and event alert notifications.</p>
                            </div>

                            {/* Appearance */}
                            <div className="space-y-3">
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Appearance</h4>
                                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-850 rounded-xl border border-gray-100 dark:border-gray-800/80">
                                    <div className="flex flex-col gap-0.5">
                                        <span className="text-sm font-semibold text-gray-850 dark:text-gray-200">Dark Theme Mode</span>
                                        <span className="text-xs text-gray-400">Enable high-contrast night aesthetics.</span>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={toggleTheme}
                                        icon={theme === 'dark' ? FiSun : FiMoon}
                                    >
                                        {theme === 'dark' ? 'Light Theme' : 'Dark Theme'}
                                    </Button>
                                </div>
                            </div>

                            {/* Notifications */}
                            <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                                    <FiBell /> Alerts & Notifications
                                </h4>
                                <div className="space-y-3">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={emailNotif}
                                            onChange={(e) => setEmailNotif(e.target.checked)}
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4.5 w-4.5"
                                        />
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-xs font-semibold text-gray-850 dark:text-gray-200">Email System Notifications</span>
                                            <span className="text-[10px] text-gray-400">Send verification and appointment bookings to your inbox.</span>
                                        </div>
                                    </label>

                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={smsNotif}
                                            onChange={(e) => setSmsNotif(e.target.checked)}
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4.5 w-4.5"
                                        />
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-xs font-semibold text-gray-850 dark:text-gray-200">SMS Verification Codes</span>
                                            <span className="text-[10px] text-gray-400">Receive system confirmations directly via mobile SMS text.</span>
                                        </div>
                                    </label>

                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={weeklyReport}
                                            onChange={(e) => setWeeklyReport(e.target.checked)}
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4.5 w-4.5"
                                        />
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-xs font-semibold text-gray-850 dark:text-gray-200">Weekly Performance Analytics</span>
                                            <span className="text-[10px] text-gray-400">Receive analytics summary summaries every Monday morning.</span>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-gray-800">
                                <Button type="submit" isLoading={isSavingPrefs}>
                                    Save Preferences
                                </Button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Settings
