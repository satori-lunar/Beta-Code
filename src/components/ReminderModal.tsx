import { useState } from 'react';
import { X, Mail, Clock, Smartphone } from 'lucide-react';
import { format, parseISO, subMinutes } from 'date-fns';

interface ReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (notificationType: 'push' | 'email', reminderMinutes: 5 | 15) => Promise<void>;
  scheduledAt: string;
  title: string;
}

export default function ReminderModal({
  isOpen,
  onClose,
  onConfirm,
  scheduledAt,
  title
}: ReminderModalProps) {
  const [notificationType, setNotificationType] = useState<'push' | 'email'>('push');
  const [reminderMinutes, setReminderMinutes] = useState<5 | 15>(15);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const classTime = parseISO(scheduledAt);
  const reminderTime15 = subMinutes(classTime, 15);
  const reminderTime5 = subMinutes(classTime, 5);

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      await onConfirm(notificationType, reminderMinutes);
      onClose();
    } catch (error) {
      console.error('Error setting reminder:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to set reminder. Please try again.';
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Set Reminder</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={isSubmitting}
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Class Info */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
            <p className="text-sm text-gray-600">
              {format(parseISO(scheduledAt), 'EEEE, MMMM d, h:mm a')}
            </p>
          </div>

          {/* Notification Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Notification Method
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setNotificationType('push')}
                disabled={isSubmitting}
                className={`p-4 rounded-xl border-2 transition-all ${
                  notificationType === 'push'
                    ? 'border-coral-500 bg-coral-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Smartphone className={`w-6 h-6 mx-auto mb-2 ${
                  notificationType === 'push' ? 'text-coral-600' : 'text-gray-400'
                }`} />
                <div className="text-sm font-medium text-gray-900">Push Notification</div>
                <div className="text-xs text-gray-500 mt-1">Best for mobile</div>
              </button>
              <button
                onClick={() => setNotificationType('email')}
                disabled={isSubmitting}
                className={`p-4 rounded-xl border-2 transition-all ${
                  notificationType === 'email'
                    ? 'border-coral-500 bg-coral-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Mail className={`w-6 h-6 mx-auto mb-2 ${
                  notificationType === 'email' ? 'text-coral-600' : 'text-gray-400'
                }`} />
                <div className="text-sm font-medium text-gray-900">Email</div>
                <div className="text-xs text-gray-500 mt-1">Always reliable</div>
              </button>
            </div>
          </div>

          {/* Reminder Time Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Remind Me
            </label>
            <div className="space-y-2">
              <button
                onClick={() => setReminderMinutes(15)}
                disabled={isSubmitting}
                className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                  reminderMinutes === 15
                    ? 'border-coral-500 bg-coral-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Clock className={`w-5 h-5 ${
                      reminderMinutes === 15 ? 'text-coral-600' : 'text-gray-400'
                    }`} />
                    <div>
                      <div className="font-medium text-gray-900">15 minutes before</div>
                      <div className="text-sm text-gray-500">
                        {format(reminderTime15, 'h:mm a')}
                      </div>
                    </div>
                  </div>
                  {reminderMinutes === 15 && (
                    <div className="w-5 h-5 rounded-full bg-coral-500 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-white" />
                    </div>
                  )}
                </div>
              </button>
              <button
                onClick={() => setReminderMinutes(5)}
                disabled={isSubmitting}
                className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                  reminderMinutes === 5
                    ? 'border-coral-500 bg-coral-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Clock className={`w-5 h-5 ${
                      reminderMinutes === 5 ? 'text-coral-600' : 'text-gray-400'
                    }`} />
                    <div>
                      <div className="font-medium text-gray-900">5 minutes before</div>
                      <div className="text-sm text-gray-500">
                        {format(reminderTime5, 'h:mm a')}
                      </div>
                    </div>
                  </div>
                  {reminderMinutes === 5 && (
                    <div className="w-5 h-5 rounded-full bg-coral-500 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-white" />
                    </div>
                  )}
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="flex-1 px-4 py-2.5 rounded-xl bg-coral-500 text-white font-medium hover:bg-coral-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Setting...' : 'Set Reminder'}
          </button>
        </div>
      </div>
    </div>
  );
}
