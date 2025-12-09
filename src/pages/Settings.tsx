import { useState } from 'react';
import {
  Bell,
  Moon,
  Sun,
  Globe,
  Lock,
  HelpCircle,
  ChevronRight,
  Camera,
  Save,
  X,
  Check,
  Shield,
  Eye,
  EyeOff,
  Database,
  Trash2,
  Download,
  MessageCircle
} from 'lucide-react';
import { useStore } from '../store/useStore';

export default function Settings() {
  const { user, setUser } = useStore();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [notifications, setNotifications] = useState({
    reminders: true,
    classAlerts: true,
    weeklyProgress: true,
    achievements: true,
  });
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('English');
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [privacySettings, setPrivacySettings] = useState({
    profileVisible: true,
    showProgress: true,
    shareData: false,
  });

  const languages = ['English', 'Spanish', 'French', 'German', 'Portuguese', 'Japanese', 'Chinese'];


  const handleSaveProfile = () => {
    if (user) {
      setUser({ ...user, name, email });
    }
  };

  const settingsSections = [
    {
      title: 'Notifications',
      icon: Bell,
      items: [
        { label: 'Daily Reminders', key: 'reminders' },
        { label: 'Class Alerts', key: 'classAlerts' },
        { label: 'Weekly Progress', key: 'weeklyProgress' },
        { label: 'Achievement Alerts', key: 'achievements' },
      ],
    },
  ];

  return (
    <div className="space-y-8 pb-20 lg:pb-0 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-display font-bold text-gray-900">
          Settings
        </h1>
        <p className="text-gray-500 mt-1">Manage your account and preferences</p>
      </div>

      {/* Profile Section */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Profile</h2>

        <div className="flex items-center gap-6 mb-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-coral-200 to-coral-400 flex items-center justify-center text-white text-2xl font-bold">
              {name.charAt(0) || 'U'}
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors">
              <Camera className="w-4 h-4 text-gray-600" />
            </button>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{user?.name}</h3>
            <p className="text-sm text-gray-500">Member since {user?.joinDate}</p>
          </div>
        </div>

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

      {/* Notifications */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <Bell className="w-5 h-5 text-gray-400" />
          Notifications
        </h2>

        <div className="space-y-4">
          {settingsSections[0].items.map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
            >
              <span className="text-gray-700">{item.label}</span>
              <button
                onClick={() =>
                  setNotifications({
                    ...notifications,
                    [item.key]: !notifications[item.key as keyof typeof notifications],
                  })
                }
                className={`relative w-12 h-7 rounded-full transition-colors ${
                  notifications[item.key as keyof typeof notifications]
                    ? 'bg-coral-500'
                    : 'bg-gray-200'
                }`}
              >
                <div
                  className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    notifications[item.key as keyof typeof notifications]
                      ? 'translate-x-6'
                      : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
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

          {/* Language */}
          <button
            onClick={() => setShowLanguageModal(true)}
            className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-gray-400" />
              <span className="text-gray-700">Language</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">{language}</span>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              {darkMode ? (
                <Moon className="w-5 h-5 text-gray-400" />
              ) : (
                <Sun className="w-5 h-5 text-gray-400" />
              )}
              <span className="text-gray-700">Dark Mode</span>
            </div>
            <div
              className={`relative w-12 h-7 rounded-full transition-colors ${
                darkMode ? 'bg-coral-500' : 'bg-gray-200'
              }`}
            >
              <div
                className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  darkMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </div>
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

      {/* Language Modal */}
      {showLanguageModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">Select Language</h3>
              <button
                onClick={() => setShowLanguageModal(false)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-2 max-h-80 overflow-y-auto">
              {languages.map((lang) => (
                <button
                  key={lang}
                  onClick={() => {
                    setLanguage(lang);
                    setShowLanguageModal(false);
                  }}
                  className={`w-full flex items-center justify-between p-4 rounded-xl transition-colors ${
                    language === lang ? 'bg-coral-50 text-coral-600' : 'hover:bg-gray-50'
                  }`}
                >
                  <span>{lang}</span>
                  {language === lang && <Check className="w-5 h-5" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Privacy Modal */}
      {showPrivacyModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden">
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
                  className={`relative w-12 h-7 rounded-full transition-colors ${
                    privacySettings.profileVisible ? 'bg-coral-500' : 'bg-gray-200'
                  }`}
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
                  className={`relative w-12 h-7 rounded-full transition-colors ${
                    privacySettings.showProgress ? 'bg-coral-500' : 'bg-gray-200'
                  }`}
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
                  className={`relative w-12 h-7 rounded-full transition-colors ${
                    privacySettings.shareData ? 'bg-coral-500' : 'bg-gray-200'
                  }`}
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden">
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
                <div className="w-12 h-12 bg-coral-100 rounded-full flex items-center justify-center text-coral-600">
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
