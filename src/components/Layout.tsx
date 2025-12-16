import { useState, useRef, useEffect, useMemo } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Target,
  Apple,
  Scale,
  BookOpen,
  GraduationCap,
  CalendarDays,
  Video,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  Flame,
  Award,
  ChevronRight,
  Check,
  Trash2,
  User,
  Clock,
  Activity,
  Shield,
  Flag
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useHabits, useJournalEntries, useNotifications, useUserProfile } from '../hooks/useSupabaseData';
import { useIsAdmin } from '../hooks/useAdmin';
import { formatDistanceToNow } from 'date-fns';
import HelpDesk from './HelpDesk';
import DashboardTour from './DashboardTour';
import { supabase } from '../lib/supabase';

const DASHBOARD_TOUR_STORAGE_KEY = 'wellness_dashboard_tour_done';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Calendar', href: '/calendar', icon: CalendarDays },
  { name: 'Classes', href: '/classes', icon: Video },
  { name: 'Health', href: '/health', icon: Activity },
  { name: 'Habits', href: '/habits', icon: Target },
  { name: 'Nutrition', href: '/nutrition', icon: Apple },
  { name: 'Weight Log', href: '/weight', icon: Scale },
  { name: 'Journal', href: '/journal', icon: BookOpen },
  { name: 'Goals', href: '/goals', icon: Flag },
  { name: 'Pathways', href: '/pathways', icon: GraduationCap },
];

const pages = [
  { name: 'Dashboard', description: 'View your wellness overview', href: '/' },
  { name: 'Health', description: 'Track health metrics and BMI', href: '/health' },
  { name: 'Habits', description: 'Track your daily habits', href: '/habits' },
  { name: 'Nutrition', description: 'Log meals and water intake', href: '/nutrition' },
  { name: 'Weight Log', description: 'Track your weight progress', href: '/weight' },
  { name: 'Journal', description: 'Write and reflect', href: '/journal' },
  { name: 'Goals', description: 'Set and track your wellness goals', href: '/goals' },
  { name: 'Pathways', description: 'Choose your wellness journey', href: '/pathways' },
  { name: 'Calendar', description: 'View your schedule', href: '/calendar' },
  { name: 'Classes', description: 'Live and recorded sessions', href: '/classes' },
  { name: 'Badges', description: 'View your achievements', href: '/badges' },
  { name: 'Settings', description: 'Manage your account', href: '/settings' },
];

const notificationIcons: Record<string, React.ElementType> = {
  streak: Flame,
  class: Video,
  achievement: Award,
  reminder: Bell,
  system: Settings,
};

