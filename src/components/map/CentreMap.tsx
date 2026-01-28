'use client';

import { useEffect, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { MagicBusCentre } from '@/lib/types/data';
import { MapPin, Users, Building2, Navigation } from 'lucide-react';
import { getCentresGroupedByDistance } from '@/data/centres';

interface CentreMapProps {
  centres: MagicBusCentre[];
  selectedCentreId: string | null;
  nearestCentreId: string | null;
  onSelectCentre: (centre: MagicBusCentre) => void;
  userPinCode?: string;
}

// Create a wrapper component for the actual map to avoid SSR issues
function MapPlaceholder() {
  return (
    <div className="w-full h-[400px] bg-gray-100 rounded-xl flex items-center justify-center">
      <div className="text-center text-gray-500">
        <MapPin className="h-8 w-8 mx-auto mb-2 animate-pulse" />
        <p>Loading map...</p>
      </div>
    </div>
  );
}

// Dynamically import the map implementation
const MapImplementation = dynamic(
  () => import('./CentreMapInner'),
  {
    ssr: false,
    loading: () => <MapPlaceholder />,
  }
);

export function CentreMap({ centres, selectedCentreId, nearestCentreId, onSelectCentre, userPinCode }: CentreMapProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Group centres by distance if user PIN code is provided
  const groupedCentres = useMemo(() => {
    if (userPinCode) {
      return getCentresGroupedByDistance(userPinCode);
    }
    return null;
  }, [userPinCode]);

  // Render a centre card
  const renderCentreCard = (centre: MagicBusCentre & { distance?: number }) => (
    <button
      key={centre.id}
      onClick={() => onSelectCentre(centre)}
      className={`
        p-4 rounded-xl border-2 text-left transition-all duration-200
        ${selectedCentreId === centre.id
          ? 'border-green-500 bg-green-50'
          : nearestCentreId === centre.id
            ? 'border-orange-500 bg-orange-50'
            : 'border-gray-200 hover:border-gray-300 bg-white'
        }
      `}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-medium text-gray-900">{centre.name}</h4>
            {nearestCentreId === centre.id && (
              <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">
                Nearest
              </span>
            )}
            {selectedCentreId === centre.id && (
              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                Selected
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600 mt-1">{centre.address}</p>
        </div>
        <div className="text-right text-xs text-gray-500">
          {centre.distance !== undefined && (
            <div className="flex items-center gap-1 text-blue-600 font-medium mb-1">
              <Navigation className="h-3 w-3" />
              {centre.distance.toFixed(1)} km
            </div>
          )}
          <div>{centre.currentEnrollment}/{centre.capacity} enrolled</div>
        </div>
      </div>
    </button>
  );

  return (
    <div className="space-y-4">
      {/* Map Legend */}
      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
          <span>Nearest to you</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded-full"></div>
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
          <span>Available centres</span>
        </div>
      </div>

      {/* Map Container */}
      <div className="w-full h-[400px] rounded-xl overflow-hidden border border-gray-200 shadow-sm">
        {isClient ? (
          <MapImplementation
            centres={centres}
            selectedCentreId={selectedCentreId}
            nearestCentreId={nearestCentreId}
            onSelectCentre={onSelectCentre}
          />
        ) : (
          <MapPlaceholder />
        )}
      </div>

      {/* Centre Cards List - Grouped by Distance */}
      {groupedCentres ? (
        <div className="space-y-6">
          {/* Nearby Centres (< 5km) */}
          {groupedCentres.nearby.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <h4 className="text-sm font-semibold text-gray-700">
                  Distance &lt; 5 km ({groupedCentres.nearby.length} centre{groupedCentres.nearby.length > 1 ? 's' : ''})
                </h4>
              </div>
              <div className="grid gap-3">
                {groupedCentres.nearby.map(renderCentreCard)}
              </div>
            </div>
          )}

          {/* Farther Centres (>= 5km) */}
          {groupedCentres.farther.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                <h4 className="text-sm font-semibold text-gray-700">
                  Distance &gt; 5 km ({groupedCentres.farther.length} centre{groupedCentres.farther.length > 1 ? 's' : ''})
                </h4>
              </div>
              <div className="grid gap-3">
                {groupedCentres.farther.map(renderCentreCard)}
              </div>
            </div>
          )}
        </div>
      ) : (
        // Fallback: Show all centres without grouping
        <div className="grid gap-3">
          <h4 className="text-sm font-medium text-gray-700">All Magic Bus Centres</h4>
          {centres.map((centre) => renderCentreCard(centre))}
        </div>
      )}
    </div>
  );
}
