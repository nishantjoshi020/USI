import React, { useEffect, useRef, useState } from 'react';
import {
  APIProvider,
  AdvancedMarker,
  InfoWindow,
  Map,
  Pin,
  useMap,
  useMapsLibrary,
} from '@vis.gl/react-google-maps';
import {
  Building2,
  CheckCircle2,
  Compass,
  ExternalLink,
  Loader2,
  MapPin,
  Navigation,
  Search,
  Star,
  X,
} from 'lucide-react';
import { TrainingSession } from '../../types/usi';

export interface SelectedGoogleMapsVenue {
  placeId: string;
  name: string;
  formattedAddress: string;
  lat: number;
  lng: number;
  rating?: number;
  userRatingCount?: number;
  types?: string[];
  googleMapsUri?: string;
}

interface VenueMapsModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: TrainingSession[];
  initialSessionId?: string | null;
  onAssignVenueToSession: (
    sessionId: string,
    venue: SelectedGoogleMapsVenue
  ) => void;
  onSendVenueQueryToCopilot?: (query: string) => void;
}

const QUICK_SEARCH_QUERIES = [
  'Football stadium in Mumbai',
  'Sports complex in Bengaluru',
  'Athletics stadium in New Delhi',
  'Sports medicine & rehab clinic in Mumbai',
  'High performance training center in Pune',
];

interface VenueExplorerInnerProps {
  sessions: TrainingSession[];
  selectedSessionId: string;
  onSelectSessionId: (id: string) => void;
  onAssignVenueToSession: (
    sessionId: string,
    venue: SelectedGoogleMapsVenue
  ) => void;
  onSendVenueQueryToCopilot?: (query: string) => void;
  onClose: () => void;
}

