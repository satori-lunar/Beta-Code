import { useState } from 'react';
import {
  Users,
  Video,
  Heart,
  Bell,
  Scale,
  TrendingUp,
  BarChart3,
  Mail,
  Clock,
  Eye,
  MessageCircle,
  Target
} from 'lucide-react';
import { useIsAdmin, useAllUsers, useAdminAnalytics } from '../hooks/useAdmin';
import { supabase } from '../lib/supabase';
import { format, parseISO } from 'date-fns';

export default function AdminDashboard() {
  const { isAdmin, loading: adminLoading } = useIsAdmin();
  const { users, loading: usersLoading } = useAllUsers();
  const { analytics, loading: analyticsLoading } = useAdminAnalytics();
  const [selectedTab, setSelectedTab] = useState<'overview' | 'users' | 'videos' | 'reminders' | 'weight' | 'habits' | 'badges' | 'logins' | 'support'>('overview');
  const [selectedUserId, setSelectedUserId] = useState<string>(''); // Filter by user
  const [selectedClassId, setSelectedClassId] = useState<string>(''); // Filter reminders by class
  const [tickets, setTickets] = useState<any[]>([]);
  const [ticketsLoading, setTicketsLoading] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
  const [ticketMessages, setTicketMessages] = useState<any[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [newConversationUserId, setNewConversationUserId] = useState<string>('');

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

  // Debug: Log admin status and data
  console.log('Admin Dashboard State:', {
    isAdmin,
    usersLoading,
    analyticsLoading,
    usersCount: users.length,
    hasAnalytics: !!analytics,
  });

  // Debug: Log analytics data
  if (analytics && !analyticsLoading) {
    console.log('Admin Dashboard Analytics:', {
      totalUsers: analytics.totalUsers,
      videoViews: analytics.videoViews?.length || 0,
      reminders: analytics.reminders?.length || 0,
      weightLogs: analytics.weightLogs?.length || 0,
      habits: analytics.habits?.length || 0,
      habitCompletions: analytics.habitCompletions?.length || 0,
    });
  }

  // Load help tickets for the Support tab
  const loadTickets = async () => {
    if (!isAdmin) return;
    setTicketsLoading(true);
    try {
      const { data: rawTickets, error } = await (supabase as any)
        .from('help_tickets')
        .select('id, user_id, subject, message, status, created_at, updated_at')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading help tickets:', error);
        return;
      }

      const ticketsData = rawTickets || [];

      // Enrich tickets with user info for nicer display
      const userIds = Array.from(
        new Set<string>(ticketsData.map((t: any) => t.user_id).filter(Boolean))
      );

      let userMap = new Map<string, any>();
      if (userIds.length > 0) {
        const { data: ticketUsers, error: usersError } = await (supabase as any)
          .from('users')
          .select('id, name, email')
          .in('id', userIds);

        if (usersError) {
          console.error('Error loading users for tickets:', usersError);
        } else {
          userMap = new Map((ticketUsers || []).map((u: any) => [u.id, u]));
        }
      }

      const enrichedTickets = ticketsData.map((t: any) => ({
        ...t,
        user: userMap.get(t.user_id)
      }));

      setTickets(enrichedTickets);
    } finally {
      setTicketsLoading(false);
    }
  };

  const loadMessagesForTicket = async (ticket: any) => {
    if (!ticket) return;
    setMessagesLoading(true);
    try {
      const { data, error } = await (supabase as any)
        .from('help_messages')
        .select('id, message, sender_role, created_at')
        .eq('ticket_id', ticket.id)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error loading ticket messages:', error);
        setTicketMessages([]);
        return;
      }

      setTicketMessages(data || []);
    } finally {
      setMessagesLoading(false);
    }
  };

  const handleSelectTicket = async (ticket: any) => {
    setSelectedTicket(ticket);
    setReplyText('');
    await loadMessagesForTicket(ticket);
  };

  const handleSendReply = async () => {
    if (!selectedTicket || !replyText.trim()) return;

    try {
      setMessagesLoading(true);

      // Insert admin reply
      const { error: msgError } = await (supabase as any)
        .from('help_messages')
        .insert({
          ticket_id: selectedTicket.id,
          sender_id: (await supabase.auth.getUser()).data.user?.id,
          sender_role: 'admin',
          message: replyText.trim()
        } as any);

      if (msgError) {
        console.error('Error sending reply:', msgError);
        return;
      }

      // Mark ticket as in_progress by default when admin replies
      const { error: ticketError } = await (supabase as any)
        .from('help_tickets')
        .update({ status: 'in_progress' } as any)
        .eq('id', selectedTicket.id);

      if (ticketError) {
        console.error('Error updating ticket status:', ticketError);
      }

      setReplyText('');
      await loadMessagesForTicket(selectedTicket);
      await loadTickets();
    } finally {
      setMessagesLoading(false);
    }
  };

  const startConversationWithUser = async () => {
    if (!newConversationUserId) return;
    try {
      setTicketsLoading(true);

      const { data: newTicket, error } = await (supabase as any)
        .from('help_tickets')
        .insert({
          user_id: newConversationUserId,
          subject: 'Help Desk Chat',
          message: 'Conversation started by admin',
          status: 'open'
        } as any)
        .select('*')
        .single();

      if (error || !newTicket) {
        console.error('Error starting new conversation:', error);
        return;
      }

      const userForTicket = users.find((u: any) => u.id === newConversationUserId);
      const enrichedTicket = { ...newTicket, user: userForTicket };

      setTickets((prev) => [enrichedTicket, ...prev]);
      setNewConversationUserId('');
      await handleSelectTicket(enrichedTicket);
    } finally {
      setTicketsLoading(false);
    }
  };

  // Auto-load tickets when switching to Support tab
  if (selectedTab === 'support' && tickets.length === 0 && !ticketsLoading && isAdmin) {
    void loadTickets();
  }

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
          { id: 'habits', label: 'Habits', icon: Target },
          { id: 'badges', label: 'Badges', icon: Target },
          { id: 'support', label: 'Support', icon: MessageCircle },
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

      {/* User Filter - Show for tabs that have user-specific data */}
      {(selectedTab === 'videos' || selectedTab === 'reminders' || selectedTab === 'weight' || selectedTab === 'habits') && (
        <div className="card">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">Filter by User:</label>
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="flex-1 max-w-xs input text-sm"
            >
              <option value="">All Users ({users.length})</option>
              {users.map((user: any) => (
                <option key={user.id} value={user.id}>
                  {user.name || user.email} ({user.email})
                </option>
              ))}
            </select>
            {selectedUserId && (
              <button
                onClick={() => setSelectedUserId('')}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Clear Filter
              </button>
            )}
          </div>
        </div>
      )}

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
        <div className="space-y-4">
          {/* Debug Info */}
          <div className="card bg-blue-50 border-blue-200">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">Debug Information</h3>
            <div className="text-xs text-blue-700 space-y-1">
              <p>Admin Status: {isAdmin ? '✅ Yes' : '❌ No'}</p>
              <p>Loading Users: {usersLoading ? '⏳ Yes' : '✅ No'}</p>
              <p>Users Count: {users.length}</p>
              <p>Analytics Loading: {analyticsLoading ? '⏳ Yes' : '✅ No'}</p>
              <p>Total Users (from analytics): {analytics?.totalUsers || 'N/A'}</p>
              <p className="mt-2 text-blue-600">Check browser console (F12) for detailed logs</p>
            </div>
          </div>

          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              All Users ({users.length})
            </h2>
            {loading ? (
              <p className="text-gray-500">Loading users...</p>
            ) : users.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-2">No users found</p>
                <p className="text-sm text-gray-400">
                  Check browser console for errors. Make sure you've run the admin policy migrations in Supabase.
                </p>
              </div>
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
        </div>
      )}

      {/* Video Views Tab */}
      {selectedTab === 'videos' && (
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recorded Classes Watched</h2>
          {loading ? (
            <p className="text-gray-500">Loading video views...</p>
          ) : (
            <div className="space-y-4">
              {analytics?.videoViews
                ?.filter((view: any) => !selectedUserId || view.user_id === selectedUserId)
                .map((view: any) => (
                <div key={view.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 mb-1">
                        {view.entity_title || view.recorded_sessions?.title || view.activity_description || 'Unknown Session'}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        <span className="font-medium">{view.users?.name || view.users?.email || 'Unknown User'}</span>
                        {' • '}
                        {view.users?.email && view.users?.name && (
                          <span className="text-gray-500">{view.users.email}</span>
                        )}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Watched: {view.viewed_at || view.created_at ? format(parseISO(view.viewed_at || view.created_at), 'MMM d, yyyy h:mm a') : 'N/A'}
                      </p>
                    </div>
                    <Eye className="w-5 h-5 text-gray-400 flex-shrink-0 ml-4" />
                  </div>
                </div>
              ))}
              {(!analytics?.videoViews || analytics.videoViews.filter((v: any) => !selectedUserId || v.user_id === selectedUserId).length === 0) && (
                <p className="text-gray-500 text-center py-8">
                  {selectedUserId ? 'No video views for this user' : 'No video views yet'}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Reminders Tab */}
      {selectedTab === 'reminders' && (
        <div className="space-y-4">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Class Reminders Set</h2>
              <div className="flex items-center gap-3">
                <label className="text-sm text-gray-600">Filter by class:</label>
                <select
                  value={selectedClassId}
                  onChange={(e) => setSelectedClassId(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-coral-500 focus:border-transparent"
                >
                  <option value="">All Classes</option>
                  {analytics?.reminders
                    ?.reduce((acc: any[], reminder: any) => {
                      const classId = reminder.class_id;
                      const className = reminder.live_classes?.title || 'Unknown Class';
                      if (classId && !acc.find(c => c.id === classId)) {
                        acc.push({ id: classId, name: className });
                      }
                      return acc;
                    }, [])
                    .sort((a: any, b: any) => a.name.localeCompare(b.name))
                    .map((classItem: any) => (
                      <option key={classItem.id} value={classItem.id}>
                        {classItem.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Email domain: <span className="font-mono bg-gray-100 px-2 py-1 rounded">noreply@mybirchandstonecoaching.com</span>
              <br />
              <span className="text-xs text-gray-400">Configured in Supabase Edge Function</span>
            </p>
            {loading ? (
              <p className="text-gray-500">Loading reminders...</p>
            ) : (
              <div className="space-y-4">
                {analytics?.reminders
                  ?.filter((reminder: any) => !selectedClassId || reminder.class_id === selectedClassId)
                  .map((reminder: any) => (
                  <div key={reminder.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 mb-1">
                          {reminder.live_classes?.title || 'Unknown Class'}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          <span className="font-medium">{reminder.users?.name || reminder.users?.email || 'Unknown User'}</span>
                          {' • '}
                          {reminder.users?.email && reminder.users?.name && (
                            <span className="text-gray-500">{reminder.users.email}</span>
                          )}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          <Bell className="w-3 h-3 inline mr-1" />
                          Reminder: {reminder.reminder_minutes_before} minutes before class
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Class time: {reminder.live_classes?.scheduled_at ? format(parseISO(reminder.live_classes.scheduled_at), 'EEEE, MMM d, h:mm a') : 'N/A'}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Reminder set: {reminder.created_at ? format(parseISO(reminder.created_at), 'MMM d, h:mm a') : 'N/A'}
                        </p>
                      </div>
                      <div className="text-right ml-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          reminder.sent ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {reminder.sent ? 'Sent' : 'Pending'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                {(!analytics?.reminders || analytics.reminders.filter((r: any) => !selectedClassId || r.class_id === selectedClassId).length === 0) && (
                  <p className="text-gray-500 text-center py-8">
                    {selectedClassId ? 'No reminders for this class' : 'No reminders set yet'}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Weight Logs Tab */}
      {selectedTab === 'weight' && (
        <div className="space-y-4">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Weight Logs</h2>
              <div className="flex items-center gap-3">
                <label className="text-sm text-gray-600">Filter by user:</label>
                <select
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-coral-500 focus:border-transparent"
                >
                  <option value="">All Users</option>
                  {users.map((user: any) => (
                    <option key={user.id} value={user.id}>
                      {user.name || user.email}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {loading ? (
              <p className="text-gray-500">Loading weight logs...</p>
            ) : (
              <div className="space-y-6">
                {(() => {
                  // Group weight logs by user
                  const filteredLogs = analytics?.weightLogs
                    ?.filter((entry: any) => !selectedUserId || entry.user_id === selectedUserId) || [];
                  
                  const groupedByUser = filteredLogs.reduce((acc: any, entry: any) => {
                    const userId = entry.user_id;
                    if (!acc[userId]) {
                      acc[userId] = {
                        user: entry.users,
                        entries: []
                      };
                    }
                    acc[userId].entries.push(entry);
                    return acc;
                  }, {});

                  const sortedEntries = Object.values(groupedByUser).map((group: any) => ({
                    ...group,
                    entries: group.entries.sort((a: any, b: any) => 
                      new Date(b.date).getTime() - new Date(a.date).getTime()
                    )
                  }));

                  if (sortedEntries.length === 0) {
                    return (
                      <p className="text-gray-500 text-center py-8">
                        {selectedUserId ? 'No weight logs for this user' : 'No weight logs yet'}
                      </p>
                    );
                  }

                  return sortedEntries.map((group: any) => {
                    const user = group.user;
                    const entries = group.entries;
                    const latestEntry = entries[0];
                    const previousEntry = entries[1];
                    const change = latestEntry && previousEntry 
                      ? (latestEntry.weight - previousEntry.weight).toFixed(1)
                      : null;

                    return (
                      <div key={user?.id || 'unknown'} className="border border-gray-200 rounded-xl p-5 bg-gradient-to-br from-white to-gray-50">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-semibold text-gray-900 text-lg">
                              {user?.name || user?.email || 'Unknown User'}
                            </h3>
                            {user?.email && user?.name && (
                              <p className="text-sm text-gray-500 mt-1">{user.email}</p>
                            )}
                          </div>
                          <div className="text-right">
                            {latestEntry && (
                              <>
                                <p className="text-2xl font-bold text-gray-900">
                                  {latestEntry.weight} {latestEntry.unit || 'lbs'}
                                </p>
                                {change && (
                                  <p className={`text-sm font-medium mt-1 ${
                                    parseFloat(change) < 0 ? 'text-green-600' : 
                                    parseFloat(change) > 0 ? 'text-amber-600' : 'text-gray-500'
                                  }`}>
                                    {parseFloat(change) > 0 ? '+' : ''}{change} lbs
                                  </p>
                                )}
                                <p className="text-xs text-gray-400 mt-1">
                                  {format(parseISO(latestEntry.date), 'MMM d, yyyy')}
                                </p>
                              </>
                            )}
                          </div>
                        </div>
                        
                        <div className="space-y-2 mt-4 pt-4 border-t border-gray-200">
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                            Recent Entries ({entries.length} total)
                          </p>
                          {entries.slice(0, 5).map((entry: any) => {
                            const entryChange = entries.indexOf(entry) < entries.length - 1
                              ? (entry.weight - entries[entries.indexOf(entry) + 1].weight).toFixed(1)
                              : null;
                            
                            return (
                              <div key={entry.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                                    <Scale className="w-5 h-5 text-gray-400" />
                                  </div>
                                  <div>
                                    <p className="font-medium text-gray-900">
                                      {entry.weight} {entry.unit || 'lbs'}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {format(parseISO(entry.date), 'MMM d, yyyy')}
                                    </p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  {entryChange && (
                                    <p className={`text-sm font-medium ${
                                      parseFloat(entryChange) < 0 ? 'text-green-600' : 
                                      parseFloat(entryChange) > 0 ? 'text-amber-600' : 'text-gray-500'
                                    }`}>
                                      {parseFloat(entryChange) > 0 ? '+' : ''}{entryChange} lbs
                                    </p>
                                  )}
                                  {entry.notes && (
                                    <p className="text-xs text-gray-400 mt-1 max-w-xs truncate">
                                      {entry.notes}
                                    </p>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                          {entries.length > 5 && (
                            <p className="text-xs text-gray-400 text-center pt-2">
                              +{entries.length - 5} more entries
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Habits Tab */}
      {selectedTab === 'habits' && (
        <div className="space-y-6">
          {/* User Habits */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">User Habits</h2>
            {loading ? (
              <p className="text-gray-500">Loading habits...</p>
            ) : (
            <div className="space-y-4">
              {analytics?.habits
                ?.filter((habit: any) => !selectedUserId || habit.user_id === selectedUserId)
                .map((habit: any) => (
                  <div key={habit.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">{habit.icon || '🎯'}</span>
                          <p className="font-medium text-gray-900">{habit.name}</p>
                          <span
                            className="px-2 py-1 rounded-full text-xs font-medium"
                            style={{
                              backgroundColor: `${habit.color}20`,
                              color: habit.color
                            }}
                          >
                            {habit.frequency || 'daily'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          <span className="font-medium">{habit.users?.name || habit.users?.email || 'Unknown User'}</span>
                          {' • '}
                          Streak: {habit.streak || 0} days
                          {' • '}
                          Created: {habit.created_at ? format(parseISO(habit.created_at), 'MMM d, yyyy') : 'N/A'}
                        </p>
                        {habit.notes && (
                          <p className="text-xs text-gray-400 mt-2">Notes: {habit.notes}</p>
                        )}
                      </div>
                      <Target className="w-5 h-5 text-gray-400 flex-shrink-0 ml-4" />
                    </div>
                  </div>
                ))}
                {(!analytics?.habits || analytics.habits.filter((h: any) => !selectedUserId || h.user_id === selectedUserId).length === 0) && (
                  <p className="text-gray-500 text-center py-8">
                    {selectedUserId ? 'No habits for this user' : 'No habits created yet'}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Habit Completions */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Habit Completions</h2>
            {loading ? (
              <p className="text-gray-500">Loading completions...</p>
            ) : (
              <div className="space-y-3">
                {analytics?.habitCompletions
                  ?.filter((completion: any) => !selectedUserId || completion.user_id === selectedUserId)
                  .map((completion: any) => (
                  <div key={completion.id} className="border-b border-gray-100 pb-3 last:border-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">
                          {completion.users?.name || completion.users?.email || 'Unknown User'}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Completed on {format(parseISO(completion.completed_date), 'MMM d, yyyy')}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-gray-400">
                          {completion.created_at ? format(parseISO(completion.created_at), 'h:mm a') : ''}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                {(!analytics?.habitCompletions || analytics.habitCompletions.filter((hc: any) => !selectedUserId || hc.user_id === selectedUserId).length === 0) && (
                  <p className="text-gray-500 text-center py-8">
                    {selectedUserId ? 'No habit completions for this user' : 'No habit completions yet'}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Badges Tab */}
      {selectedTab === 'badges' && (
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">User Badges</h2>
          {loading ? (
            <p className="text-gray-500">Loading badges...</p>
          ) : (
            <div className="space-y-6">
              {analytics?.badges
                ?.sort((a: any, b: any) => (b.badgeCount || 0) - (a.badgeCount || 0))
                .map((user: any) => (
                  <div key={user.id} className="border border-gray-200 rounded-xl p-5 bg-gradient-to-br from-white to-gray-50">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="font-semibold text-gray-900 text-lg">{user.name || user.email}</p>
                        {user.email && user.name && (
                          <p className="text-sm text-gray-500 mt-1">{user.email}</p>
                        )}
                        {user.lastActive && (
                          <p className="text-xs text-gray-400 mt-1">
                            Last active: {format(parseISO(user.lastActive), 'MMM d, yyyy')}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-coral-600">{user.badgeCount || 0}</p>
                        <p className="text-xs text-gray-500">badges earned</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {user.badges?.map((badge: any) => (
                        <div key={badge.id || badge.name} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100">
                          <div className="w-10 h-10 rounded-lg bg-coral-100 flex items-center justify-center text-lg">
                            {badge.icon || '🏆'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 text-sm truncate">{badge.name || 'Badge'}</p>
                            {badge.description && (
                              <p className="text-xs text-gray-500 truncate">{badge.description}</p>
                            )}
                            {badge.earned_date && (
                              <p className="text-xs text-gray-400 mt-1">
                                {format(parseISO(badge.earned_date), 'MMM d, yyyy')}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              {(!analytics?.badges || analytics.badges.length === 0) && (
                <p className="text-gray-500 text-center py-8">No badges earned yet</p>
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

      {/* Support / Help Desk Tab */}
      {selectedTab === 'support' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Ticket list */}
          <div className="card lg:col-span-1">
            <div className="flex flex-col gap-3 mb-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-coral-500" />
                  Help Tickets
                </h2>
                <button
                  onClick={() => void loadTickets()}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  Refresh
                </button>
              </div>

              {/* Start new conversation */}
              <div className="flex items-center gap-2">
                <select
                  value={newConversationUserId}
                  onChange={(e) => setNewConversationUserId(e.target.value)}
                  className="flex-1 border border-gray-200 rounded-lg px-2 py-1 text-xs text-gray-700"
                >
                  <option value="">Start conversation with...</option>
                  {users.map((u: any) => (
                    <option key={u.id} value={u.id}>
                      {u.name || u.email}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => void startConversationWithUser()}
                  disabled={!newConversationUserId}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-coral-500 hover:bg-coral-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Start
                </button>
              </div>
            </div>
            {ticketsLoading ? (
              <p className="text-gray-500 text-sm">Loading tickets...</p>
            ) : tickets.length === 0 ? (
              <p className="text-gray-500 text-sm">No support tickets yet.</p>
            ) : (
              <div className="space-y-2 max-h-[60vh] overflow-y-auto">
                {tickets.map((ticket) => (
                  <button
                    key={ticket.id}
                    onClick={() => void handleSelectTicket(ticket)}
                    className={`w-full text-left p-3 rounded-xl border transition-colors ${
                      selectedTicket?.id === ticket.id
                        ? 'border-coral-500 bg-coral-50/60'
                        : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {ticket.user?.name || ticket.user?.email || 'Unknown User'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {ticket.subject || 'Help Desk Chat'}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-[11px] font-medium ${
                          ticket.status === 'open'
                            ? 'bg-red-50 text-red-600'
                            : ticket.status === 'in_progress'
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-emerald-50 text-emerald-700'
                        }`}
                      >
                        {ticket.status}
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-gray-500 line-clamp-2">
                      {ticket.message}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Ticket detail & chat */}
          <div className="card lg:col-span-2">
            {selectedTicket ? (
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm text-gray-500">Chat with</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {selectedTicket.users?.name || selectedTicket.users?.email || 'Unknown User'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-1 rounded-full text-[11px] font-medium ${
                        selectedTicket.status === 'open'
                          ? 'bg-red-50 text-red-600'
                          : selectedTicket.status === 'in_progress'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-emerald-50 text-emerald-700'
                      }`}
                    >
                      {selectedTicket.status}
                    </span>
                  </div>
                </div>

                <div className="flex-1 border border-gray-100 rounded-xl p-3 mb-3 max-h-[45vh] overflow-y-auto bg-gray-50">
                  {messagesLoading ? (
                    <p className="text-sm text-gray-500">Loading messages...</p>
                  ) : ticketMessages.length === 0 ? (
                    <p className="text-sm text-gray-500">
                      No messages yet. You can send a reply to start the conversation.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {ticketMessages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${
                            msg.sender_role === 'admin' ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          <div
                            className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm ${
                              msg.sender_role === 'admin'
                                ? 'bg-coral-500 text-white rounded-br-md'
                                : 'bg-white text-gray-800 border border-gray-200 rounded-bl-md'
                            }`}
                          >
                            <p>{msg.message}</p>
                            <p className="mt-1 text-[10px] opacity-70">
                              {msg.created_at
                                ? new Date(msg.created_at).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })
                                : ''}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-auto">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Reply
                  </label>
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows={3}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-coral-500 focus:border-transparent resize-none"
                    placeholder="Type your response to this member..."
                  />
                  <div className="mt-2 flex justify-end">
                    <button
                      onClick={() => void handleSendReply()}
                      disabled={!replyText.trim() || messagesLoading}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white bg-coral-500 hover:bg-coral-600 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      <Mail className="w-4 h-4" />
                      Send Reply
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full min-h-[200px] text-center text-gray-500 text-sm">
                Select a ticket from the left to view the conversation and reply.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
