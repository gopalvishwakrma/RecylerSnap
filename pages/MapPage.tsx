
import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Loader } from '@googlemaps/js-api-loader';
import { WasteCategory, Recycler } from '../types';

const MapPage: React.FC = () => {
  const location = useLocation();
  const initialCategory = (location.state as any)?.category || 'All';
  
  const [filter, setFilter] = useState<WasteCategory | 'All'>(initialCategory);
  const [search, setSearch] = useState('');
  const [selectedRecycler, setSelectedRecycler] = useState<Recycler | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recyclers, setRecyclers] = useState<Recycler[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const placesServiceRef = useRef<google.maps.places.PlacesService | null>(null);

  const API_KEY = process.env.VITE_GOOGLE_MAPS_API_KEY || '';

  useEffect(() => {
    if (!API_KEY) {
      setError("Google Maps API Key is missing. Please add it to your environment variables.");
      setIsLoading(false);
      return;
    }

    const loader = new Loader({
      apiKey: API_KEY,
      version: "weekly",
      libraries: ["places"]
    });

    loader.load().then(() => {
      // Get user location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            setUserLocation(pos);
            initMap(pos);
          },
          (geoError) => {
            console.warn("Geolocation failed:", geoError);
            // Fallback to a default location (e.g., New York)
            const defaultPos = { lat: 40.7128, lng: -74.0060 };
            setUserLocation(defaultPos);
            initMap(defaultPos);
            setError("Location access denied or unavailable. Showing default location (New York).");
          },
          { timeout: 10000 }
        );
      } else {
        const defaultPos = { lat: 40.7128, lng: -74.0060 };
        setUserLocation(defaultPos);
        initMap(defaultPos);
        setError("Geolocation not supported. Showing default location.");
      }
    }).catch(err => {
      console.error("Error loading Google Maps:", err);
      setError("Failed to load Google Maps. Please check your API key, billing, and enabled APIs in the Google Cloud Console.");
      setIsLoading(false);
    });
  }, []);

  const initMap = (center: { lat: number; lng: number }) => {
    if (!mapRef.current) return;

    const map = new google.maps.Map(mapRef.current, {
      center,
      zoom: 13,
      styles: [
        {
          "featureType": "poi.business",
          "stylers": [{ "visibility": "off" }]
        },
        {
          "featureType": "poi.park",
          "elementType": "labels.text",
          "stylers": [{ "visibility": "off" }]
        }
      ],
      disableDefaultUI: true,
      zoomControl: true,
    });

    googleMapRef.current = map;
    placesServiceRef.current = new google.maps.places.PlacesService(map);
    
    // Add user marker
    new google.maps.Marker({
      position: center,
      map,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 10,
        fillColor: "#3b82f6",
        fillOpacity: 1,
        strokeWeight: 2,
        strokeColor: "#ffffff",
      },
      title: "Your Location"
    });

    searchNearbyRecyclers(center, filter);
    setIsLoading(false);
  };

  const searchNearbyRecyclers = (location: { lat: number; lng: number }, category: string) => {
    if (!placesServiceRef.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    const keyword = category === 'All' ? 'recycling center' : `${category} recycling center`;
    
    const request: google.maps.places.PlaceSearchRequest = {
      location,
      radius: 5000,
      keyword
    };

    placesServiceRef.current.nearbySearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        const foundRecyclers: Recycler[] = results.map(place => ({
          id: place.place_id || Math.random().toString(),
          name: place.name || "Unknown Center",
          address: place.vicinity || "No address available",
          lat: place.geometry?.location?.lat() || 0,
          lng: place.geometry?.location?.lng() || 0,
          rating: place.rating || 0,
          distance: "Nearby", // We could calculate real distance if needed
          acceptedTypes: category === 'All' ? [WasteCategory.OTHER] : [category as WasteCategory],
          hours: place.opening_hours?.isOpen() ? "Open Now" : "Closed",
          phone: "", // Need place details for this
        }));

        setRecyclers(foundRecyclers);
        addMarkers(foundRecyclers);
      } else {
        setRecyclers([]);
      }
    });
  };

  const addMarkers = (centers: Recycler[]) => {
    if (!googleMapRef.current) return;

    centers.forEach(center => {
      const marker = new google.maps.Marker({
        position: { lat: center.lat, lng: center.lng },
        map: googleMapRef.current,
        title: center.name,
        icon: {
          url: "https://maps.google.com/mapfiles/ms/icons/green-dot.png"
        }
      });

      marker.addListener('click', () => {
        setSelectedRecycler(center);
        googleMapRef.current?.panTo({ lat: center.lat, lng: center.lng });
      });

      markersRef.current.push(marker);
    });
  };

  useEffect(() => {
    if (userLocation && !isLoading) {
      searchNearbyRecyclers(userLocation, filter);
    }
  }, [filter]);

  const filteredRecyclers = recyclers.filter(r => 
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col md:flex-row gap-6">
      {/* Sidebar Controls */}
      <div className="w-full md:w-80 flex flex-col gap-4 overflow-y-auto pr-2">
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm">
          <h2 className="text-xl font-bold text-slate-800 mb-6">Find Recyclers</h2>
          
          <div className="space-y-4">
            <div className="relative">
              <i className="fa-solid fa-magnifying-glass absolute left-4 top-3.5 text-slate-400"></i>
              <input 
                type="text" 
                placeholder="Search centers..."
                className="w-full pl-11 pr-4 py-3 bg-stone-50 border border-stone-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              {['All', ...Object.values(WasteCategory)].map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat as any)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                    filter === cat 
                      ? 'bg-emerald-600 text-white border-emerald-600' 
                      : 'bg-white text-slate-500 border-slate-200 hover:border-emerald-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-grow bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 bg-stone-50 border-b border-stone-100 text-xs font-bold text-slate-400 uppercase tracking-widest">
            {filteredRecyclers.length} Results Near You
          </div>
          <div className="overflow-y-auto">
            {filteredRecyclers.length === 0 && !isLoading && (
              <div className="p-10 text-center text-slate-400">
                <i className="fa-solid fa-map-location-dot text-4xl mb-4 opacity-20"></i>
                <p>No centers found in this area.</p>
              </div>
            )}
            {filteredRecyclers.map(r => (
              <button 
                key={r.id}
                onClick={() => {
                  setSelectedRecycler(r);
                  googleMapRef.current?.panTo({ lat: r.lat, lng: r.lng });
                  googleMapRef.current?.setZoom(15);
                }}
                className={`w-full text-left p-6 border-b border-stone-50 hover:bg-emerald-50 transition-colors ${selectedRecycler?.id === r.id ? 'bg-emerald-50 border-l-4 border-l-emerald-600' : ''}`}
              >
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-bold text-slate-800 line-clamp-1">{r.name}</h4>
                  <span className="text-[10px] font-black text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded uppercase">{r.distance}</span>
                </div>
                <p className="text-xs text-slate-500 mb-3">{r.address}</p>
                <div className="flex flex-wrap gap-1">
                  {r.acceptedTypes.slice(0, 3).map(type => (
                    <span key={type} className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">{type}</span>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Map Area */}
      <div className="flex-grow bg-white rounded-3xl border border-stone-200 shadow-sm relative overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 z-10 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
              <i className="fa-solid fa-location-crosshairs fa-spin text-2xl"></i>
            </div>
            <p className="text-slate-600 font-bold">Detecting Location...</p>
          </div>
        )}

        {error && (
          <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 bg-red-50 border border-red-200 text-red-700 px-6 py-3 rounded-2xl shadow-lg flex items-center gap-3">
            <i className="fa-solid fa-circle-exclamation"></i>
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        <div ref={mapRef} className="w-full h-full" />

        {/* Selection Detail Overlay */}
        {selectedRecycler && (
          <div className="absolute bottom-6 left-6 right-6 md:left-auto md:w-96 bg-white p-6 rounded-2xl shadow-2xl border border-stone-100 animate-in slide-in-from-bottom-10 z-20">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-slate-800">{selectedRecycler.name}</h3>
                <p className="text-sm text-slate-500">{selectedRecycler.address}</p>
              </div>
              <button onClick={() => setSelectedRecycler(null)} className="text-slate-300 hover:text-slate-500">
                <i className="fa-solid fa-circle-xmark text-xl"></i>
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-sm">
                <span className="block text-xs font-bold text-slate-400 uppercase mb-1">Status</span>
                <span className="font-medium text-slate-700">{selectedRecycler.hours}</span>
              </div>
              <div className="text-sm">
                <span className="block text-xs font-bold text-slate-400 uppercase mb-1">Rating</span>
                <span className="font-bold text-amber-500">
                  <i className="fa-solid fa-star mr-1"></i>
                  {selectedRecycler.rating}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <a 
                href={`https://www.google.com/maps/dir/?api=1&destination=${selectedRecycler.lat},${selectedRecycler.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-grow bg-emerald-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
              >
                <i className="fa-solid fa-diamond-turn-right"></i>
                Directions
              </a>
              <button className="w-12 h-12 bg-stone-100 text-slate-600 rounded-xl hover:bg-stone-200 transition-colors flex items-center justify-center">
                <i className="fa-solid fa-phone"></i>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapPage;