export default function Layout() {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { colorPreset, colorPresets, primaryColor } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const { user } = useAuth();
  const { isAdmin } = useIsAdmin();
  const { data: habits = [] } = useHabits();
  const { data: journalEntries = [] } = useJournalEntries();
  const {
    notifications = [],
    loading: notificationsLoading,
    markRead,
    markAllRead,
    deleteNotification
  } = useNotifications();
    // User-specific pathways not yet wired to Supabase, avoid showing demo data
    // const pathways: any[] = [];
  const recordedSessions: any[] = [];

  const { profile, loading: profileLoading } = useUserProfile();

  const [isTourOpen, setIsTourOpen] = useState(false);
  const [currentTourStepIndex, setCurrentTourStepIndex] = useState(0);

  const appTourSteps = useMemo(
    () => [
      {
        id: 'nav-dashboard',
        selector: '[data-tour="nav-dashboard"]',
        title: 'Dashboard',
        description: 'This is your home base where you can see your overall wellness snapshot.',
      },
      {
        id: 'nav-habits',
        selector: '[data-tour="nav-habits"]',
        title: 'Habits',
        description: 'Use the Habits page to track the daily routines you want to build.',
      },
      {
        id: 'nav-classes',
        selector: '[data-tour="nav-classes"]',
        title: 'Live & Recorded Classes',
        description: 'Browse and join live classes or revisit recordings to support your wellness journey.',
      },
      {
        id: 'search',
        selector: '[data-tour="search"]',
        title: 'Search the app',
        description: 'Quickly jump to pages, habits, and entries using the smart search bar.',
      },
      {
        id: 'notifications',
        selector: '[data-tour="notifications"]',
        title: 'Notifications',
        description: 'See reminders, class updates, and achievement alerts in your notification center.',
      },
      {
        id: 'profile',
        selector: '[data-tour="profile"]',
        title: 'Profile & Settings',
        description: 'Access your profile, badges, and account settings from here.',
      },
      {
        id: 'habits-card',
        selector: '[data-tour="habits"]',
        title: "Today's Habits",
        description: 'From the dashboard, quickly review and complete your daily habits.',
      },
      {
        id: 'journal-card',
        selector: '[data-tour="journal"]',
        title: 'Journal',
        description: 'Use the journal card to reflect on your day and capture how you feel.',
      },
      {
        id: 'classes-card',
        selector: '[data-tour="classes"]',
        title: 'Today’s Classes',
        description: 'See what’s coming up and jump into live sessions from your dashboard.',
      },
      {
        id: 'suggestion-jar',
        selector: '[data-tour="suggestion-jar"]',
        title: 'Suggestion Jar',
        description: 'Share ideas, questions, or feature requests directly with the team.',
      },
      {
        id: 'badges-card',
        selector: '[data-tour="badges"]',
        title: 'Badges & Achievements',
        description: 'Celebrate your progress with badges you earn over time.',
      },
    ],
    []
  );

  const hasCompletedTour = useMemo(() => {
    if (!user) return true;
    if (typeof window !== 'undefined') {
      const stored = window.localStorage.getItem(DASHBOARD_TOUR_STORAGE_KEY);
      if (stored === 'true') return true;
    }
    return Boolean((profile as any)?.has_completed_dashboard_tour);
  }, [user, profile]);

  useEffect(() => {
    if (!user || profileLoading) return;
    if (hasCompletedTour) return;
    setCurrentTourStepIndex(0);
    setIsTourOpen(true);
  }, [user, profileLoading, hasCompletedTour]);

  const markTourCompleted = async () => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(DASHBOARD_TOUR_STORAGE_KEY, 'true');
    }
    if (user) {
      try {
        await supabase
          .from('user_profiles')
          .update({ has_completed_dashboard_tour: true } as any)
          .eq('id', user.id);
      } catch (err) {
        console.error('Error updating app tour completion flag:', err);
      }
    }
  };

  const handleTourNext = () => {
    setCurrentTourStepIndex((prev) =>
      prev < appTourSteps.length - 1 ? prev + 1 : prev
    );
  };

  const handleTourBack = () => {
    setCurrentTourStepIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleTourSkip = () => {
    setIsTourOpen(false);
    markTourCompleted();
  };

  const handleTourFinish = () => {
    setIsTourOpen(false);
    markTourCompleted();
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/signin');
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search results
  const getSearchResults = () => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase();
    const results: Array<{ id: string; title: string; description: string; type: string; link: string }> = [];

    // Search pages
    pages.forEach(page => {
      if (page.name.toLowerCase().includes(query) || page.description.toLowerCase().includes(query)) {
        results.push({
          id: `page-${page.href}`,
          title: page.name,
          description: page.description,
          type: 'page',
          link: page.href
        });
      }
    });

    // Search habits
    habits.forEach(habit => {
      if (habit.name.toLowerCase().includes(query)) {
        results.push({
          id: `habit-${habit.id}`,
          title: habit.name,
          description: `Habit - ${habit.streak} day streak`,
          type: 'habit',
          link: '/habits'
        });
      }
    });

    // Search pathways (placeholder - will be implemented when pathways are fully integrated)
    // pathways.forEach(pathway => {
    //   if (pathway.title.toLowerCase().includes(query) || pathway.description.toLowerCase().includes(query)) {
    //     results.push({
    //       id: `pathway-${pathway.id}`,
    //       title: pathway.title,
    //       description: `Pathway - ${pathway.class_titles.length} classes`,
    //       type: 'pathway',
    //       link: '/pathways'
    //     });
    //   }
    // });

    // Search recordings
    recordedSessions.forEach(session => {
      if (session.title.toLowerCase().includes(query) || session.description.toLowerCase().includes(query)) {
        results.push({
          id: `session-${session.id}`,
          title: session.title,
          description: `Recording - ${session.category}`,
          type: 'class',
          link: '/classes'
        });
      }
    });

    // Search journal entries
    journalEntries.forEach(entry => {
      const entryTitle = entry.title || 'Untitled';
      if (entryTitle.toLowerCase().includes(query) || entry.content.toLowerCase().includes(query)) {
        results.push({
          id: `journal-${entry.id}`,
          title: entryTitle,
          description: `Journal entry - ${entry.mood || 'neutral'} mood`,
          type: 'journal',
          link: '/journal'
        });
      }
    });

    return results.slice(0, 8);
  };

  const searchResults = getSearchResults();

  const handleSearchSelect = (link: string) => {
    navigate(link);
    setSearchQuery('');
    setSearchOpen(false);
  };

  const handleNotificationClick = (notification: typeof notifications[0]) => {
    markRead(notification.id);
    if (notification.link) {
      navigate(notification.link);
    }
    setNotificationsOpen(false);
  };

  return (
    <div
      className="min-h-screen"
      style={{
        background: `linear-gradient(to bottom right, ${colorPresets[colorPreset]?.light}60, white, ${colorPresets[colorPreset]?.light}40)`
      }}
    >
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-72 bg-white shadow-elevated transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: `linear-gradient(to bottom right, ${primaryColor}, ${colorPresets[colorPreset]?.dark})` }}
              >
                <Flame className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-display font-semibold text-gray-900">
                Wellness
              </span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* User Profile */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-lg"
                style={{ background: `linear-gradient(to bottom right, ${colorPresets[colorPreset]?.light}, ${primaryColor})` }}
              >
                {(user?.user_metadata?.name || user?.email)?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div>
                <p className="font-medium text-gray-900">Hello, {user?.user_metadata?.name || user?.email?.split('@')[0] || 'User'}!</p>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `nav-item ${isActive ? 'nav-item-active' : ''}`
                }
                data-tour={
                  item.name === 'Dashboard'
                    ? 'nav-dashboard'
                    : item.name === 'Habits'
                    ? 'nav-habits'
                    : item.name === 'Classes'
                    ? 'nav-classes'
                    : undefined
                }
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>

          {/* Bottom Actions */}
          <div className="p-4 border-t border-gray-100 space-y-1">
            {isAdmin && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `nav-item ${isActive ? 'nav-item-active' : ''}`
                }
              >
                <Shield className="w-5 h-5" />
                <span>Admin</span>
              </NavLink>
            )}
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                `nav-item ${isActive ? 'nav-item-active' : ''}`
              }
            >
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </NavLink>
            <button onClick={handleSignOut} className="nav-item w-full text-red-500 hover:bg-red-50 hover:text-red-600">
              <LogOut className="w-5 h-5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-72">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100">
          <div className="flex items-center justify-between px-4 lg:px-8 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                <Menu className="w-6 h-6 text-gray-600" />
              </button>

              {/* Search */}
              <div ref={searchRef} className="relative flex-1 sm:flex-initial" data-tour="search">
                <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 sm:px-4 py-2.5 w-full sm:w-64 lg:w-80 max-w-full">
                  <Search className="w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search habits, courses, pages..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setSearchOpen(true);
                    }}
                    onFocus={() => setSearchOpen(true)}
                    className="bg-transparent outline-none text-sm text-gray-600 w-full"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="text-gray-400 hover:text-gray-600">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Search Results Dropdown */}
                {searchOpen && searchQuery && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-elevated border border-gray-100 overflow-hidden z-50 max-h-[70vh] overflow-y-auto">
                    {searchResults.length > 0 ? (
                      <div className="max-h-96 overflow-y-auto">
                        {searchResults.map((result) => (
                          <button
                            key={result.id}
                            onClick={() => handleSearchSelect(result.link)}
                            className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors text-left"
                          >
                            <div
                              className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                result.type === 'habit' ? 'bg-sage-100 text-sage-600' :
                                result.type === 'course' ? 'bg-purple-100 text-purple-600' :
                                result.type === 'class' ? 'bg-blue-100 text-blue-600' :
                                result.type === 'journal' ? 'bg-amber-100 text-amber-600' : ''
                              }`}
                              style={result.type === 'page' ? {
                                backgroundColor: colorPresets[colorPreset]?.light,
                                color: primaryColor
                              } : undefined}
                            >
                              {result.type === 'page' && <LayoutDashboard className="w-4 h-4" />}
                              {result.type === 'habit' && <Target className="w-4 h-4" />}
                              {result.type === 'course' && <GraduationCap className="w-4 h-4" />}
                              {result.type === 'class' && <Video className="w-4 h-4" />}
                              {result.type === 'journal' && <BookOpen className="w-4 h-4" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900 truncate">{result.title}</p>
                              <p className="text-xs text-gray-500 truncate">{result.description}</p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 text-center text-gray-500 text-sm">
                        No results found for "{searchQuery}"
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Notifications */}
              <div ref={notificationsRef} className="relative" data-tour="notifications">
                <button
                  onClick={() => {
                    setNotificationsOpen(!notificationsOpen);
                    setProfileOpen(false);
                  }}
                  className="relative p-2.5 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <Bell className="w-5 h-5 text-gray-600" />
                  {unreadCount > 0 && (
                    <span
                      className="absolute top-1 right-1 w-5 h-5 text-white text-xs font-medium rounded-full flex items-center justify-center"
                      style={{ backgroundColor: primaryColor }}
                    >
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {notificationsOpen && (
                  <div className="absolute top-full right-0 mt-2 w-[calc(100vw-2rem)] sm:w-80 lg:w-96 max-w-sm bg-white rounded-xl shadow-elevated border border-gray-100 overflow-hidden z-50 max-h-[70vh] overflow-y-auto">
                    <div className="flex items-center justify-between p-4 border-b border-gray-100">
                      <h3 className="font-semibold text-gray-900">Notifications</h3>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllRead}
                          className="text-sm font-medium hover:opacity-80"
                          style={{ color: primaryColor }}
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notificationsLoading ? (
                        <div className="p-8 text-center text-gray-500 text-sm">Loading notifications...</div>
                      ) : notifications.length > 0 ? (
                        notifications.map((notification) => {
                          const IconComponent = notificationIcons[notification.type] || Bell;
                          return (
                            <div
                              key={notification.id}
                              className="flex items-start gap-3 p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                              style={{
                                backgroundColor: !notification.read ? `${colorPresets[colorPreset]?.light}80` : undefined
                              }}
                              onClick={() => handleNotificationClick(notification)}
                            >
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                                notification.type === 'streak' ? 'bg-amber-100 text-amber-600' :
                                notification.type === 'class' ? 'bg-blue-100 text-blue-600' :
                                notification.type === 'achievement' ? 'bg-purple-100 text-purple-600' :
                                notification.type === 'reminder' ? 'bg-sage-100 text-sage-600' :
                                'bg-gray-100 text-gray-600'
                              }`}>
                                <IconComponent className="w-5 h-5" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className={`text-sm ${!notification.read ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'}`}>
                                  {notification.title}
                                </p>
                                <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                </p>
                              </div>
                              <div className="flex items-center gap-1">
                                {!notification.read && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      markRead(notification.id);
                                    }}
                                    className="p-1 text-gray-400 hover:text-sage-600 rounded"
                                    title="Mark as read"
                                  >
                                    <Check className="w-4 h-4" />
                                  </button>
                                )}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteNotification(notification.id);
                                  }}
                                  className="p-1 text-gray-400 hover:text-red-500 rounded"
                                  title="Delete"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="p-8 text-center text-gray-500 text-sm">
                          <Bell className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                          No notifications
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Profile */}
              <div ref={profileRef} className="relative" data-tour="profile">
                <button
                  onClick={() => {
                    setProfileOpen(!profileOpen);
                    setNotificationsOpen(false);
                  }}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold hover:ring-2 transition-all"
                  style={{
                    background: `linear-gradient(to bottom right, ${colorPresets[colorPreset]?.light}, ${primaryColor})`,
                    ['--tw-ring-color' as string]: `${primaryColor}40`
                  }}
                >
                  {(user?.user_metadata?.name || user?.email)?.charAt(0)?.toUpperCase() || 'U'}
                </button>

                {/* Profile Dropdown */}
                {profileOpen && (
                  <div className="absolute top-full right-0 mt-2 w-[calc(100vw-2rem)] sm:w-64 max-w-xs bg-white rounded-xl shadow-elevated border border-gray-100 overflow-hidden z-50">
                    <div className="p-4 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-lg"
                          style={{ background: `linear-gradient(to bottom right, ${colorPresets[colorPreset]?.light}, ${primaryColor})` }}
                        >
                          {(user?.user_metadata?.name || user?.email)?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{user?.user_metadata?.name || user?.email?.split('@')[0] || 'User'}</p>
                          <p className="text-sm text-gray-500">{user?.email || 'user@example.com'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-3 p-2 bg-amber-50 rounded-lg">
                        <Award className="w-5 h-5 text-amber-500" />
                        <span className="text-sm font-medium text-amber-700">Wellness Dashboard</span>
                      </div>
                    </div>
                    <div className="p-2">
                      <button
                        onClick={() => {
                          navigate('/settings');
                          setProfileOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors"
                      >
                        <User className="w-5 h-5" />
                        <span>My Profile</span>
                      </button>
                      <button
                        onClick={() => {
                          navigate('/badges');
                          setProfileOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors"
                      >
                        <Award className="w-5 h-5" />
                        <span>My Badges</span>
                      </button>
                      <button
                        onClick={() => {
                          navigate('/settings');
                          setProfileOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors"
                      >
                        <Settings className="w-5 h-5" />
                        <span>Settings</span>
                      </button>
                    </div>
                    <div className="p-2 border-t border-gray-100">
                      <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors">
                        <LogOut className="w-5 h-5" />
                        <span>Log Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-3 sm:p-4 lg:p-8 pb-20 lg:pb-8">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 lg:hidden z-40 safe-area-inset-bottom">
        <div className="flex items-center justify-around py-2">
          {navigation.slice(0, 5).map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className="flex flex-col items-center gap-1 p-2 rounded-lg transition-colors"
              style={({ isActive }) => ({
                color: isActive ? primaryColor : '#6b7280'
              })}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.name.split(' ')[0]}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      {/* App-wide Guided Tour */}
      <DashboardTour
        steps={appTourSteps}
        currentStepIndex={currentTourStepIndex}
        isOpen={isTourOpen}
        onNext={handleTourNext}
        onBack={handleTourBack}
        onSkip={handleTourSkip}
        onFinish={handleTourFinish}
      />

      {/* Help Desk Floating Button */}
      <HelpDesk userName={user?.user_metadata?.name || user?.email?.split('@')[0] || 'there'} />
    </div>
  );
}
