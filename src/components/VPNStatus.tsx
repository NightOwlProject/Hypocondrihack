import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, Map } from 'lucide-react';
import { faker } from '@faker-js/faker';
import VPNMap from './VPNMap';

const VPN_LOCATIONS = [
  { country: "Greenland", code: "GL", risk: "low" },
  { country: "Brunei", code: "BN", risk: "medium" },
  { country: "South Africa", code: "ZA", risk: "high" },
  { country: "Russia", code: "RU", risk: "extreme" },
  { country: "France", code: "FR", risk: "low" },
  { country: "United States", code: "US", risk: "high" },
  { country: "Canada", code: "CA", risk: "low" },
  { country: "Lebanon", code: "LB", risk: "extreme" },
  { country: "South Korea", code: "KR", risk: "medium" },
  { country: "Uruguay", code: "UY", risk: "low" }
];

interface VPNTunnel {
  id: number;
  location: typeof VPN_LOCATIONS[number];
  status: 'active' | 'compromised';
  latency: number;
}

const VPNStatus = () => {
  const [tunnels, setTunnels] = useState<VPNTunnel[]>([]);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    setTunnels(
      VPN_LOCATIONS.map((location, i) => ({
        id: i + 1,
        location,
        status: 'active',
        latency: faker.number.int({ min: 50, max: 200 })
      }))
    );

    const interval = setInterval(() => {
      setTunnels(prev => {
        const newTunnels = [...prev];
        const randomIndex = faker.number.int({ min: 0, max: VPN_LOCATIONS.length - 1 });
        newTunnels[randomIndex] = {
          ...newTunnels[randomIndex],
          status: faker.helpers.arrayElement(['active', 'compromised'] as const),
          latency: faker.number.int({ min: 50, max: 200 })
        };
        return newTunnels;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="bg-gray-800 p-4 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-purple-400">VPN TUNNEL STATUS</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowMap(true)}
              className="flex items-center gap-2 px-3 py-1 rounded bg-purple-900 hover:bg-purple-800 transition-colors text-purple-100"
            >
              <Map className="w-4 h-4" />
              View Network Map
            </button>
            <Shield className="w-6 h-6 text-purple-400" />
          </div>
        </div>

        <div className="grid grid-cols-5 gap-2">
          {tunnels.map(tunnel => (
            <div 
              key={tunnel.id}
              className={`p-2 rounded ${
                tunnel.status === 'compromised' ? 'bg-red-900/50 animate-pulse' : 'bg-gray-700/50'
              }`}
            >
              <div className="flex items-center gap-2">
                {tunnel.status === 'compromised' && (
                  <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
                )}
                <img
                  src={`https://flagcdn.com/${tunnel.location.code.toLowerCase()}.svg`}
                  alt={tunnel.location.country}
                  className="w-6 h-4 object-cover rounded flex-shrink-0"
                />
                <span className="font-mono text-sm truncate">Tunnel {tunnel.id}</span>
              </div>
              <div className="text-xs opacity-70 truncate">{tunnel.location.country}</div>
              <div className={`text-xs truncate ${
                tunnel.status === 'compromised' ? 'text-red-400' : 'text-green-400'
              }`}>
                {tunnel.status.toUpperCase()} - {tunnel.latency}ms
                <span className={`ml-2 ${
                  tunnel.location.risk === 'extreme' ? 'text-red-400' :
                  tunnel.location.risk === 'high' ? 'text-orange-400' :
                  tunnel.location.risk === 'medium' ? 'text-yellow-400' :
                  'text-green-400'
                }`}>
                  [{tunnel.location.risk.toUpperCase()}]
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showMap && (
        <VPNMap
          tunnels={tunnels}
          onClose={() => setShowMap(false)}
        />
      )}
    </>
  );
};

export default VPNStatus;