const VenueExplorerInner: React.FC<VenueExplorerInnerProps> = ({
  sessions,
  selectedSessionId,
  onSelectSessionId,
  onAssignVenueToSession,
  onSendVenueQueryToCopilot,
  onClose,
}) => {
  const map = useMap();
  const placesLib = useMapsLibrary('places');
  const sessionTokenRef =
    useRef<google.maps.places.AutocompleteSessionToken | null>(null);

  const [searchInput, setSearchInput] = useState('');
  const [suggestions, setSuggestions] = useState<
    google.maps.places.AutocompleteSuggestion[]
  >([]);
  const [searchResults, setSearchResults] = useState<SelectedGoogleMapsVenue[]>(
    []
  );
  const [selectedVenue, setSelectedVenue] =
    useState<SelectedGoogleMapsVenue | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [userCenter, setUserCenter] = useState<{ lat: number; lng: number }>({
    lat: 19.076,
    lng: 72.8777,
  });

  // Fetch live autocomplete suggestions using Places API (New) AutocompleteSuggestion
  useEffect(() => {
    if (!placesLib) return;
    const trimmed = searchInput.trim();
    if (trimmed.length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const { AutocompleteSessionToken, AutocompleteSuggestion } = placesLib;
        if (!sessionTokenRef.current) {
          sessionTokenRef.current = new AutocompleteSessionToken();
        }
        const response =
          await AutocompleteSuggestion.fetchAutocompleteSuggestions({
            input: trimmed,
            sessionToken: sessionTokenRef.current,
          });
        setSuggestions(response.suggestions || []);
        setErrorMessage(null);
      } catch (err) {
        console.error('Places AutocompleteSuggestion error:', err);
        setErrorMessage(
          'Unable to load place suggestions. Please check your network or API quota.'
        );
      }
    }, 260);

    return () => clearTimeout(timer);
  }, [placesLib, searchInput]);

  // Run an initial live text search for training venues when Places library loads
  useEffect(() => {
    if (!placesLib) return;
    handleTextSearch('Football stadium in Mumbai');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [placesLib]);

  const handleTextSearch = async (queryText: string) => {
    if (!placesLib || !queryText.trim()) return;
    setIsLoading(true);
    setErrorMessage(null);
    setSuggestions([]);

    try {
      const { Place } = placesLib as any;
      if (Place && typeof Place.searchByText === 'function') {
        const { places } = await Place.searchByText({
          textQuery: queryText.trim(),
          fields: [
            'id',
            'displayName',
            'formattedAddress',
            'location',
            'rating',
            'userRatingCount',
            'types',
            'googleMapsURI',
          ],
          maxResultCount: 8,
        });

        const mapped: SelectedGoogleMapsVenue[] = (places || [])
          .filter((p: any) => p?.location)
          .map((p: any) => ({
            placeId: p.id || `place-${Math.random().toString(36).slice(2, 8)}`,
            name: p.displayName || 'Sports Venue',
            formattedAddress: p.formattedAddress || '',
            lat:
              typeof p.location.lat === 'function'
                ? p.location.lat()
                : Number(p.location.lat),
            lng:
              typeof p.location.lng === 'function'
                ? p.location.lng()
                : Number(p.location.lng),
            rating: typeof p.rating === 'number' ? p.rating : undefined,
            userRatingCount:
              typeof p.userRatingCount === 'number'
                ? p.userRatingCount
                : undefined,
            types: Array.isArray(p.types) ? p.types.slice(0, 4) : [],
            googleMapsUri: p.googleMapsURI || undefined,
          }));

        setSearchResults(mapped);
        if (mapped.length > 0) {
          setSelectedVenue(mapped[0]);
          if (map) {
            map.panTo({ lat: mapped[0].lat, lng: mapped[0].lng });
            map.setZoom(13);
          }
        }
      }
    } catch (err) {
      console.error('Places searchByText error:', err);
      setErrorMessage(
        'Unable to load venue search results from Google Maps Platform. Please verify your API key and network.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSuggestion = async (
    suggestion: google.maps.places.AutocompleteSuggestion
  ) => {
    if (!suggestion.placePrediction) return;
    setIsLoading(true);
    setErrorMessage(null);
    setSuggestions([]);

    try {
      const place = suggestion.placePrediction.toPlace();
      await place.fetchFields({
        fields: [
          'id',
          'displayName',
          'formattedAddress',
          'location',
          'rating',
          'userRatingCount',
          'types',
          'googleMapsURI',
        ],
      });

      // Reset session token after fetchFields per GMP best practice
      sessionTokenRef.current = null;

      const loc = place.location;
      if (!loc) {
        setErrorMessage('Selected place does not include coordinates.');
        setIsLoading(false);
        return;
      }

      const lat =
        typeof loc.lat === 'function' ? loc.lat() : Number((loc as any).lat);
      const lng =
        typeof loc.lng === 'function' ? loc.lng() : Number((loc as any).lng);

      const venueObj: SelectedGoogleMapsVenue = {
        placeId: place.id || `place-${Date.now()}`,
        name: place.displayName || suggestion.placePrediction.text.text,
        formattedAddress: place.formattedAddress || '',
        lat,
        lng,
        rating: typeof place.rating === 'number' ? place.rating : undefined,
        userRatingCount:
          typeof (place as any).userRatingCount === 'number'
            ? (place as any).userRatingCount
            : undefined,
        types: Array.isArray(place.types) ? place.types.slice(0, 4) : [],
        googleMapsUri: (place as any).googleMapsURI || undefined,
      };

      setSearchInput(venueObj.name);
      setSelectedVenue(venueObj);
      setSearchResults((prev) => [
        venueObj,
        ...prev.filter((item) => item.placeId !== venueObj.placeId),
      ]);

      if (map) {
        map.panTo({ lat, lng });
        map.setZoom(15);
      }
    } catch (err) {
      console.error('Error fetching place details:', err);
      setErrorMessage(
        'Unable to load place details. Please check your network or API quota.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setErrorMessage('Geolocation is not supported in this browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setUserCenter(coords);
        if (map) {
          map.panTo(coords);
          map.setZoom(13);
        }
      },
      () => {
        setErrorMessage(
          'Unable to retrieve current location. Please search by city or venue name.'
        );
      }
    );
  };

  const activeSession =
    sessions.find((s) => s.id === selectedSessionId) || sessions[0];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 p-5">
      {/* Left Column: Search, Autocomplete, and Results List */}
      <div className="lg:col-span-5 flex flex-col gap-3.5">
        <div className="relative">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleTextSearch(searchInput);
            }}
            className="flex items-center gap-2"
          >
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search stadiums, training pitches, or clinics..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-900/90 border border-slate-700/80 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !searchInput.trim()}
              className="px-3 py-2 rounded-lg text-xs font-semibold bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-slate-950 transition-colors cursor-pointer"
            >
              {isLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                'Search'
              )}
            </button>
            <button
              type="button"
              onClick={handleUseMyLocation}
              title="Center map on my location"
              className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 transition-colors cursor-pointer"
            >
              <Navigation className="w-3.5 h-3.5 text-sky-400" />
            </button>
          </form>

          {/* Places API (New) Autocomplete Dropdown */}
          {suggestions.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-1 z-30 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl overflow-hidden max-h-56 overflow-y-auto">
              <div className="px-3 py-1.5 bg-slate-950/90 border-b border-slate-800 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Google Places Autocomplete Suggestions
              </div>
              {suggestions.map((s, idx) => {
                const label =
                  s.placePrediction?.text?.text || 'Suggested Venue';
                return (
                  <button
                    key={s.placePrediction?.placeId || idx}
                    type="button"
                    onClick={() => handleSelectSuggestion(s)}
                    className="w-full text-left px-3 py-2 text-xs text-slate-200 hover:bg-sky-500/15 border-b border-slate-800/60 last:border-b-0 flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    <span className="truncate">{label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Search Presets */}
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
            Quick Facility Discovery
          </div>
          <div className="flex flex-wrap gap-1.5">
            {QUICK_SEARCH_QUERIES.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => {
                  setSearchInput(q);
                  handleTextSearch(q);
                }}
                className="px-2 py-1 rounded-md text-[11px] bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-sky-500/40 text-slate-300 transition-colors cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {errorMessage && (
          <div className="px-3 py-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
            {errorMessage}
          </div>
        )}

        {/* Live Venue Results List */}
        <div className="flex-1 min-h-[220px] max-h-[270px] overflow-y-auto space-y-2 pr-1">
          {isLoading && searchResults.length === 0 ? (
            <div className="h-44 flex flex-col items-center justify-center gap-2 text-slate-400 text-xs">
              <Loader2 className="w-5 h-5 animate-spin text-sky-400" />
              <span>Querying Google Maps Places API (New)...</span>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="h-44 flex flex-col items-center justify-center text-center px-4 text-slate-400 text-xs border border-dashed border-slate-800 rounded-lg">
              <Compass className="w-5 h-5 text-slate-500 mb-1.5" />
              <span>
                Search for a stadium, pitch, or sports science facility above to
                load live Google Maps venues.
              </span>
            </div>
          ) : (
            searchResults.map((venue) => {
              const isSelected = selectedVenue?.placeId === venue.placeId;
              return (
                <div
                  key={venue.placeId}
                  onClick={() => {
                    setSelectedVenue(venue);
                    if (map) {
                      map.panTo({ lat: venue.lat, lng: venue.lng });
                      map.setZoom(15);
                    }
                  }}
                  className={`p-3 rounded-lg border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-sky-500/10 border-sky-500/50'
                      : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="font-semibold text-xs text-slate-100 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                      <span>{venue.name}</span>
                    </div>
                    {venue.rating !== undefined && (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-500/15 border border-amber-500/30 text-[10px] font-semibold text-amber-300 shrink-0">
                        <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                        {venue.rating.toFixed(1)}
                      </span>
                    )}
                  </div>
                  {venue.formattedAddress && (
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                      {venue.formattedAddress}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/70">
                    <span className="text-[10px] font-mono text-slate-500">
                      {venue.lat.toFixed(4)}, {venue.lng.toFixed(4)}
                    </span>
                    {venue.googleMapsUri && (
                      <a
                        href={venue.googleMapsUri}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 text-[11px] font-medium text-sky-400 hover:text-sky-300"
                      >
                        <span>Open in Google Maps</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Assignment Target Box */}
        <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Assign Selected Venue to Training Session
            </label>
            {selectedVenue && (
              <span className="text-[11px] font-medium text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                {selectedVenue.name}
              </span>
            )}
          </div>
          <select
            value={selectedSessionId}
            onChange={(e) => onSelectSessionId(e.target.value)}
            className="w-full px-2.5 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-sky-500"
          >
            {sessions.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title} ({s.date} · {s.startTime} · Current: {s.venue})
              </option>
            ))}
          </select>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={!selectedVenue || !activeSession}
              onClick={() => {
                if (selectedVenue && activeSession) {
                  onAssignVenueToSession(activeSession.id, selectedVenue);
                  onClose();
                }
              }}
              className="flex-1 py-2 px-3 rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 transition-colors cursor-pointer"
            >
              Assign Venue to Session
            </button>
            {onSendVenueQueryToCopilot && selectedVenue && (
              <button
                type="button"
                onClick={() => {
                  onSendVenueQueryToCopilot(
                    `Evaluate venue logistics and travel recovery impact for ${selectedVenue.name} (${selectedVenue.formattedAddress}) for ${activeSession?.title || 'our next session'}.`
                  );
                  onClose();
                }}
                className="py-2 px-3 rounded-lg text-xs font-semibold bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/40 text-sky-300 transition-colors cursor-pointer"
              >
                Ask AI Copilot
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Right Column: Interactive Google Map with AdvancedMarkers */}
      <div className="lg:col-span-7 flex flex-col gap-2">
        <div className="h-[440px] w-full rounded-xl overflow-hidden border border-slate-800 relative bg-slate-900">
          <Map
            mapId="DEMO_MAP_ID"
            defaultZoom={12}
            defaultCenter={userCenter}
            gestureHandling="greedy"
            internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
            className="w-full h-full"
          >
            {searchResults.map((venue) => {
              const isSelected = selectedVenue?.placeId === venue.placeId;
              return (
                <AdvancedMarker
                  key={venue.placeId}
                  position={{ lat: venue.lat, lng: venue.lng }}
                  title={venue.name}
                  onClick={() => setSelectedVenue(venue)}
                >
                  <Pin
                    background={isSelected ? '#0ea5e9' : '#10b981'}
                    borderColor={isSelected ? '#e0f2fe' : '#064e3b'}
                    glyphColor="#020617"
                    scale={isSelected ? 1.25 : 1.0}
                  />
                </AdvancedMarker>
              );
            })}

            {selectedVenue && (
              <InfoWindow
                position={{ lat: selectedVenue.lat, lng: selectedVenue.lng }}
                onCloseClick={() => setSelectedVenue(null)}
                maxWidth={260}
              >
                <div className="text-slate-900 p-1 space-y-1">
                  <div className="font-bold text-xs">{selectedVenue.name}</div>
                  {selectedVenue.formattedAddress && (
                    <div className="text-[11px] text-slate-600">
                      {selectedVenue.formattedAddress}
                    </div>
                  )}
                  {selectedVenue.rating !== undefined && (
                    <div className="text-[11px] font-semibold text-amber-700">
                      Rating: {selectedVenue.rating.toFixed(1)} ★
                      {selectedVenue.userRatingCount
                        ? ` (${selectedVenue.userRatingCount} reviews)`
                        : ''}
                    </div>
                  )}
                  {selectedVenue.googleMapsUri && (
                    <a
                      href={selectedVenue.googleMapsUri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-[11px] font-semibold text-sky-700 underline mt-1"
                    >
                      View on Google Maps
                    </a>
                  )}
                </div>
              </InfoWindow>
            )}
          </Map>
        </div>

        <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-900/70 border border-slate-800/80 text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <Building2 className="w-3.5 h-3.5 text-sky-400" />
            <span>
              Powered by Google Maps Platform (Maps JavaScript API, Places API
              New, Advanced Markers)
            </span>
          </div>
          {selectedVenue && (
            <span className="font-mono text-slate-300">
              Selected: {selectedVenue.name}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export const VenueMapsModal: React.FC<VenueMapsModalProps> = ({
  isOpen,
  onClose,
  sessions,
  initialSessionId,
  onAssignVenueToSession,
  onSendVenueQueryToCopilot,
}) => {
  const [selectedSessionId, setSelectedSessionId] = useState<string>(
    initialSessionId || sessions[0]?.id || ''
  );

  useEffect(() => {
    if (initialSessionId) {
      setSelectedSessionId(initialSessionId);
    } else if (sessions[0]?.id && !selectedSessionId) {
      setSelectedSessionId(sessions[0].id);
    }
  }, [initialSessionId, sessions, selectedSessionId]);

  if (!isOpen) return null;

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-5xl bg-slate-950 border border-slate-800 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-5 py-3.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500/15 border border-sky-500/30 flex items-center justify-center">
              <MapPin className="w-4 h-4 text-sky-400" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <span>Google Maps Venue & Facility Intelligence</span>
                <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded bg-sky-500/15 text-sky-300 border border-sky-500/30">
                  Places API (New)
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">
                Search stadiums, high-performance centers, and sports medicine
                venues on Google Maps and assign them to training sessions.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto">
          {!apiKey ? (
            <div className="p-8 text-center space-y-2">
              <p className="text-xs text-amber-300 font-semibold">
                VITE_GOOGLE_MAPS_API_KEY is not set in the environment.
              </p>
              <p className="text-xs text-slate-400">
                Please configure VITE_GOOGLE_MAPS_API_KEY in AI Studio Settings
                &gt; Secrets to load the interactive Google Map.
              </p>
            </div>
          ) : (
            <APIProvider apiKey={apiKey} libraries={['places', 'marker']}>
              <VenueExplorerInner
                sessions={sessions}
                selectedSessionId={selectedSessionId}
                onSelectSessionId={setSelectedSessionId}
                onAssignVenueToSession={onAssignVenueToSession}
                onSendVenueQueryToCopilot={onSendVenueQueryToCopilot}
                onClose={onClose}
              />
            </APIProvider>
          )}
        </div>
      </div>
    </div>
  );
};
