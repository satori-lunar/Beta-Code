import { useState } from 'react';
import {
  Bell,
  Moon,
  Sun,
  Lock,
  HelpCircle,
  ChevronRight,
  Save,
  X,
  Check,
  Shield,
  Eye,
  EyeOff,
  Database,
  Trash2,
  Download,
  MessageCircle,
  Palette,
  Activity,
  Watch,
  Smartphone,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useUserProfile, useNotificationPreferences } from '../hooks/useSupabaseData';
import { supabase } from '../lib/supabase';
import { useTheme } from '../contexts/ThemeContext';
// AvatarBuilder and AvatarDisplay removed while profile avatar is disabled
import ComingSoonModal from '../components/ComingSoonModal';

export default function Settings() {
  const { user } = useAuth();
  const { profile } = useUserProfile();
  const { colorPreset, setColorPreset, isDark, toggleDark, colorPresets, primaryColor } = useTheme();
  const { preferences: notificationPrefs, loading: prefsLoading, updatePreferences } = useNotificationPreferences();
  const [name, setName] = useState(user?.user_metadata?.name || user?.email?.split('@')[0] || '');
  const [email, setEmail] = useState(user?.email || '');
  // Language selection temporarily disabled
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  // Avatar customization temporarily disabled
  const [showColorModal, setShowColorModal] = useState(false);
  const [showComingSoonModal, setShowComingSoonModal] = useState(false);
  const [comingSoonFeature, setComingSoonFeature] = useState('');
  const [privacySettings, setPrivacySettings] = useState({
    profileVisible: true,
    showProgress: true,
    shareData: false,
  });

  const handleSaveProfile = async () => {
    if (!user) return;

    // Update user metadata in Supabase Auth
    await supabase.auth.updateUser({
      email: email,
      data: { name: name }
    });

    // Update or create user profile (without avatar while avatar UI is disabled)
    if (profile) {
      await supabase
        .from('user_profiles')
        .update({ 
          full_name: name
        })
        .eq('id', user.id);
    } else {
      await supabase
        .from('user_profiles')
        .insert({ 
          id: user.id,
          full_name: name
        });
    }
  };

  const handleDeviceConnect = (deviceName: string) => {
    setComingSoonFeature(`${deviceName} Integration`);
    setShowComingSoonModal(true);
  };

  const handleNotificationPreferenceChange = async (field: string, value: any) => {
    if (!notificationPrefs) return
    await updatePreferences({ [field]: value })
  }

  return (
    <div className="space-y-8 pb-20 lg:pb-0 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-display font-bold text-gray-900">
          Settings
        </h1>
        <p className="text-gray-500 mt-1">Manage your account and preferences</p>
      </div>

      {/* Profile Section (avatar removed) */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Profile</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
            />
          </div>

          <button
            onClick={handleSaveProfile}
            className="btn-primary flex items-center gap-2"
          >
            <Save className="w-5 h-5" />
            Save Changes
          </button>
        </div>
      </div>

      {/* Appearance Section */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <Palette className="w-5 h-5 text-gray-400" />
          Appearance
        </h2>

        <div className="space-y-4">
          {/* Color Theme */}
          <button
            onClick={() => setShowColorModal(true)}
            className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors border border-gray-100"
          >
            <div className="flex items-center gap-3">
              <div className="flex -space-x-1">
                {colorPresets[colorPreset].colors.slice(0, 3).map((color, i) => (
                  <div
                    key={i}
                    className="w-6 h-6 rounded-full border-2 border-white"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <div className="text-left">
                <span className="text-gray-700 font-medium">Color Theme</span>
                <p className="text-sm text-gray-500">{colorPresets[colorPreset].name}</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>

          {/* Dark Mode Toggle */}
          <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100">
            <div className="flex items-center gap-3">
              {isDark ? (
                <Moon className="w-5 h-5 text-gray-400" />
              ) : (
                <Sun className="w-5 h-5 text-gray-400" />
              )}
              <span className="text-gray-700">Dark Mode</span>
            </div>
            <button
              onClick={toggleDark}
              className="relative w-12 h-7 rounded-full transition-colors"
              style={{ backgroundColor: isDark ? primaryColor : '#e5e7eb' }}
            >
              <div
                className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  isDark ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Health Integrations */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <Activity className="w-5 h-5 text-gray-400" />
          Health Integrations
        </h2>

        <div className="space-y-3">
          {/* Fitbit */}
          <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center">
                <Watch className="w-5 h-5 text-teal-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Fitbit</p>
                <p className="text-sm text-gray-500">Sync activity, sleep & heart rate</p>
              </div>
            </div>
            <button
              onClick={() => handleDeviceConnect('Fitbit')}
              className="flex items-center gap-1 px-3 py-1.5 bg-teal-500 text-white rounded-lg text-sm font-medium hover:bg-teal-600 transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              Connect
            </button>
          </div>

          {/* Apple Health */}
          <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Apple Health</p>
                <p className="text-sm text-gray-500">Sync from your iPhone</p>
              </div>
            </div>
            <button
              onClick={() => handleDeviceConnect('Apple Health')}
              className="flex items-center gap-1 px-3 py-1.5 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              Connect
            </button>
          </div>

          {/* Google Fit */}
          <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <Activity className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Google Fit</p>
                <p className="text-sm text-gray-500">Sync workouts & activity</p>
              </div>
            </div>
            <button
              onClick={() => handleDeviceConnect('Google Fit')}
              className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              Connect
            </button>
          </div>
        </div>

        <p className="text-xs text-gray-500 mt-4">
          Device integrations are coming soon! We'll notify you when they're ready.
        </p>
      </div>

      {/* Notifications */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <Bell className="w-5 h-5 text-gray-400" />
          Notifications & Reminders
        </h2>

        {prefsLoading ? (
          <div className="text-center py-8 text-gray-500">Loading preferences...</div>
        ) : notificationPrefs ? (
          <div className="space-y-6">
            {/* Habit Reminders */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Habit Reminders</p>
                  <p className="text-sm text-gray-500">Get reminded to complete your daily habits</p>
                </div>
                <button
                  onClick={() => handleNotificationPreferenceChange('habit_reminders_enabled', !notificationPrefs.habit_reminders_enabled)}
                  className="relative w-12 h-7 rounded-full transition-colors"
                  style={{
                    backgroundColor: notificationPrefs.habit_reminders_enabled ? primaryColor : '#e5e7eb'
                  }}
                >
                  <div
                    className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      notificationPrefs.habit_reminders_enabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              {notificationPrefs.habit_reminders_enabled && (
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Reminder Time</label>
                  <input
                    type="time"
                    value={notificationPrefs.habit_reminder_time?.slice(0, 5) || '09:00'}
                    onChange={(e) => handleNotificationPreferenceChange('habit_reminder_time', e.target.value + ':00')}
                    className="input text-sm"
                  />
                </div>
              )}
            </div>

            {/* Journal Reminders */}
            <div className="space-y-3 border-t border-gray-100 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Journal Reminders</p>
                  <p className="text-sm text-gray-500">Reminders to write in your journal</p>
                </div>
                <button
                  onClick={() => handleNotificationPreferenceChange('journal_reminders_enabled', !notificationPrefs.journal_reminders_enabled)}
                  className="relative w-12 h-7 rounded-full transition-colors"
                  style={{
                    backgroundColor: notificationPrefs.journal_reminders_enabled ? primaryColor : '#e5e7eb'
                  }}
                >
                  <div
                    className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      notificationPrefs.journal_reminders_enabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              {notificationPrefs.journal_reminders_enabled && (
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Reminder Time</label>
                  <input
                    type="time"
                    value={notificationPrefs.journal_reminder_time?.slice(0, 5) || '20:00'}
                    onChange={(e) => handleNotificationPreferenceChange('journal_reminder_time', e.target.value + ':00')}
                    className="input text-sm"
                  />
                </div>
              )}
            </div>

            {/* Mental Health Reminders */}
            <div className="space-y-3 border-t border-gray-100 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Mental Health Reminders</p>
                  <p className="text-sm text-gray-500">Reminders for mindfulness and mental health exercises</p>
                </div>
                <button
                  onClick={() => handleNotificationPreferenceChange('mental_health_reminders_enabled', !notificationPrefs.mental_health_reminders_enabled)}
                  className="relative w-12 h-7 rounded-full transition-colors"
                  style={{
                    backgroundColor: notificationPrefs.mental_health_reminders_enabled ? primaryColor : '#e5e7eb'
                  }}
                >
                  <div
                    className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      notificationPrefs.mental_health_reminders_enabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              {notificationPrefs.mental_health_reminders_enabled && (
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Reminder Time</label>
                  <input
                    type="time"
                    value={notificationPrefs.mental_health_reminder_time?.slice(0, 5) || '14:00'}
                    onChange={(e) => handleNotificationPreferenceChange('mental_health_reminder_time', e.target.value + ':00')}
                    className="input text-sm"
                  />
                </div>
              )}
            </div>

            {/* Goal Reminders */}
            <div className="space-y-3 border-t border-gray-100 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Goal Reminders</p>
                  <p className="text-sm text-gray-500">Get reminded about your active goals</p>
                </div>
                <button
                  onClick={() => handleNotificationPreferenceChange('goal_reminders_enabled', !notificationPrefs.goal_reminders_enabled)}
                  className="relative w-12 h-7 rounded-full transition-colors"
                  style={{
                    backgroundColor: notificationPrefs.goal_reminders_enabled ? primaryColor : '#e5e7eb'
                  }}
                >
                  <div
                    className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      notificationPrefs.goal_reminders_enabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              {notificationPrefs.goal_reminders_enabled && (
                <>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Frequency</label>
                    <select
                      value={notificationPrefs.goal_reminder_frequency || 'daily'}
                      onChange={(e) => handleNotificationPreferenceChange('goal_reminder_frequency', e.target.value)}
                      className="input text-sm"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly (Mondays)</option>
                      <option value="never">Never</option>
                    </select>
                  </div>
                  {notificationPrefs.goal_reminder_frequency !== 'never' && (
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Reminder Time</label>
                      <input
                        type="time"
                        value={notificationPrefs.goal_reminder_time?.slice(0, 5) || '10:00'}
                        onChange={(e) => handleNotificationPreferenceChange('goal_reminder_time', e.target.value + ':00')}
                        className="input text-sm"
                      />
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Achievement Notifications */}
            <div className="flex items-center justify-between border-t border-gray-100 pt-4">
              <div>
                <p className="font-medium text-gray-900">Achievement Notifications</p>
                <p className="text-sm text-gray-500">Get notified when you earn badges</p>
              </div>
              <button
                onClick={() => handleNotificationPreferenceChange('achievement_notifications_enabled', !notificationPrefs.achievement_notifications_enabled)}
                className="relative w-12 h-7 rounded-full transition-colors"
                style={{
                  backgroundColor: notificationPrefs.achievement_notifications_enabled ? primaryColor : '#e5e7eb'
                }}
              >
                <div
                  className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    notificationPrefs.achievement_notifications_enabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Streak Reminders */}
            <div className="flex items-center justify-between border-t border-gray-100 pt-4">
              <div>
                <p className="font-medium text-gray-900">Streak Reminders</p>
                <p className="text-sm text-gray-500">Get reminders to maintain your streaks</p>
              </div>
              <button
                onClick={() => handleNotificationPreferenceChange('streak_reminders_enabled', !notificationPrefs.streak_reminders_enabled)}
                className="relative w-12 h-7 rounded-full transition-colors"
                style={{
                  backgroundColor: notificationPrefs.streak_reminders_enabled ? primaryColor : '#e5e7eb'
                }}
              >
                <div
                  className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    notificationPrefs.streak_reminders_enabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">Unable to load notification preferences</div>
        )}
      </div>

      {/* Quick Links */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">More Options</h2>

        <div className="space-y-1">
          {/* Privacy Settings */}
          <button
            onClick={() => setShowPrivacyModal(true)}
            className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-gray-400" />
              <span className="text-gray-700">Privacy Settings</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>

          {/* Help & Support */}
          <button
            onClick={() => setShowHelpModal(true)}
            className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <HelpCircle className="w-5 h-5 text-gray-400" />
              <span className="text-gray-700">Help & Support</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>

      {/* App Info */}
      <div className="text-center text-sm text-gray-500">
        <p>Wellness Dashboard v1.0.0</p>
        <p className="mt-1">Made with care for your wellbeing</p>
      </div>

      {/* Coming Soon Modal */}
      <ComingSoonModal
        isOpen={showComingSoonModal}
        onClose={() => setShowComingSoonModal(false)}
        feature={comingSoonFeature}
        description="We're working hard to bring you seamless device integrations. Connect your favorite fitness trackers and health devices to automatically sync your data!"
      />

      {/* Color Theme Modal */}
      {showColorModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden my-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">Color Theme</h3>
              <button
                onClick={() => setShowColorModal(false)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-4 space-y-3">
              {Object.entries(colorPresets).map(([key, preset]) => (
                <button
                  key={key}
                  onClick={() => {
                    setColorPreset(key);
                    setShowColorModal(false);
                  }}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl transition-colors ${
                    colorPreset === key ? 'ring-2' : 'hover:bg-gray-50'
                  }`}
                  style={colorPreset === key ? {
                    backgroundColor: preset.light,
                    ['--tw-ring-color' as string]: `${preset.colors[0]}40`
                  } : undefined}
                >
                  <div className="flex -space-x-1">
                    {preset.colors.map((color, i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <span className="font-medium text-gray-900">{preset.name}</span>
                  {colorPreset === key && (
                    <Check className="w-5 h-5 ml-auto" style={{ color: preset.colors[0] }} />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Privacy Modal */}
      {showPrivacyModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden my-auto max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Shield className="w-5 h-5 text-gray-400" />
                Privacy Settings
              </h3>
              <button
                onClick={() => setShowPrivacyModal(false)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              {/* Profile Visibility */}
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  {privacySettings.profileVisible ? (
                    <Eye className="w-5 h-5 text-gray-400" />
                  ) : (
                    <EyeOff className="w-5 h-5 text-gray-400" />
                  )}
                  <div>
                    <p className="font-medium text-gray-900">Profile Visibility</p>
                    <p className="text-sm text-gray-500">Allow others to see your profile</p>
                  </div>
                </div>
                <button
                  onClick={() =>
                    setPrivacySettings({
                      ...privacySettings,
                      profileVisible: !privacySettings.profileVisible,
                    })
                  }
                  className="relative w-12 h-7 rounded-full transition-colors"
                  style={{ backgroundColor: privacySettings.profileVisible ? primaryColor : '#e5e7eb' }}
                >
                  <div
                    className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      privacySettings.profileVisible ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Show Progress */}
              <div className="flex items-center justify-between py-3 border-t border-gray-100">
                <div className="flex items-center gap-3">
                  <Database className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">Show Progress</p>
                    <p className="text-sm text-gray-500">Display your wellness progress</p>
                  </div>
                </div>
                <button
                  onClick={() =>
                    setPrivacySettings({
                      ...privacySettings,
                      showProgress: !privacySettings.showProgress,
                    })
                  }
                  className="relative w-12 h-7 rounded-full transition-colors"
                  style={{ backgroundColor: privacySettings.showProgress ? primaryColor : '#e5e7eb' }}
                >
                  <div
                    className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      privacySettings.showProgress ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Share Data */}
              <div className="flex items-center justify-between py-3 border-t border-gray-100">
                <div className="flex items-center gap-3">
                  <Download className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">Share Anonymous Data</p>
                    <p className="text-sm text-gray-500">Help improve the app</p>
                  </div>
                </div>
                <button
                  onClick={() =>
                    setPrivacySettings({
                      ...privacySettings,
                      shareData: !privacySettings.shareData,
                    })
                  }
                  className="relative w-12 h-7 rounded-full transition-colors"
                  style={{ backgroundColor: privacySettings.shareData ? primaryColor : '#e5e7eb' }}
                >
                  <div
                    className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      privacySettings.shareData ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Danger Zone */}
              <div className="pt-4 border-t border-gray-100">
                <button className="w-full flex items-center justify-center gap-2 p-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors">
                  <Trash2 className="w-5 h-5" />
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Help & Support Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden my-auto max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-gray-400" />
                Help & Support
              </h3>
              <button
                onClick={() => setShowHelpModal(false)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-4 space-y-3">
              <a
                href="#"
                className="flex items-center gap-4 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: colorPresets[colorPreset]?.light, color: primaryColor }}
                >
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Chat with Support</p>
                  <p className="text-sm text-gray-500">Get help from our team</p>
                </div>
              </a>

              <a
                href="mailto:support@wellnessdashboard.com"
                className="flex items-center gap-4 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Email Us</p>
                  <p className="text-sm text-gray-500">support@wellnessdashboard.com</p>
                </div>
              </a>

              <a
                href="#"
                className="flex items-center gap-4 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Documentation</p>
                  <p className="text-sm text-gray-500">Read our guides and FAQs</p>
                </div>
              </a>
            </div>
            <div className="p-4 bg-gray-50 border-t border-gray-100">
              <p className="text-sm text-gray-500 text-center">
                You can also use the help button in the bottom right corner for quick support.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
