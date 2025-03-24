import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { DivIcon } from 'leaflet';
import { faker } from '@faker-js/faker';
import { X } from 'lucide-react';

// Configuration des emplacements VPN avec leurs détails
const VPN_DETAILS = {
  "GL": {
    coords: [71.7069, -42.6043],
    city: "Nuuk",
    isp: "Arctic Network Solutions",
    datacenter: "IceVault Secure Facility",
    address: "742 Glacier Road, Nuuk 3900",
    ip: "172.16.254.1"
  },
  "BN": {
    coords: [4.5353, 114.7277],
    city: "Bandar Seri Begawan",
    isp: "Royal Brunei Telecom",
    datacenter: "SouthEast Quantum Center",
    address: "88 Sultan's Drive, BSB BE1518",
    ip: "192.168.1.254"
  },
  "ZA": {
    coords: [-30.5595, 22.9375],
    city: "Cape Town",
    isp: "Sahara Digital Networks",
    datacenter: "Table Mountain Fortress",
    address: "404 Lion's Head Circle, Cape Town 8002",
    ip: "10.0.0.1"
  },
  "RU": {
    coords: [61.5240, 105.3188],
    city: "Moscow",
    isp: "Siberian Grid Networks",
    datacenter: "Red Square Underground",
    address: "1917 Revolution Avenue, Moscow 101000",
    ip: "172.20.0.1"
  },
  "FR": {
    coords: [46.2276, 2.2137],
    city: "Paris",
    isp: "Orange Quantum",
    datacenter: "Eiffel CyberHub",
    address: "42 Rue de la Sécurité, Paris 75008",
    ip: "192.168.42.1"
  },
  "US": {
    coords: [37.0902, -95.7129],
    city: "Salt Lake City",
    isp: "Quantum Valley Networks",
    datacenter: "Area 52 Secure Facility",
    address: "1337 Cyber Street, SLC 84101",
    ip: "10.10.10.1"
  },
  "CA": {
    coords: [56.1304, -106.3468],
    city: "Toronto",
    isp: "Maple Secure Networks",
    datacenter: "Northern Lights Bunker",
    address: "200 Beaver Avenue, Toronto M5V 2T6",
    ip: "172.16.1.1"
  },
  "LB": {
    coords: [33.8547, 35.8623],
    city: "Beirut",
    isp: "Mediterranean Cyber Solutions",
    datacenter: "Phoenix Data Fortress",
    address: "789 Cedar Boulevard, Beirut 1107",
    ip: "192.168.100.1"
  },
  "KR": {
    coords: [35.9078, 127.7669],
    city: "Seoul",
    isp: "K-Secure Networks",
    datacenter: "Seoul Digital Citadel",
    address: "888 K-Pop Boulevard, Seoul 04524",
    ip: "10.20.30.1"
  },
  "UY": {
    coords: [-32.5228, -55.7658],
    city: "Montevideo",
    isp: "Southern Cross Digital",
    datacenter: "Pampas Data Center",
    address: "567 Tango Street, Montevideo 11100",
    ip: "172.20.20.1"
  }
} as const;

