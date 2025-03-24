import React, { useState, useEffect } from 'react';
import { Activity } from 'lucide-react';
import SystemMonitor from './components/SystemMonitor';
import NetworkScanner from './components/NetworkScanner';
import ProcessList from './components/ProcessList';
import AlertPanel from './components/AlertPanel';
import VPNStatus from './components/VPNStatus';
import ConsoleOutput from './components/ConsoleOutput';
import CheckStart from './components/CheckStart';
import TypingPopup from './components/TypingPopup';

const PARANOID_EVENTS = {
  copy: "ATTEMPT TO COPY SENSITIVE DATA DETECTED!",
  paste: "UNAUTHORIZED DATA INJECTION!",
  contextmenu: "ATTEMPT TO ACCESS CONTEXT MENU!",
  mouseleave: "CURSOR LEFT SECURE AREA!",
  mouseenter: "NEW USER INTERACTION DETECTED!",
  keydown: "SUSPICIOUS KEYBOARD ACTIVITY!",
  focus: "WINDOW CHANGE - POSSIBLE ESPIONAGE ATTEMPT!",
  blur: "FOCUS LOST - POSSIBLE COMPROMISE!",
};

function App() {
  const [panicMode, setPanicMode] = useState(false);
  const [lastActivity, setLastActivity] = useState<Date>(new Date());

  useEffect(() => {
    const triggerParanoidAlert = (event: string) => {
      setPanicMode(true);
      const customEvent = new CustomEvent('paranoidAlert', {
        detail: { type: event, timestamp: new Date() }
      });
      window.dispatchEvent(customEvent);
      setTimeout(() => setPanicMode(false), 3000);
    };

    Object.keys(PARANOID_EVENTS).forEach(event => {
      window.addEventListener(event, () => {
        triggerParanoidAlert(PARANOID_EVENTS[event as keyof typeof PARANOID_EVENTS]);
      });
    });

    const inactivityCheck = setInterval(() => {
      const now = new Date();
      if (now.getTime() - lastActivity.getTime() > 10000) {
        triggerParanoidAlert("SUSPICIOUS INACTIVITY PERIOD DETECTED!");
      }
    }, 5000);

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        triggerParanoidAlert("SUSPICIOUS TAB CHANGE DETECTED!");
      }
    });

    window.addEventListener('online', () => {
      triggerParanoidAlert("NEW NETWORK CONNECTION DETECTED!");
    });

    window.addEventListener('offline', () => {
      triggerParanoidAlert("CONNECTION LOST - POSSIBLE ATTACK!");
    });

    window.addEventListener('storage', () => {
      triggerParanoidAlert("LOCAL STORAGE MODIFICATION DETECTED!");
    });

    return () => {
      Object.keys(PARANOID_EVENTS).forEach(event => {
        window.removeEventListener(event, () => {});
      });
      clearInterval(inactivityCheck);
    };
  }, [lastActivity]);

  useEffect(() => {
    const updateActivity = () => setLastActivity(new Date());
    window.addEventListener('mousemove', updateActivity);
    window.addEventListener('keydown', updateActivity);
    window.addEventListener('click', updateActivity);

    return () => {
      window.removeEventListener('mousemove', updateActivity);
      window.removeEventListener('keydown', updateActivity);
      window.removeEventListener('click', updateActivity);
    };
  }, []);

  return (
    <div className={`h-screen bg-gray-900 text-green-400 p-4 flex flex-col transition-opacity duration-300 ${panicMode ? 'opacity-90' : 'opacity-100'}`}>
      <TypingPopup />
      
      <header className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8">
            <svg viewBox="0 0 24 24" className="w-full h-full">
              <mask id="mask">
                <rect x="0" y="0" width="24" height="24" fill="white" />
                <path
                  d="M 0,12 L 4,12 L 6,8 L 8,16 L 10,4 L 12,20 L 14,8 L 16,16 L 18,12 L 24,12"
                  stroke="black"
                  strokeWidth="1"
                  fill="none"
                />
              </mask>
              <circle cx="12" cy="12" r="10" fill="currentColor" mask="url(#mask)" />
              <path
                d="M 0,12 L 4,12 L 6,8 L 8,16 L 10,4 L 12,20 L 14,8 L 16,16 L 18,12 L 24,12"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                className="animate-pulse"
              />
              <path
                d="M 8,8 L 16,8 L 16,14 L 8,14 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              />
              <circle cx="10" cy="11" r="1" fill="currentColor" />
              <circle cx="14" cy="11" r="1" fill="currentColor" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">HYPOCONDRIHACK</h1>
        </div>

        <div className="flex items-center gap-4">
          <span className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-red-500" />
            THREAT LEVEL: EXTREME
          </span>
          <button 
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
            onClick={() => {
              setPanicMode(true);
              const customEvent = new CustomEvent('paranoidAlert', {
                detail: { type: "ATTEMPT TO SHUT DOWN PROTECTION SYSTEM!", timestamp: new Date() }
              });
              window.dispatchEvent(customEvent);
              setTimeout(() => setPanicMode(false), 3000);
            }}
          >
            EMERGENCY SHUTDOWN
          </button>
        </div>
      </header>

      <div className="flex-1 grid grid-cols-12 gap-4 min-h-0">
        <div className="col-span-8 grid grid-rows-[auto_1fr] gap-4">
          <div className="grid grid-cols-2 gap-4">
            <SystemMonitor />
            <NetworkScanner />
          </div>
          <div className="grid grid-rows-[auto_1fr] gap-4">
            <div className="h-48 overflow-hidden">
              <ProcessList />
            </div>
            <VPNStatus />
          </div>
        </div>

        <div className="col-span-4 grid grid-rows-[1fr_auto] gap-4">
          <AlertPanel />
          <div className="h-96">
            <ConsoleOutput />
          </div>
        </div>
      </div>

      <CheckStart />
    </div>
  );
}

export default App;
