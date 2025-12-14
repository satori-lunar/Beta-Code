import { useState } from 'react';
import {
  Users,
  Video,
  Heart,
  Bell,
  Scale,
  TrendingUp,
  Calendar,
  BarChart3,
  Mail,
  Clock,
  Eye,
  Star
} from 'lucide-react';
import { useIsAdmin, useAllUsers, useAdminAnalytics } from '../hooks/useAdmin';
import { format, parseISO } from 'date-fns';

export default function AdminDashboard() {
  const { isAdmin, loading: adminLoading } = useIsAdmin();
  const { users, loading: usersLoading } = useAllUsers();
  const { analytics, loading: analyticsLoading } = useAdminAnalytics();
  const [selectedTab, setSelectedTab] = useState<'overview' | 'users' | 'videos' | 'reminders' | 'weight' | 'streaks' | 'logins'>('overview');

  if (adminLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-500">You do not have permission to access this page.</p>
        </div>
      </div>
    );
  }

  const loading = usersLoading || analyticsLoading;

  return (
    <div className="space-y-8 pb-20 lg:pb-0">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-display font-bold text-gray-900">
          Admin Dashboard
        </h1>
        <p className="text-gray-500 mt-1">Real-time analytics and user insights</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-100 overflow-x-auto scrollbar-hide">
        {[
          { id: 'overview', label: 'Overview', icon: BarChart3 },
          { id: 'users', label: 'Users', icon: Users },
          { id: 'videos', label: 'Video Views', icon: Video },
          { id: 'reminders', label: 'Reminders', icon: Bell },
          { id: 'weight', label: 'Weight Logs', icon: Scale },
          { id: 'streaks', label: 'Streaks', icon: TrendingUp },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors border-b-2 -mb-px whitespace-nowrap ${
              selectedTab === tab.id
                ? 'text-coral-600 border-coral-500'
                : 'text-gray-500 border-transparent hover:text-gray-700'
            }`}
          >
            <tab.icon className="w-5 h-5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {selectedTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Users</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {loading ? '...' : analytics?.totalUsers || 0}
                </p>
              </div>
              <Users className="w-12 h-12 text-coral-500 opacity-20" />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Video Views</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {loading ? '...' : analytics?.videoViews?.length || 0}
                </p>
              </div>
              <Eye className="w-12 h-12 text-blue-500 opacity-20" />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Favorites</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {loading ? '...' : analytics?.favorites?.length || 0}
                </p>
              </div>
              <Heart className="w-12 h-12 text-red-500 opacity-20" />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Reminders Set</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {loading ? '...' : analytics?.reminders?.length || 0}
                </p>
              </div>
              <Bell className="w-12 h-12 text-purple-500 opacity-20" />
            </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {selectedTab === 'users' && (
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">All Users</h2>
          {loading ? (
            <p className="text-gray-500">Loading users...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Role</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Streak</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-gray-100">
                      <td className="py-3 px-4">{user.name}</td>
                      <td className="py-3 px-4">{user.email}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {user.role || 'member'}
                        </span>
                      </td>
                      <td className="py-3 px-4">{user.streak || 0}</td>
                      <td className="py-3 px-4">
                        {user.join_date ? format(parseISO(user.join_date), 'MMM d, yyyy') : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Video Views Tab */}
      {selectedTab === 'videos' && (
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Video Views</h2>
          {loading ? (
            <p className="text-gray-500">Loading video views...</p>
          ) : (
            <div className="space-y-4">
              {analytics?.videoViews?.map((view: any) => (
                <div key={view.id} className="border-b border-gray-100 pb-4 last:border-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">
                        {view.recorded_sessions?.title || 'Unknown Session'}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Viewed by: {view.users?.email || 'Unknown'} • {view.viewed_at ? format(parseISO(view.viewed_at), 'MMM d, h:mm a') : 'N/A'}
                      </p>
                    </div>
                    <Eye className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              ))}
              {(!analytics?.videoViews || analytics.videoViews.length === 0) && (
                <p className="text-gray-500 text-center py-8">No video views yet</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Reminders Tab */}
      {selectedTab === 'reminders' && (
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Email Reminders</h2>
          <p className="text-sm text-gray-500 mb-4">
            Email domain: <span className="font-mono bg-gray-100 px-2 py-1 rounded">noreply@birchandstone.com</span>
            <br />
            <span className="text-xs text-gray-400">Configured in Supabase Edge Function</span>
          </p>
          {loading ? (
            <p className="text-gray-500">Loading reminders...</p>
          ) : (
            <div className="space-y-4">
              {analytics?.reminders?.map((reminder: any) => (
                <div key={reminder.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-gray-900">
                        {reminder.live_classes?.title || 'Unknown Class'}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        <Mail className="w-4 h-4 inline mr-1" />
                        {reminder.users?.email || reminder.users?.name || 'Unknown'} • {reminder.reminder_minutes_before} min before
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Class: {reminder.live_classes?.scheduled_at ? format(parseISO(reminder.live_classes.scheduled_at), 'EEEE, MMM d, h:mm a') : 'N/A'}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Set: {reminder.created_at ? format(parseISO(reminder.created_at), 'MMM d, h:mm a') : 'N/A'}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        reminder.sent ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {reminder.sent ? 'Sent' : 'Pending'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              {(!analytics?.reminders || analytics.reminders.length === 0) && (
                <p className="text-gray-500 text-center py-8">No reminders set yet</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Weight Logs Tab */}
      {selectedTab === 'weight' && (
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Weight Logs</h2>
          {loading ? (
            <p className="text-gray-500">Loading weight logs...</p>
          ) : (
            <div className="space-y-4">
              {analytics?.weightLogs?.map((entry: any) => (
                <div key={entry.id} className="border-b border-gray-100 pb-4 last:border-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">
                        {entry.users?.name || entry.users?.email || 'Unknown User'}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {entry.weight} {entry.unit || 'lbs'} • {format(parseISO(entry.date), 'MMM d, yyyy')}
                      </p>
                    </div>
                    <Scale className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              ))}
              {(!analytics?.weightLogs || analytics.weightLogs.length === 0) && (
                <p className="text-gray-500 text-center py-8">No weight logs yet</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Streaks Tab */}
      {selectedTab === 'streaks' && (
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">User Streaks</h2>
          {loading ? (
            <p className="text-gray-500">Loading streaks...</p>
          ) : (
            <div className="space-y-4">
              {analytics?.userStreaks
                ?.sort((a: any, b: any) => (b.streak || 0) - (a.streak || 0))
                .map((user: any) => (
                  <div key={user.id} className="border-b border-gray-100 pb-4 last:border-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{user.name || user.email}</p>
                        <p className="text-sm text-gray-500 mt-1">{user.email}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-coral-600">{user.streak || 0}</p>
                        <p className="text-xs text-gray-500">day streak</p>
                      </div>
                    </div>
                  </div>
                ))}
              {(!analytics?.userStreaks || analytics.userStreaks.length === 0) && (
                <p className="text-gray-500 text-center py-8">No streak data yet</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Logins Tab */}
      {selectedTab === 'logins' && (
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Login Activity</h2>
          {loading ? (
            <p className="text-gray-500">Loading login data...</p>
          ) : (
            <div className="space-y-4">
              {analytics?.logins?.map((login: any) => (
                <div key={login.id} className="border-b border-gray-100 pb-4 last:border-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">
                        {login.users?.name || login.users?.email || 'Unknown User'}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {login.login_at ? format(parseISO(login.login_at), 'MMM d, yyyy h:mm a') : 'N/A'}
                        {login.ip_address && ` • IP: ${login.ip_address}`}
                      </p>
                    </div>
                    <Clock className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              ))}
              {(!analytics?.logins || analytics.logins.length === 0) && (
                <p className="text-gray-500 text-center py-8">No login data yet</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
