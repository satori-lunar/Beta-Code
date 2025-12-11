import { useEffect, useRef, useState } from 'react';
import { Maximize2, Minimize2, Navigation, Search, X } from 'lucide-react';

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
  goalPin: { lat: number; lng: number; name?: string } | null;
  isFullscreen: boolean;
  activityColor: string;
  onGoalPinSet: (lat: number, lng: number, name?: string) => void;
  onToggleFullscreen: () => void;
  distanceToGoal: number;
  formatDistance: (meters: number) => string;
}

declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

export default function WorkoutMap({
  currentPosition,
  routeHistory,
  goalPin,
  isFullscreen,
  activityColor,
  onGoalPinSet,
  onToggleFullscreen,
  distanceToGoal,
  formatDistance
}: WorkoutMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const currentMarkerRef = useRef<any>(null);
  const goalMarkerRef = useRef<any>(null);
  const routePolylineRef = useRef<any>(null);
  const goalRoutePolylineRef = useRef<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const autocompleteServiceRef = useRef<any>(null);
  const placesServiceRef = useRef<any>(null);

  // Initialize Google Maps
  useEffect(() => {
    if (!currentPosition || !mapRef.current) return;

    const pos = currentPosition; // Store reference for nested function
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
    
    // Load Google Maps script if not already loaded
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initMap`;
      script.async = true;
      script.defer = true;
      
      window.initMap = () => {
        initializeMap(pos);
      };
      
      document.head.appendChild(script);
    } else {
      initializeMap(pos);
    }

    function initializeMap(position: GpsCoordinate) {
      if (!mapRef.current || !window.google) return;

      // Initialize map
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: position.latitude, lng: position.longitude },
        zoom: 15,
        mapTypeControl: true,
        streetViewControl: false,
        fullscreenControl: false,
        zoomControl: true,
        gestureHandling: 'greedy', // Better mobile support
      });

      mapInstanceRef.current = map;

      // Initialize Places service
      autocompleteServiceRef.current = new window.google.maps.places.AutocompleteService();
      placesServiceRef.current = new window.google.maps.places.PlacesService(map);

      // Update map when position changes
      updateMapPosition();
    }
  }, [currentPosition]);

  // Update map position and markers
  const updateMapPosition = () => {
    if (!mapInstanceRef.current || !currentPosition) return;

    const position = { lat: currentPosition.latitude, lng: currentPosition.longitude };

    // Update map center
    mapInstanceRef.current.setCenter(position);

    // Update or create current position marker (blue dot)
    if (!currentMarkerRef.current) {
      currentMarkerRef.current = new window.google.maps.Marker({
        position,
        map: mapInstanceRef.current,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: '#3b82f6',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 3,
        },
        zIndex: 1000,
      });
    } else {
      currentMarkerRef.current.setPosition(position);
    }

    // Update route history polyline
    if (routeHistory.length > 1) {
      const path = routeHistory.map(coord => ({
        lat: coord.latitude,
        lng: coord.longitude,
      }));

      if (!routePolylineRef.current) {
        routePolylineRef.current = new window.google.maps.Polyline({
          path,
          geodesic: true,
          strokeColor: activityColor,
          strokeOpacity: 0.9,
          strokeWeight: 6,
          map: mapInstanceRef.current,
        });
      } else {
        routePolylineRef.current.setPath(path);
      }
    }

    // Update goal marker and route
    if (goalPin) {
      const goalPosition = { lat: goalPin.lat, lng: goalPin.lng };

      // Goal marker (red pin)
      if (!goalMarkerRef.current) {
        goalMarkerRef.current = new window.google.maps.Marker({
          position: goalPosition,
          map: mapInstanceRef.current,
          icon: {
            url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
            scaledSize: new window.google.maps.Size(40, 40),
          },
          zIndex: 999,
        });
      } else {
        goalMarkerRef.current.setPosition(goalPosition);
      }

      // Route to goal (dashed line)
      if (!goalRoutePolylineRef.current) {
        goalRoutePolylineRef.current = new window.google.maps.Polyline({
          path: [position, goalPosition],
          geodesic: true,
          strokeColor: '#ef4444',
          strokeOpacity: 0.6,
          strokeWeight: 4,
          icons: [{
            icon: {
              path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
            },
            offset: '50%',
            repeat: '100px',
          }],
          map: mapInstanceRef.current,
        });
      } else {
        goalRoutePolylineRef.current.setPath([position, goalPosition]);
      }
    } else {
      // Remove goal marker and route if no goal
      if (goalMarkerRef.current) {
        goalMarkerRef.current.setMap(null);
        goalMarkerRef.current = null;
      }
      if (goalRoutePolylineRef.current) {
        goalRoutePolylineRef.current.setMap(null);
        goalRoutePolylineRef.current = null;
      }
    }
  };

  // Update map when position or route changes
  useEffect(() => {
    updateMapPosition();
  }, [currentPosition, routeHistory, goalPin, activityColor]);

  // Handle search input
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    
    if (!autocompleteServiceRef.current || !window.google || value.length < 3) {
      setSearchResults([]);
      return;
    }

    if (!currentPosition) return;

    autocompleteServiceRef.current.getPlacePredictions(
      {
        input: value,
        location: new window.google.maps.LatLng(currentPosition.latitude, currentPosition.longitude),
        radius: 50000, // 50km radius
      },
      (predictions: any[], status: string) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
          setSearchResults(predictions);
        } else {
          setSearchResults([]);
        }
      }
    );
  };

  // Handle search result selection
  const handleSelectPlace = (placeId: string) => {
    if (!placesServiceRef.current) return;

    placesServiceRef.current.getDetails(
      { placeId },
      (place: any, status: string) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && place.geometry) {
          const location = place.geometry.location;
          onGoalPinSet(location.lat(), location.lng(), place.name);
          setShowSearch(false);
          setSearchQuery('');
          setSearchResults([]);
        }
      }
    );
  };

  if (!currentPosition) return null;

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
  const hasGoogleMaps = apiKey && window.google;

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
                  <div className="text-xs opacity-90">{goalPin.name || 'to destination'}</div>
                </div>
              </div>
              <button
                onClick={() => onGoalPinSet(0, 0)} // Clear goal
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                title="Clear destination"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
        
        {/* Search bar */}
        <div className={`absolute ${goalPin ? 'top-16' : 'top-2'} left-2 right-2 z-[1000] ${showSearch ? 'block' : ''}`}>
          <div className="relative search-container">
            <div className="flex items-center gap-2 bg-white rounded-lg shadow-lg overflow-hidden">
              <Search className="w-5 h-5 text-gray-500 ml-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                onFocus={() => setShowSearch(true)}
                placeholder="Search for destination..."
                className="flex-1 px-2 py-3 outline-none text-gray-800"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSearchResults([]);
                  }}
                  className="p-2 hover:bg-gray-100"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              )}
            </div>
            
            {/* Search results dropdown */}
            {showSearch && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg max-h-64 overflow-y-auto z-[1001]">
                {searchResults.map((result) => (
                  <button
                    key={result.place_id}
                    onClick={() => handleSelectPlace(result.place_id)}
                    className="w-full text-left px-4 py-3 hover:bg-gray-100 border-b border-gray-200 last:border-0"
                  >
                    <div className="font-medium text-gray-800">{result.description}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Control buttons */}
        <div className={`absolute ${goalPin ? 'top-16' : 'top-2'} right-2 z-[1000] flex flex-col gap-2`}>
          {!showSearch && (
            <button
              onClick={() => setShowSearch(true)}
              className="p-2 rounded-lg bg-white text-gray-800 hover:bg-gray-100 shadow-lg transition-colors"
              title="Search destination"
            >
              <Search className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={onToggleFullscreen}
            className="p-2 rounded-lg bg-white text-gray-800 hover:bg-gray-100 shadow-lg transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>
        </div>
        
        {/* Map container */}
        {!hasGoogleMaps && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800 text-white p-4 text-center z-10">
            <div>
              <p className="text-lg font-semibold mb-2">Google Maps API Key Required</p>
              <p className="text-sm text-gray-400">
                Please set VITE_GOOGLE_MAPS_API_KEY in your .env file to use the map feature.
              </p>
            </div>
          </div>
        )}
        <div
          ref={mapRef}
          style={{ height: '100%', width: '100%' }}
          className="z-0"
        />
      </div>
    </div>
  );
}
