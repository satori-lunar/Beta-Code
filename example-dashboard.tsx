/**
 * Example Dashboard Component for Birch and Stone User Dashboard
 * This is a complete React component demonstrating all the features
 */

import { useEffect, useState } from 'react'
import { supabase, getUserProfile, getDashboardSettings, updateDashboardSettings, logActivity, getActivityLog } from './supabase-client'
import type { Database } from './supabase-types'

type UserProfile = Database['public']['Tables']['user_profiles']['Row']
type DashboardSettings = Database['public']['Tables']['dashboard_settings']['Row']
type ActivityLog = Database['public']['Tables']['activity_log']['Row']

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [settings, setSettings] = useState<DashboardSettings | null>(null)
  const [activities, setActivities] = useState<ActivityLog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        loadUserData(session.user.id)
      }
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        loadUserData(session.user.id)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function loadUserData(userId: string) {
    // Load profile
    const { data: profileData } = await getUserProfile(userId)
    setProfile(profileData)

    // Load settings
    const { data: settingsData } = await getDashboardSettings(userId)
    setSettings(settingsData)

    // Load activity log
    const { data: activitiesData } = await getActivityLog(userId, 10)
    setActivities(activitiesData || [])
  }

  async function handleThemeChange(theme: 'light' | 'dark' | 'auto') {
    if (!user) return

    const { data } = await updateDashboardSettings(user.id, { theme })
    if (data) {
      setSettings(data)
      await logActivity(user.id, 'settings_updated', `Changed theme to ${theme}`, {
        setting: 'theme',
        value: theme
      })
      // Reload activities to show the new log entry
      const { data: activitiesData } = await getActivityLog(user.id, 10)
      setActivities(activitiesData || [])
    }
  }

  async function handleNotificationsToggle() {
    if (!user || !settings) return

    const newValue = !settings.notifications_enabled
    const { data } = await updateDashboardSettings(user.id, {
      notifications_enabled: newValue
    })
    if (data) {
      setSettings(data)
      await logActivity(user.id, 'settings_updated', `${newValue ? 'Enabled' : 'Disabled'} notifications`, {
        setting: 'notifications_enabled',
        value: newValue
      })
      // Reload activities
      const { data: activitiesData } = await getActivityLog(user.id, 10)
      setActivities(activitiesData || [])
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    setProfile(null)
    setSettings(null)
    setActivities([])
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="max-w-md w-full space-y-4 p-8 bg-white rounded-lg shadow">
          <h1 className="text-2xl font-bold text-center">Sign In</h1>
          <p className="text-gray-600 text-center">
            Please sign in to access your dashboard
          </p>
          {/* Add your auth UI here */}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Birch & Stone Dashboard
            </h1>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Profile Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Profile</h2>
            <div className="space-y-3">
              {profile?.avatar_url && (
                <img
                  src={profile.avatar_url}
                  alt="Avatar"
                  className="w-20 h-20 rounded-full"
                />
              )}
              <div>
                <label className="text-sm font-medium text-gray-700">Name</label>
                <p className="text-gray-900">{profile?.full_name || 'Not set'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Email</label>
                <p className="text-gray-900">{profile?.email || user.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Bio</label>
                <p className="text-gray-900">{profile?.bio || 'No bio yet'}</p>
              </div>
              <div className="text-sm text-gray-500">
                Member since: {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}
              </div>
            </div>
          </div>

          {/* Settings Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Theme
                </label>
                <select
                  value={settings?.theme || 'light'}
                  onChange={(e) => handleThemeChange(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="auto">Auto</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Language
                </label>
                <p className="text-gray-900">{settings?.language || 'en'}</p>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Notifications
                </span>
                <button
                  onClick={handleNotificationsToggle}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings?.notifications_enabled ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings?.notifications_enabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Email Notifications
                </span>
                <span className="text-gray-900">
                  {settings?.email_notifications ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </div>
          </div>

          {/* Activity Log Card */}
          <div className="bg-white rounded-lg shadow p-6 md:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-3">
              {activities.length === 0 ? (
                <p className="text-gray-500">No activity yet</p>
              ) : (
                activities.map((activity) => (
                  <div
                    key={activity.id}
                    className="border-l-4 border-blue-500 pl-4 py-2"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900">{activity.action}</p>
                        {activity.description && (
                          <p className="text-sm text-gray-600">{activity.description}</p>
                        )}
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(activity.created_at!).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

