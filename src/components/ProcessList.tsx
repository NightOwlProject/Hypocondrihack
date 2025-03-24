import React, { useState, useEffect } from 'react';
import { AlertCircle, Search, Cpu, HardDrive } from 'lucide-react';

const realProcesses = [
  { name: 'explorer.exe', emoji: '🖥️' },
  { name: 'svchost.exe', emoji: '⚙️' },
  { name: 'chrome.exe', emoji: '🌐' },
  { name: 'taskmgr.exe', emoji: '🔧' },
  { name: 'notepad.exe', emoji: '📝' },
  { name: 'cmd.exe', emoji: '💻' },
  { name: 'winword.exe', emoji: '📄' },
  { name: 'excel.exe', emoji: '📊' },
  { name: 'powerpnt.exe', emoji: '📽️' },
  { name: 'msedge.exe', emoji: '🌍' },
  { name: 'outlook.exe', emoji: '📧' },
  { name: 'firefox.exe', emoji: '🦊' },
  { name: 'teams.exe', emoji: '💬' },
  { name: 'discord.exe', emoji: '🎙️' },
  { name: 'spotify.exe', emoji: '🎵' },
  { name: 'steam.exe', emoji: '🎮' },
  { name: 'epicgameslauncher.exe', emoji: '🎮' },
  { name: 'vlc.exe', emoji: '📺' },
  { name: 'calc.exe', emoji: '🧮' },
  { name: 'onenote.exe', emoji: '🗒️' }
];

const funProcesses = [
  { name: 'Doing grocery shopping', emoji: '🛒' },
  { name: 'At the gym', emoji: '🏋️' },
  { name: 'Secretly watching Netflix', emoji: '🎬' },
  { name: 'Eating a virtual burger', emoji: '🍔' },
  { name: 'Sleep.exe', emoji: '💤' },
  { name: 'Hunting Pokémon', emoji: '🐉' },
  { name: 'Baking cookies', emoji: '🍪' },
  { name: 'Browsing memes', emoji: '😂' },
  { name: 'Writing a novel', emoji: '✍️' },
  { name: 'Ninja mode activated', emoji: '🥷' },
  { name: 'Dance Party.exe', emoji: '💃' },
  { name: 'Pretending to work', emoji: '🙄' },
  { name: 'Fixing the internet with duct tape', emoji: '🛠️' },
  { name: 'Building IKEA furniture', emoji: '🪑' },
  { name: 'Meditating', emoji: '🧘' },
  { name: 'Testing TikTok hacks', emoji: '📱' },
  { name: 'Learning Klingon', emoji: '🛸' },
  { name: 'Saving the galaxy', emoji: '🚀' },
  { name: 'Training a cat (GPT)', emoji: '🐱' },
  { name: 'Making coffee', emoji: '☕' },
  { name: 'Looking for aliens', emoji: '👽' },
  { name: 'Debugging life.exe', emoji: '🐞' }
];

const getRandomProcess = () => {
  const allProcesses = [...realProcesses, ...funProcesses];
  const process = allProcesses[Math.floor(Math.random() * allProcesses.length)];
  return {
    name: `${process.emoji} ${process.name}`,
    pid: Math.floor(Math.random() * 5000) + 1000,
    cpu: Math.random() * 100,
    memory: (Math.random() * 5000).toFixed(2),
    suspicious: Math.random() > 0.85
  };
};

const ProcessList = () => {
  const [processes, setProcesses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setProcesses(prevProcesses => [getRandomProcess(), ...prevProcesses.slice(0, 9)]);
    }, Math.random() * (10000 - 5000) + 5000);

    return () => clearInterval(interval);
  }, []);

  const filteredProcesses = processes.filter(process =>
    process.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-blue-400">PROCESS ANALYSIS</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search processes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-gray-700 text-white px-3 py-1 rounded-lg pl-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="w-4 h-4 absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left border-b border-gray-700">
              <th className="p-2">Process</th>
              <th className="p-2">PID</th>
              <th className="p-2">
                <div className="flex items-center gap-1">
                  <Cpu className="w-4 h-4" />
                  CPU %
                </div>
              </th>
              <th className="p-2">
                <div className="flex items-center gap-1">
                  <HardDrive className="w-4 h-4" />
                  Memory (MB)
                </div>
              </th>
              <th className="p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredProcesses.map((process, i) => (
              <tr 
                key={i}
                className={`border-b border-gray-700 ${
                  process.suspicious ? 'bg-red-900/20 animate-pulse' : ''
                }`}
              >
                <td className="p-2 font-mono">{process.name}</td>
                <td className="p-2">{process.pid}</td>
                <td className={`p-2 ${
                  process.cpu > 80 ? 'text-red-400' :
                  process.cpu > 50 ? 'text-yellow-400' :
                  'text-green-400'
                }`}>
                  {process.cpu.toFixed(1)}%
                </td>
                <td className="p-2">{process.memory}</td>
                <td className="p-2">
                  {process.suspicious ? (
                    <div className="flex items-center gap-2 text-red-400">
                      <AlertCircle className="w-4 h-4 animate-pulse" />
                      SUSPICIOUS
                    </div>
                  ) : (
                    <span className="text-green-400">Normal</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProcessList;
