import { X, Rocket, Bell, Sparkles } from 'lucide-react';
import { useState } from 'react';

interface ComingSoonModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature: string;
  description?: string;
}

export default function ComingSoonModal({ isOpen, onClose, feature, description }: ComingSoonModalProps) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  if (!isOpen) return null;

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => {
        setEmail('');
        setSubscribed(false);
        onClose();
      }, 2000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header with gradient */}
        <div className="relative bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-8 text-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="w-20 h-20 mx-auto bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center mb-4">
            <Rocket className="w-10 h-10 text-white" />
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-2">Coming Soon!</h2>
          <div className="flex items-center justify-center gap-1 text-white/80">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm">{feature}</span>
            <Sparkles className="w-4 h-4" />
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-600 text-center mb-6">
            {description || `We're working hard to bring you ${feature.toLowerCase()}. This exciting feature will be available in a future update!`}
          </p>

          {/* What to expect */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Bell className="w-4 h-4 text-purple-500" />
              What to expect
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-purple-500">•</span>
                Seamless integration with your favorite devices
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500">•</span>
                Automatic data syncing in real-time
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500">•</span>
                Enhanced insights and analytics
              </li>
            </ul>
          </div>

          {/* Notify me form */}
          {!subscribed ? (
            <form onSubmit={handleSubscribe} className="space-y-3">
              <p className="text-sm text-gray-500 text-center">
                Want to be notified when it's ready?
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium"
                >
                  Notify Me
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center py-4">
              <div className="w-12 h-12 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-2">
                <Sparkles className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-green-600 font-medium">You're on the list!</p>
              <p className="text-sm text-gray-500">We'll notify you when it's ready.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6">
          <button
            onClick={onClose}
            className="w-full py-2.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>
  );
}

