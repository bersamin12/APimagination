import { MapContainer, TileLayer, Marker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const createPin = () =>
  L.divIcon({
    className: "",
    html: `
      <div style="position: relative; width: 22px; height: 22px;">
        <div style="
          position: absolute;
          inset: 0;
          background: #0d9488;
          border-radius: 50%;
          border: 2.5px solid white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.25);
          z-index: 1;
        "></div>
        <div style="
          position: absolute;
          inset: -4px;
          background: rgba(13, 148, 136, 0.25);
          border-radius: 50%;
          animation: ping 1.8s ease-out infinite;
        "></div>
      </div>
      <style>
        @keyframes ping {
          0% { transform: scale(0.8); opacity: 0.6; }
          100% { transform: scale(2.2); opacity: 0; }
        }
      </style>
    `,
    iconSize: [22, 22],
    iconAnchor: [7, 7],
    tooltipAnchor: [8, 0],
});

function TravelMapView({ places }) {
  const cityPlaces = places.filter((p) => p.type === "city");

  return (
    <div className="h-full w-full">
      <MapContainer
        center={[20, 0]}
        zoom={2}
        scrollWheelZoom
        className="h-full w-full"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        {cityPlaces.map((place) => (
          <Marker
            key={place.id}
            position={[place.latitude, place.longitude]}
            icon={createPin()}
          >
            <Tooltip direction="right" offset={[8, 0]} opacity={1} permanent={false}>
              <div className="text-sm font-semibold text-slate-800">{place.name}</div>
              <div className="text-xs text-slate-400 mt-0.5">{place.country_name}</div>
            </Tooltip>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default TravelMapView;