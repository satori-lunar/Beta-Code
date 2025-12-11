import { useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, CircleMarker, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import type { LatLngExpression } from 'leaflet';
import { Maximize2, Minimize2, Target, Navigation } from 'lucide-react';

// Fix Leaflet default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Create custom goal pin icon
const createGoalPinIcon = () => {
  return L.divIcon({
    className: 'goal-pin-marker',
    html: `<div style="
      width: 0;
      height: 0;
      border-left: 12px solid transparent;
      border-right: 12px solid transparent;
      border-bottom: 24px solid #ef4444;
      filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
      position: relative;
    ">
      <div style="
        position: absolute;
        top: 20px;
        left: -8px;
        width: 16px;
        height: 16px;
        background: #ef4444;
        border-radius: 50%;
        border: 2px solid white;
      "></div>
    </div>`,
    iconSize: [24, 40],
    iconAnchor: [12, 40],
  });
};

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

  // Create route from current position to goal if goal is set
  const routeToGoal: LatLngExpression[] | null = goalPin 
    ? [[currentPosition.latitude, currentPosition.longitude] as LatLngExpression, [goalPin.lat, goalPin.lng] as LatLngExpression]
    : null;

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-gray-900' : ''}`}>
      <div className={`${isFullscreen ? 'h-screen w-screen' : 'h-64 w-full'} relative`}>
        {/* Navigation-style header overlay */}
        {goalPin && (
          <div className="absolute top-0 left-0 right-0 z-[1000] bg-gradient-to-r from-green-500 to-emerald-500 text-white p-3 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Navigation className="w-5 h-5" />
                <div>
                  <div className="text-lg font-semibold">{formatDistance(distanceToGoal)}</div>
                  <div className="text-xs opacity-90">to destination</div>
                </div>
              </div>
              <button
                onClick={onToggleFullscreen}
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
          </div>
        )}
        
        {/* Control buttons overlay */}
        <div className={`absolute ${goalPin ? 'top-16' : 'top-2'} right-2 z-[1000] flex flex-col gap-2`}>
          <button
            onClick={() => onMapClickModeChange(mapClickMode === 'setGoal' ? 'normal' : 'setGoal')}
            className={`p-2 rounded-lg shadow-lg transition-colors ${
              mapClickMode === 'setGoal' 
                ? 'bg-yellow-500 text-white' 
                : 'bg-white text-gray-800 hover:bg-gray-100'
            }`}
            title="Click map to set destination"
          >
            <Target className="w-5 h-5" />
          </button>
          {!goalPin && (
            <button
              onClick={onToggleFullscreen}
              className="p-2 rounded-lg bg-white text-gray-800 hover:bg-gray-100 shadow-lg transition-colors"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </button>
          )}
        </div>
        
        {/* Click mode indicator */}
        {mapClickMode === 'setGoal' && (
          <div className="absolute top-2 left-2 z-[1000] bg-yellow-500 text-white px-3 py-2 rounded-lg shadow-lg animate-pulse">
            <span className="text-sm font-medium">Click map to set destination</span>
          </div>
        )}
        
        {/* Map container - single cohesive unit */}
        <MapContainer
          center={[currentPosition.latitude, currentPosition.longitude]}
          zoom={15}
          style={{ height: '100%', width: '100%' }}
          className="z-0"
          zoomControl={true}
          scrollWheelZoom={true}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {/* Route history (path traveled) */}
          {routeHistory.length > 1 && (
            <Polyline
              positions={routeHistory.map(coord => [coord.latitude, coord.longitude])}
              color={activityColor}
              weight={6}
              opacity={0.9}
            />
          )}
          
          {/* Route to goal (straight line navigation) */}
          {routeToGoal && (
            <Polyline
              positions={routeToGoal}
              color="#ef4444"
              weight={4}
              opacity={0.6}
              dashArray="10, 10"
            />
          )}
          
          {/* Current position - blue dot like navigation apps */}
          <CircleMarker
            center={[currentPosition.latitude, currentPosition.longitude]}
            radius={8}
            pathOptions={{
              fillColor: '#3b82f6',
              fillOpacity: 1,
              color: '#ffffff',
              weight: 3,
            }}
          />
          
          {/* Goal pin - red pin marker */}
          {goalPin && (
            <Marker
              position={[goalPin.lat, goalPin.lng]}
              icon={createGoalPinIcon()}
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
