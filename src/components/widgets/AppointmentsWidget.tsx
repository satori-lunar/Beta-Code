import { Calendar as CalendarIcon, Video, MapPin, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface Appointment {
  id: string;
  title: string;
  doctor: string;
  specialty: string;
  date: Date;
  time: string;
  location?: string;
  type: 'in-person' | 'video';
  color: string;
}

interface AppointmentsWidgetProps {
  appointments?: Appointment[];
  onSchedule?: () => void;
}

export default function AppointmentsWidget({ appointments, onSchedule }: AppointmentsWidgetProps) {
  const defaultAppointments: Appointment[] = appointments || [
    {
      id: '1',
      title: 'Consultation',
      doctor: 'Dr. James Wilson',
      specialty: 'General Physician',
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      time: '09:00 AM',
      type: 'in-person',
      location: 'City Medical Center',
      color: 'bg-teal-500'
    },
    {
      id: '2',
      title: 'Follow-up',
      doctor: 'Dr. Sarah Chen',
      specialty: 'Nutritionist',
      date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      time: '02:30 PM',
      type: 'video',
      color: 'bg-purple-500'
    }
  ];

  const upcomingAppointment = defaultAppointments[0];

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Upcoming Appointment</h3>
        <button
          onClick={onSchedule}
          className="text-sm text-coral-600 hover:text-coral-700 font-medium"
        >
          Schedule New
        </button>
      </div>

      {upcomingAppointment && (
        <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl border border-teal-100">
          <div className={`w-12 h-12 ${upcomingAppointment.color} rounded-xl flex items-center justify-center text-white flex-shrink-0`}>
            {upcomingAppointment.type === 'video' ? (
              <Video className="w-6 h-6" />
            ) : (
              <CalendarIcon className="w-6 h-6" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <h4 className="font-semibold text-gray-900">{upcomingAppointment.title}</h4>
                <p className="text-sm text-gray-600">{upcomingAppointment.doctor}</p>
                <p className="text-xs text-gray-500">{upcomingAppointment.specialty}</p>
              </div>
              <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                upcomingAppointment.type === 'video'
                  ? 'bg-purple-100 text-purple-700'
                  : 'bg-teal-100 text-teal-700'
              }`}>
                {upcomingAppointment.type === 'video' ? 'Video Call' : 'In-Person'}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <CalendarIcon className="w-4 h-4 text-gray-400" />
                <span>{format(upcomingAppointment.date, 'MMM d, yyyy')}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-gray-400" />
                <span>{upcomingAppointment.time}</span>
              </div>
              {upcomingAppointment.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="truncate">{upcomingAppointment.location}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Other upcoming appointments */}
      {defaultAppointments.length > 1 && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-500 mb-3">Also scheduled</p>
          <div className="space-y-2">
            {defaultAppointments.slice(1, 3).map((apt) => (
              <div key={apt.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${apt.color}`} />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{apt.title} with {apt.doctor}</p>
                    <p className="text-xs text-gray-500">{format(apt.date, 'MMM d')} at {apt.time}</p>
                  </div>
                </div>
                {apt.type === 'video' && (
                  <Video className="w-4 h-4 text-purple-500" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
