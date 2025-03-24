import React, { useState, useEffect } from 'react';
import { faker } from '@faker-js/faker';
import { AlertTriangle, Wifi } from 'lucide-react';

const NetworkScanner = () => {
  const [connections, setConnections] = useState<Array<{
    ip: string;
    port: number;
    threat: number;
    timestamp: Date;
  }>>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newConnection = {
        ip: faker.internet.ip(),
        port: faker.number.int({ min: 1, max: 65535 }),
        threat: faker.number.int({ min: 1, max: 100 }),
        timestamp: new Date()
      };

      setConnections(prev => [...prev.slice(-4), newConnection]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-yellow-400">NETWORK INTRUSION MONITOR</h2>
        <Wifi className="w-6 h-6 animate-pulse text-yellow-400" />
      </div>
      
      <div className="space-y-2">
        {connections.map((conn, i) => (
          <div 
            key={i}
            className={`flex items-center justify-between p-2 rounded ${
              conn.threat > 70 ? 'bg-red-900/50' : 'bg-gray-700/50'
            }`}
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                {conn.threat > 70 && <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />}
                <span className="font-mono truncate">{conn.ip}:{conn.port}</span>
              </div>
              <div className="text-sm opacity-70 truncate">
                {conn.timestamp.toLocaleTimeString()}
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="font-bold">
                Threat Level: {conn.threat}%
              </div>
              <div className="text-sm text-red-400">
                {conn.threat > 70 ? 'SUSPICIOUS ACTIVITY' : 'Monitoring'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NetworkScanner