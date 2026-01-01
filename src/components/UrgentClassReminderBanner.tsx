import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, X, Calendar } from 'lucide-react';

const BANNER_STORAGE_KEY = 'class_reminder_banner_dismissed';
const BANNER_SHOWN_KEY = 'class_reminder_banner_shown';

export default function UrgentClassReminderBanner() {
  const navigate = useNavigate();
  const [showBanner, setShowBanner] = useState(false);
  
  // Calculate next Monday
  const getNextMonday = () => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const daysUntilMonday = dayOfWeek === 0 ? 1 : (8 - dayOfWeek) % 7 || 7;
    const nextMonday = new Date(today);
    nextMonday.setDate(today.getDate() + daysUntilMonday);
    return nextMonday.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  };

  useEffect(() => {
    // Check if banner should be shown
    const checkBannerVisibility = () => {
      // Check if it's been dismissed permanently
      const dismissed = localStorage.getItem(BANNER_STORAGE_KEY);
      if (dismissed === 'true') {
        setShowBanner(false);
        return;
      }

      // Get today's date
      const today = new Date();
      const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
      
      // Show banner only on Sunday (last day before Monday when emails start)
      // This ensures the message "today is the last day" is accurate
      if (dayOfWeek === 0) {
        // Check when banner was first shown
        const shownAt = localStorage.getItem(BANNER_SHOWN_KEY);
        const now = Date.now();
        
        if (!shownAt) {
          // First time showing today - set the timestamp and show banner
          localStorage.setItem(BANNER_SHOWN_KEY, now.toString());
          setShowBanner(true);
        } else {
          // Check if 24 hours have passed since first shown
          const shownTime = parseInt(shownAt, 10);
          const hoursSinceShown = (now - shownTime) / (1000 * 60 * 60);
          
          if (hoursSinceShown < 24) {
            setShowBanner(true);
          } else {
            // 24 hours passed, hide banner and mark as dismissed
            localStorage.setItem(BANNER_STORAGE_KEY, 'true');
            setShowBanner(false);
          }
        }
      } else {
        // Not Sunday, don't show banner
        // On Monday, reset the shown timestamp and dismissed flag so banner can show again next Sunday
        if (dayOfWeek === 1) {
          localStorage.removeItem(BANNER_SHOWN_KEY);
          localStorage.removeItem(BANNER_STORAGE_KEY);
        }
        setShowBanner(false);
      }
    };

    checkBannerVisibility();
    
    // Check periodically (every hour) to see if 24 hours have passed
    const interval = setInterval(checkBannerVisibility, 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const handleDismiss = () => {
    localStorage.setItem(BANNER_STORAGE_KEY, 'true');
    setShowBanner(false);
  };

  const handleGoToClasses = () => {
    navigate('/classes');
  };

  if (!showBanner) return null;

  return (
    <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white px-4 py-3 shadow-lg relative z-50 lg:ml-72">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-semibold text-sm sm:text-base">
              ⚠️ Last Day to Set Class Reminders!
            </p>
            <p className="text-xs sm:text-sm opacity-95 mt-0.5">
              Today is the last day to set reminders for the classes you want. Reminder emails will start on {getNextMonday()}.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleGoToClasses}
            className="flex items-center gap-2 px-4 py-2 bg-white text-orange-600 rounded-lg font-medium hover:bg-orange-50 transition-colors text-sm sm:text-base whitespace-nowrap"
          >
            <Calendar className="w-4 h-4" />
            Set Reminders
          </button>
          <button
            onClick={handleDismiss}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            aria-label="Dismiss banner"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

