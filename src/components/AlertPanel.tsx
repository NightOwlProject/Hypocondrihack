import React, { useState, useEffect } from 'react';
import { AlertOctagon, History } from 'lucide-react';
import { faker } from '@faker-js/faker';

interface Alert {
  type: string;
  message: string;
  severity: 'high' | 'critical';
  timestamp: Date;
}

const ALERT_TYPES = [
  "POTENTIAL MALWARE DETECTED",
  "SUSPICIOUS NETWORK ACTIVITY",
  "UNAUTHORIZED PORT SCAN ATTEMPT",
  "SYSTEM TEMPERATURE CRITICAL",
  "MEMORY LEAK DETECTED",
  "POSSIBLE KEYLOGGER ACTIVITY",
  "UNUSUAL CPU SPIKES",
  "POTENTIAL DATA EXFILTRATION"
];

const ALERT_MESSAGES = [
  "Unusual process behavior detected in system memory",
  "Multiple failed authentication attempts detected",
  "Unexpected network traffic pattern identified",
  "Critical system resource usage detected",
  "Potential security breach attempt blocked",
  "Suspicious file system activity detected",
  "Abnormal system call pattern identified",
  "Unauthorized access attempt blocked"
];

const AlertPanel = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [alertHistory, setAlertHistory] = useState<Alert[]>([]);

  useEffect(() => {
    // Listen for paranoid alerts
    const handleParanoidAlert = (event: CustomEvent) => {
      const newAlert = {
        type: event.detail.type,
        message: faker.helpers.arrayElement(ALERT_MESSAGES),
        severity: 'critical',
        timestamp: event.detail.timestamp
      };

      setAlerts(prev => {
        const newAlerts = [...prev, newAlert].slice(-4);
        setAlertHistory(history => [newAlert, ...history].slice(0, 50));
        return newAlerts;
      });
    };

    window.addEventListener('paranoidAlert', handleParanoidAlert as EventListener);

    const interval = setInterval(() => {
      const newAlert = {
        type: faker.helpers.arrayElement(ALERT_TYPES),
        message: faker.helpers.arrayElement(ALERT_MESSAGES),
        severity: faker.helpers.arrayElement(['high', 'critical'] as const),
        timestamp: new Date()
      };

      setAlerts(prev => {
        const newAlerts = [...prev, newAlert].slice(-4);
        setAlertHistory(history => [newAlert, ...history].slice(0, 50));
        return newAlerts;
      });
    }, 4000);

    return () => {
      clearInterval(interval);
      window.removeEventListener('paranoidAlert', handleParanoidAlert as EventListener);
    };
  }, []);

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-red-400">THREAT ALERTS</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowHistory(prev => !prev)}
            className="flex items-center gap-1 px-2 py-1 rounded bg-gray-700 hover:bg-gray-600 transition-colors"
          >
            <History className="w-4 h-4" />
            {showHistory ? 'Current' : 'History'}
          </button>
          <AlertOctagon className="w-6 h-6 text-red-400 animate-pulse" />
        </div>
      </div>

      <div className="h-[400px] overflow-y-auto space-y-3">
        {(showHistory ? alertHistory : alerts).map((alert, i) => (
          <div 
            key={i}
            className={`p-3 rounded ${
              alert.severity === 'critical' ? 'bg-red-900/50 animate-pulse' : 'bg-yellow-900/50'
            }`}
          >
            <div className="font-bold mb-1">{alert.type}</div>
            <div className="text-sm opacity-80">{alert.message}</div>
            <div className="text-xs opacity-60 mt-1">
              {alert.timestamp.toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlertPanel