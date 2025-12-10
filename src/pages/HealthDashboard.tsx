import { useState } from 'react';
import { Settings, Plus, GripVertical, X, Palette } from 'lucide-react';
import HealthMetricsWidget from '../components/widgets/HealthMetricsWidget';
import BMICalculator from '../components/widgets/BMICalculator';
import BodyMeasurements from '../components/widgets/BodyMeasurements';
import ActivityChart from '../components/widgets/ActivityChart';
import AppointmentsWidget from '../components/widgets/AppointmentsWidget';

interface WidgetConfig {
  id: string;
  type: string;
  title: string;
  size: 'small' | 'medium' | 'large' | 'full';
}

const defaultWidgets: WidgetConfig[] = [
  { id: 'health-metrics', type: 'health-metrics', title: 'Health Metrics', size: 'full' },
  { id: 'activity-chart', type: 'activity-chart', title: 'Activity Growth', size: 'large' },
  { id: 'bmi-calculator', type: 'bmi-calculator', title: 'BMI Calculator', size: 'medium' },
  { id: 'body-measurements', type: 'body-measurements', title: 'Body Measurements', size: 'medium' },
  { id: 'appointments', type: 'appointments', title: 'Appointments', size: 'medium' },
];

const availableWidgets = [
  { type: 'health-metrics', title: 'Health Metrics', description: 'Track blood sugar, heart rate, and blood pressure' },
  { type: 'activity-chart', title: 'Activity Chart', description: 'View your activity trends over time' },
  { type: 'bmi-calculator', title: 'BMI Calculator', description: 'Calculate and track your BMI' },
  { type: 'body-measurements', title: 'Body Measurements', description: 'Track chest, waist, and hip measurements' },
  { type: 'appointments', title: 'Appointments', description: 'View upcoming appointments' },
];

export default function HealthDashboard() {
  const [widgets, setWidgets] = useState<WidgetConfig[]>(defaultWidgets);
  const [editMode, setEditMode] = useState(false);
  const [showAddWidget, setShowAddWidget] = useState(false);
  const [draggedWidget, setDraggedWidget] = useState<string | null>(null);

  const handleRemoveWidget = (id: string) => {
    setWidgets(prev => prev.filter(w => w.id !== id));
  };

  const handleAddWidget = (type: string) => {
    const widgetInfo = availableWidgets.find(w => w.type === type);
    if (!widgetInfo) return;

    const newWidget: WidgetConfig = {
      id: `${type}-${Date.now()}`,
      type,
      title: widgetInfo.title,
      size: type === 'health-metrics' ? 'full' : 'medium'
    };

    setWidgets(prev => [...prev, newWidget]);
    setShowAddWidget(false);
  };

  const handleDragStart = (e: React.DragEvent, widgetId: string) => {
    setDraggedWidget(widgetId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedWidget || draggedWidget === targetId) return;

    setWidgets(prev => {
      const newWidgets = [...prev];
      const draggedIndex = newWidgets.findIndex(w => w.id === draggedWidget);
      const targetIndex = newWidgets.findIndex(w => w.id === targetId);

      const [removed] = newWidgets.splice(draggedIndex, 1);
      newWidgets.splice(targetIndex, 0, removed);

      return newWidgets;
    });
    setDraggedWidget(null);
  };

  const handleDragEnd = () => {
    setDraggedWidget(null);
  };

  const cycleWidgetSize = (id: string) => {
    setWidgets(prev => prev.map(w => {
      if (w.id === id) {
        const sizes: Array<'small' | 'medium' | 'large' | 'full'> = ['small', 'medium', 'large', 'full'];
        const currentIndex = sizes.indexOf(w.size);
        const nextIndex = (currentIndex + 1) % sizes.length;
        return { ...w, size: sizes[nextIndex] };
      }
      return w;
    }));
  };

  const getWidgetClasses = (size: string) => {
    switch (size) {
      case 'small':
        return 'col-span-12 sm:col-span-6 lg:col-span-4';
      case 'medium':
        return 'col-span-12 sm:col-span-6 lg:col-span-6';
      case 'large':
        return 'col-span-12 lg:col-span-8';
      case 'full':
        return 'col-span-12';
      default:
        return 'col-span-12 sm:col-span-6';
    }
  };

  const renderWidget = (widget: WidgetConfig) => {
    switch (widget.type) {
      case 'health-metrics':
        return <HealthMetricsWidget />;
      case 'activity-chart':
        return <ActivityChart className="h-full" />;
      case 'bmi-calculator':
        return <BMICalculator />;
      case 'body-measurements':
        return <BodyMeasurements />;
      case 'appointments':
        return <AppointmentsWidget />;
      default:
        return <div className="p-4 text-gray-500">Unknown widget type</div>;
    }
  };

  return (
    <div className="pb-20 lg:pb-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-display font-bold text-gray-900">Health Overview</h1>
          <p className="text-gray-500">Track your health metrics and progress</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddWidget(true)}
            className="flex items-center gap-2 px-4 py-2 bg-coral-500 text-white rounded-xl hover:bg-coral-600 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">Add Widget</span>
          </button>
          <button
            onClick={() => setEditMode(!editMode)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${
              editMode
                ? 'bg-coral-100 text-coral-600'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Settings className="w-5 h-5" />
            <span className="hidden sm:inline">{editMode ? 'Done' : 'Edit'}</span>
          </button>
        </div>
      </div>

      {editMode && (
        <div className="mb-4 p-3 bg-coral-50 border border-coral-200 rounded-xl text-sm text-coral-700">
          <strong>Edit Mode:</strong> Drag widgets to reorder. Click the size button to resize. Click × to remove.
        </div>
      )}

      {/* Widgets Grid */}
      <div className="grid grid-cols-12 gap-4 lg:gap-6">
        {widgets.map(widget => (
          <div
            key={widget.id}
            className={`${getWidgetClasses(widget.size)} transition-all duration-300 ${
              draggedWidget === widget.id ? 'opacity-50' : ''
            } ${editMode ? 'ring-2 ring-coral-200 ring-dashed rounded-2xl' : ''}`}
            draggable={editMode}
            onDragStart={(e) => handleDragStart(e, widget.id)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, widget.id)}
            onDragEnd={handleDragEnd}
          >
            <div className="relative h-full">
              {editMode && (
                <div className="absolute top-2 left-2 right-2 z-10 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <div className="cursor-move p-1.5 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm">
                      <GripVertical className="w-4 h-4 text-gray-400" />
                    </div>
                    <button
                      onClick={() => cycleWidgetSize(widget.id)}
                      className="px-2 py-1 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm text-xs font-medium text-gray-600 hover:bg-white"
                    >
                      {widget.size}
                    </button>
                  </div>
                  <button
                    onClick={() => handleRemoveWidget(widget.id)}
                    className="p-1.5 bg-red-500 text-white rounded-lg shadow-sm hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
              <div className="h-full">
                {renderWidget(widget)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Widget Modal */}
      {showAddWidget && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">Add Widget</h3>
              <button
                onClick={() => setShowAddWidget(false)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-4 max-h-96 overflow-y-auto">
              <div className="grid gap-3">
                {availableWidgets.map(widget => (
                  <button
                    key={widget.type}
                    onClick={() => handleAddWidget(widget.type)}
                    className="flex items-start gap-4 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl text-left transition-colors"
                  >
                    <div className="w-12 h-12 bg-coral-100 rounded-xl flex items-center justify-center text-coral-600 flex-shrink-0">
                      <Palette className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{widget.title}</p>
                      <p className="text-sm text-gray-500">{widget.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
