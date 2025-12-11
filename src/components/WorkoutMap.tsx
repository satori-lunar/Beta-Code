import { useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Maximize2, Minimize2, Target } from 'lucide-react';

// Fix Leaflet default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface GpsCoordinate {
  latitude: number;
  longitude: number;
  timestamp: number;
  accuracy: number;
  speed: number | null;
}

interface WorkoutMapProps {
  currentPosition: GpsCoordinate | null;
  routeHistory: GpsCoordinate[];
  goalPin: { lat: number; lng: number } | null;
  mapClickMode: 'normal' | 'setGoal';
  isFullscreen: boolean;
  activityColor: string;
  onGoalPinSet: (lat: number, lng: number) => void;
  onToggleFullscreen: () => void;
  onMapClickModeChange: (mode: 'normal' | 'setGoal') => void;
  distanceToGoal: number;
  formatDistance: (meters: number) => string;
}

// Component to update map view when position changes
function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

// Component to handle map clicks for goal pin
function MapClickHandler({ 
  enabled, 
  onClick 
}: { 
  enabled: boolean; 
  onClick: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click: (e) => {
      if (enabled) {
        const { lat, lng } = e.latlng;
        onClick(lat, lng);
      }
    }
  });
  return null;
}

export default function WorkoutMap({
  currentPosition,
  routeHistory,
  goalPin,
  mapClickMode,
  isFullscreen,
  activityColor,
  onGoalPinSet,
  onToggleFullscreen,
  onMapClickModeChange,
  distanceToGoal,
  formatDistance
}: WorkoutMapProps) {
  if (!currentPosition) return null;

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-gray-900' : ''}`}>
      <div className={`bg-gray-800 rounded-xl overflow-hidden border border-blue-500/30 ${isFullscreen ? 'h-screen' : 'h-64'}`}>
        <div className="p-2 bg-blue-500/20 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-blue-400 font-medium">Your Route</span>
            {goalPin && (
              <span className="text-xs text-yellow-400">
                Goal: {formatDistance(distanceToGoal)} away
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onMapClickModeChange(mapClickMode === 'setGoal' ? 'normal' : 'setGoal')}
              className={`px-2 py-1 rounded text-xs transition-colors ${
                mapClickMode === 'setGoal' 
                  ? 'bg-yellow-500 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
              title="Click map to set goal"
            >
              <Target className="w-3 h-3 inline mr-1" />
              {mapClickMode === 'setGoal' ? 'Cancel' : 'Set Goal'}
            </button>
            <button
              onClick={onToggleFullscreen}
              className="p-1 rounded hover:bg-blue-600 text-blue-400 transition-colors"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
        <MapContainer
          center={[currentPosition.latitude, currentPosition.longitude]}
          zoom={15}
          style={{ height: '100%', width: '100%' }}
          className="z-0"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {routeHistory.length > 1 && (
            <Polyline
              positions={routeHistory.map(coord => [coord.latitude, coord.longitude])}
              color={activityColor}
              weight={4}
              opacity={0.8}
            />
          )}
          <Marker
            position={[currentPosition.latitude, currentPosition.longitude]}
            icon={L.icon({
              iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
            })}
          />
          {goalPin && (
            <Marker
              position={[goalPin.lat, goalPin.lng]}
              icon={L.icon({
                iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
                iconSize: [35, 51],
                iconAnchor: [17, 51],
                className: 'goal-marker'
              })}
            />
          )}
          <MapUpdater center={[currentPosition.latitude, currentPosition.longitude]} />
          <MapClickHandler 
            enabled={mapClickMode === 'setGoal'} 
            onClick={(lat, lng) => {
              onGoalPinSet(lat, lng);
              onMapClickModeChange('normal');
            }}
          />
        </MapContainer>
      </div>
    </div>
  );
}
