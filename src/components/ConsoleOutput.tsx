import React, { useState, useEffect, useRef } from 'react';
import { Terminal } from 'lucide-react';
import { faker } from '@faker-js/faker';

const CONSOLE_MESSAGES = [
  "Scanning memory region 0x7FFE0000...",
  "Analyzing network packets on port {port}...",
  "Detected unusual system call pattern...",
  "Monitoring process {pid} for suspicious activity...",
  "Checking file integrity in system32...",
  "Analyzing entropy of network traffic...",
  "Investigating potential buffer overflow...",
  "Scanning for rootkit signatures...",
  "Verifying kernel integrity...",
  "Checking for unauthorized system hooks...",
  "Monitoring DLL injection attempts...",
  "Analyzing process memory patterns...",
  "Scanning for suspicious registry changes...",
  "Checking network protocol anomalies...",
  "Monitoring USB device connections..."
];

const ConsoleOutput = () => {
  const [lines, setLines] = useState<string[]>([]);
  const consoleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      let message = faker.helpers.arrayElement(CONSOLE_MESSAGES)
        .replace('{port}', faker.number.int({ min: 1, max: 65535 }).toString())
        .replace('{pid}', faker.number.int({ min: 1000, max: 9999 }).toString());

      setLines(prev => {
        const newLines = [...prev, message];
        return newLines.slice(-15);
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [lines]);

  return (
    <div className="bg-gray-800 p-4 rounded-lg h-full">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-bold text-green-400">SYSTEM CONSOLE</h2>
        <Terminal className="w-6 h-6 text-green-400" />
      </div>

      <div 
        ref={consoleRef}
        className="font-mono text-sm bg-black/50 p-3 rounded h-[calc(100%-3rem)] overflow-y-auto"
      >
        {lines.map((line, i) => (
          <div key={i} className="opacity-70">
            <span className="text-green-400">$</span> {line}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConsoleOutput;