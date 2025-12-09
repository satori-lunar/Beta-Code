import { useState } from 'react';
import {
  Bell,
  Moon,
  Globe,
  Lock,
  HelpCircle,
  ChevronRight,
  Camera,
  Save
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
          {[
            { label: 'Privacy Settings', icon: Lock },
            { label: 'Language', icon: Globe, value: 'English' },
            { label: 'Dark Mode', icon: Moon },
            { label: 'Help & Support', icon: HelpCircle },
          ].map((item) => (
            <button
              key={item.label}
              className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700">{item.label}</span>
              </div>
              <div className="flex items-center gap-2">
                {item.value && <span className="text-sm text-gray-500">{item.value}</span>}
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* App Info */}
      <div className="text-center text-sm text-gray-500">
        <p>Wellness Dashboard v1.0.0</p>
        <p className="mt-1">Made with care for your wellbeing</p>
      </div>
    </div>
  );
}
