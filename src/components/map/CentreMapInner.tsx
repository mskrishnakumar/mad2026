'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { MagicBusCentre } from '@/lib/types/data';
import { Users, Building2 } from 'lucide-react';

interface CentreMapInnerProps {
  centres: MagicBusCentre[];
  selectedCentreId: string | null;
  nearestCentreId: string | null;
  onSelectCentre: (centre: MagicBusCentre) => void;
}

// Create custom icons
const defaultIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const selectedIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const nearestIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function getIcon(centreId: string, selectedCentreId: string | null, nearestCentreId: string | null) {
  if (centreId === selectedCentreId) return selectedIcon;
  if (centreId === nearestCentreId) return nearestIcon;
  return defaultIcon;
}

export default function CentreMapInner({ centres, selectedCentreId, nearestCentreId, onSelectCentre }: CentreMapInnerProps) {
  return (
    <MapContainer
      center={[13.0382, 80.1565]}
      zoom={12}
      style={{ height: '100%', width: '100%' }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {centres.map((centre) => (
        <Marker
          key={centre.id}
          position={[centre.latitude, centre.longitude]}
          icon={getIcon(centre.id, selectedCentreId, nearestCentreId)}
          eventHandlers={{
            click: () => onSelectCentre(centre),
          }}
        >
          <Popup>
            <div className="p-2 min-w-[200px]">
              <h3 className="font-semibold text-gray-900">{centre.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{centre.address}</p>
              <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  <span>{centre.currentEnrollment}/{centre.capacity}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Building2 className="h-3 w-3" />
                  <span>{centre.pinCodes[0]}</span>
                </div>
              </div>
              <button
                onClick={() => onSelectCentre(centre)}
                className="mt-3 w-full bg-blue-600 text-white text-sm py-1.5 px-3 rounded-md hover:bg-blue-700 transition-colors"
              >
                Select this centre
              </button>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