// Création d'un marqueur personnalisé avec style cybersécurité
const createMarkerIcon = (status: 'active' | 'compromised') => {
  const html = `
    <div class="relative group">
      <div class="absolute -inset-2 bg-gradient-to-r ${
        status === 'active' 
          ? 'from-green-600/50 to-blue-600/50' 
          : 'from-red-600/50 to-orange-600/50'
      } rounded-full blur-lg opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
      <div class="relative px-2 py-2">
        <div class="w-4 h-4 rounded-full ${
          status === 'active'
            ? 'bg-gradient-to-r from-green-500 to-blue-500'
            : 'bg-gradient-to-r from-red-500 to-orange-500'
        } shadow-lg ring-2 ring-white/20">
          <div class="w-full h-full rounded-full ${
            status === 'active'
              ? 'bg-green-400/50'
              : 'bg-red-400/50'
          } animate-ping"></div>
        </div>
      </div>
    </div>
  `;

  return new DivIcon({
    html,
    className: 'custom-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
};

interface VPNMapProps {
  tunnels: Array<{
    id: number;
    location: {
      country: string;
      code: string;
      risk: string;
    };
    status: 'active' | 'compromised';
    latency: number;
  }>;
  onClose: () => void;
}

const VPNMap: React.FC<VPNMapProps> = ({ tunnels, onClose }) => {
  const activeTunnels = tunnels.filter(t => t.status === 'active');
  const compromisedTunnels = tunnels.filter(t => t.status === 'compromised');

  const getLines = () => {
    const lines: Array<{
      coords: [number, number][];
      isCompromised: boolean;
    }> = [];

    for (let i = 0; i < tunnels.length; i++) {
      for (let j = i + 1; j < tunnels.length; j++) {
        const tunnel1 = tunnels[i];
        const tunnel2 = tunnels[j];
        const details1 = VPN_DETAILS[tunnel1.location.code as keyof typeof VPN_DETAILS];
        const details2 = VPN_DETAILS[tunnel2.location.code as keyof typeof VPN_DETAILS];
        
        if (details1 && details2) {
          lines.push({
            coords: [details1.coords, details2.coords],
            isCompromised: tunnel1.status === 'compromised' || tunnel2.status === 'compromised'
          });
        }
      }
    }
    return lines;
  };

  const renderPopupContent = (tunnel: VPNMapProps['tunnels'][0], details: typeof VPN_DETAILS[keyof typeof VPN_DETAILS]) => (
    <div className="font-mono space-y-3">
      <div className="flex items-center gap-2 border-b border-white/10 pb-2">
        <img
          src={`https://flagcdn.com/${tunnel.location.code.toLowerCase()}.svg`}
          alt={tunnel.location.country}
          className="w-6 h-4 object-cover rounded"
        />
        <span className="font-bold">{tunnel.location.country}</span>
      </div>
      <div className="vpn-info-grid">
        <div className="vpn-info-label">City:</div>
        <div className={`vpn-info-value ${tunnel.status === 'compromised' ? 'compromised' : ''}`}>{details.city}</div>
        <div className="vpn-info-label">Coordinates:</div>
        <div className={`vpn-info-value ${tunnel.status === 'compromised' ? 'compromised' : ''}`}>{details.coords.join(', ')}</div>
        <div className="vpn-info-label">IP Address:</div>
        <div className={`vpn-info-value ${tunnel.status === 'compromised' ? 'compromised' : ''} font-mono`}>{details.ip}</div>
        <div className="vpn-info-label">ISP:</div>
        <div className={`vpn-info-value ${tunnel.status === 'compromised' ? 'compromised' : ''}`}>{details.isp}</div>
        <div className="vpn-info-label">Data Center:</div>
        <div className={`vpn-info-value ${tunnel.status === 'compromised' ? 'compromised' : ''}`}>{details.datacenter}</div>
        <div className="vpn-info-label">Address:</div>
        <div className={`vpn-info-value ${tunnel.status === 'compromised' ? 'compromised' : ''}`}>{details.address}</div>
        <div className="vpn-info-label">Status:</div>
        <div className={`vpn-info-value ${tunnel.status === 'compromised' ? 'text-red-400 animate-pulse' : 'text-green-400'}`}>
          {tunnel.status === 'compromised' ? '⚠️ COMPROMISED ⚠️' : 'ACTIVE'}
        </div>
        <div className="vpn-info-label">Latency:</div>
        <div className={`vpn-info-value ${tunnel.status === 'compromised' ? 'compromised' : ''}`}>{tunnel.latency}ms</div>
        <div className="vpn-info-label">Risk Level:</div>
        <div className={`vpn-info-value ${
          tunnel.location.risk === 'extreme' ? 'text-red-500' :
          tunnel.location.risk === 'high' ? 'text-orange-500' :
          tunnel.location.risk === 'medium' ? 'text-yellow-500' :
          'text-green-500'
        }`}>
          {tunnel.location.risk.toUpperCase()}
        </div>
        {tunnel.status === 'compromised' ? (
          <>
            <div className="vpn-info-label">Intrusion Type:</div>
            <div className="vpn-info-value compromised">{faker.helpers.arrayElement([
              'Man-in-the-Middle',
              'DNS Poisoning',
              'SSL Strip',
              'Packet Injection',
              'ARP Spoofing'
            ])}</div>
            <div className="vpn-info-label">Attack Origin:</div>
            <div className="vpn-info-value compromised font-mono">{faker.internet.ip()}</div>
          </>
        ) : (
          <>
            <div className="vpn-info-label">Traffic:</div>
            <div className="vpn-info-value">{faker.number.int({ min: 10, max: 500 })} Mbps</div>
            <div className="vpn-info-label">Encryption:</div>
            <div className="vpn-info-value">AES-256-GCM</div>
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg w-full max-w-6xl relative">
        <div className="absolute -top-3 -right-3 z-10">
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center shadow-lg border-2 border-gray-800 transition-all duration-200 hover:scale-110"
            aria-label="Close map"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>
        <div className="p-4 flex justify-between items-center border-b border-gray-700">
          <h2 className="text-xl font-bold text-purple-400">VPN NETWORK MAP</h2>
        </div>
        <div className="p-4">
          <div className="h-[600px] rounded-lg overflow-hidden">
            <MapContainer
              center={[20, 0]}
              zoom={2}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attribution">CARTO</a>'
              />
              
              {getLines().map((line, i) => {
                if (line.isCompromised) {
                  return (
                    <React.Fragment key={i}>
                      <Polyline
                        positions={line.coords}
                        pathOptions={{
                          color: '#ef4444',
                          weight: 2,
                          opacity: 0.7,
                          dashArray: '5, 10'
                        }}
                        className="vpn-line-compromised-1"
                      />
                      <Polyline
                        positions={line.coords}
                        pathOptions={{
                          color: '#b91c1c',
                          weight: 2,
                          opacity: 0.5,
                          dashArray: '10, 5'
                        }}
                        className="vpn-line-compromised-2"
                      />
                    </React.Fragment>
                  );
                }
                return (
                  <Polyline
                    key={i}
                    positions={line.coords}
                    pathOptions={{
                      color: '#9333ea',
                      weight: 1,
                      opacity: 0.5,
                      dashArray: '5, 10'
                    }}
                    className="vpn-line-active"
                  />
                );
              })}

              {activeTunnels.map(tunnel => {
                const details = VPN_DETAILS[tunnel.location.code as keyof typeof VPN_DETAILS];
                if (!details) return null;
                return (
                  <Marker
                    key={tunnel.id}
                    position={details.coords}
                    icon={createMarkerIcon('active')}
                  >
                    <Popup className="custom-popup">
                      {renderPopupContent(tunnel, details)}
                    </Popup>
                  </Marker>
                );
              })}

              {compromisedTunnels.map(tunnel => {
                const details = VPN_DETAILS[tunnel.location.code as keyof typeof VPN_DETAILS];
                if (!details) return null;
                return (
                  <Marker
                    key={tunnel.id}
                    position={details.coords}
                    icon={createMarkerIcon('compromised')}
                  >
                    <Popup className="custom-popup">
                      {renderPopupContent(tunnel, details)}
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VPNMap;