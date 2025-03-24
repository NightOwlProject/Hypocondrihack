import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import isDev from 'electron-is-dev';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.loadURL(
    isDev
      ? 'http://localhost:5173'
      : `file://${path.join(__dirname, '../dist/index.html')}`
  );

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }
};

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

let monitoringInterval;

// Liste des processus système normaux
const SYSTEM_PROCESSES = [
  { name: "System", baseCpu: 0.1, baseMemory: 50 },
  { name: "svchost.exe", baseCpu: 0.5, baseMemory: 80 },
  { name: "explorer.exe", baseCpu: 1, baseMemory: 120 },
  { name: "chrome.exe", baseCpu: 5, baseMemory: 250 },
  { name: "firefox.exe", baseCpu: 4, baseMemory: 200 },
  { name: "node.exe", baseCpu: 2, baseMemory: 150 },
  { name: "code.exe", baseCpu: 3, baseMemory: 300 }
];

// Liste des processus suspects
const SUSPICIOUS_PROCESSES = [
  { name: "cryptominer.exe", baseCpu: 90, baseMemory: 800 },
  { name: "keylogger_service", baseCpu: 15, baseMemory: 100 },
  { name: "backdoor_agent", baseCpu: 20, baseMemory: 150 },
  { name: "data_exfiltrator", baseCpu: 40, baseMemory: 300 },
  { name: "ransomware_encrypt", baseCpu: 70, baseMemory: 500 },
  { name: "network_sniffer", baseCpu: 30, baseMemory: 200 },
  { name: "rootkit_handler", baseCpu: 25, baseMemory: 180 },
  { name: "memory_scraper", baseCpu: 45, baseMemory: 400 },
  { name: "process_hollowing", baseCpu: 35, baseMemory: 250 },
  { name: "dll_injector", baseCpu: 20, baseMemory: 150 }
];

// Fonction pour générer une valeur aléatoire avec une tendance
const generateTrendValue = (currentValue, min, max, volatility) => {
  const trend = Math.random() > 0.5 ? 1 : -1;
  const change = (Math.random() * volatility) * trend;
  return Math.max(min, Math.min(max, currentValue + change));
};

// Fonction pour simuler des pics de charge
const simulateSpike = (baseValue, chance = 0.05, intensity = 1.5) => {
  if (Math.random() < chance) {
    return Math.min(200, baseValue * intensity);
  }
  return baseValue;
};

const startMonitoring = () => {
  let cpuTrend = 50;
  let memTrend = 60;
  let tempTrend = 45;
  
  let spikeMode = false;
  let spikeDuration = 0;

  // État des processus
  let activeProcesses = [...SYSTEM_PROCESSES].map(proc => ({
    ...proc,
    pid: Math.floor(Math.random() * 9000) + 1000,
    cpu: proc.baseCpu,
    memory: proc.baseMemory
  }));

  // Intervalle pour l'ajout/suppression de processus suspects
  setInterval(() => {
    if (Math.random() < 0.2) { // 20% de chance d'ajouter un processus suspect
      const suspiciousProc = SUSPICIOUS_PROCESSES[Math.floor(Math.random() * SUSPICIOUS_PROCESSES.length)];
      activeProcesses.push({
        ...suspiciousProc,
        pid: Math.floor(Math.random() * 9000) + 1000,
        cpu: suspiciousProc.baseCpu,
        memory: suspiciousProc.baseMemory,
        suspicious: true
      });
    }

    // Limiter le nombre de processus
    if (activeProcesses.length > 12) {
      activeProcesses = activeProcesses.slice(0, 12);
    }
  }, 5000);

  monitoringInterval = setInterval(() => {
    try {
      // Gestion du mode pic
      if (spikeDuration > 0) {
        spikeDuration--;
      } else if (Math.random() < 0.02) {
        spikeMode = true;
        spikeDuration = Math.floor(Math.random() * 10) + 5;
      } else {
        spikeMode = false;
      }

      // Mise à jour des processus
      activeProcesses = activeProcesses.map(proc => {
        const isSuspicious = proc.suspicious || false;
        const baseValue = isSuspicious ? proc.baseCpu : proc.baseCpu;
        const volatility = isSuspicious ? 15 : 5;
        
        return {
          ...proc,
          cpu: simulateSpike(generateTrendValue(proc.cpu, baseValue * 0.5, baseValue * 2, volatility)),
          memory: generateTrendValue(proc.memory, proc.baseMemory * 0.8, proc.baseMemory * 1.2, 10),
          suspicious: isSuspicious
        };
      });

      // Simulation CPU avec tendance et pics
      cpuTrend = generateTrendValue(cpuTrend, 20, spikeMode ? 200 : 150, spikeMode ? 20 : 10);
      const cpuValue = simulateSpike(cpuTrend, 0.1, 1.8);

      // Simulation mémoire
      memTrend = generateTrendValue(memTrend, 40, spikeMode ? 180 : 150, spikeMode ? 15 : 8);
      const memValue = simulateSpike(memTrend, 0.08, 1.5);

      // Simulation température
      const targetTemp = 40 + (cpuValue / 200) * 80;
      tempTrend = generateTrendValue(tempTrend, 35, spikeMode ? 100 : 90, spikeMode ? 8 : 4);
      tempTrend += (targetTemp - tempTrend) * 0.1;
      const tempValue = simulateSpike(tempTrend, 0.05, 1.3);

      // Envoi des données au frontend
      mainWindow.webContents.send('system-stats', {
        cpu: {
          load: Math.round(cpuValue),
          temp: Math.round(tempValue)
        },
        memory: {
          used: Math.round(memValue),
          total: 32 * 1024
        },
        processes: activeProcesses.map(proc => ({
          name: proc.name,
          pid: proc.pid,
          cpu: Math.round(proc.cpu * 10) / 10,
          memory: Math.round(proc.memory),
          suspicious: proc.suspicious || false
        }))
      });
    } catch (error) {
      console.error('Erreur lors de la simulation des métriques:', error);
    }
  }, 1000);
};

ipcMain.on('start-monitoring', () => {
  startMonitoring();
});

ipcMain.on('stop-monitoring', () => {
  if (monitoringInterval) {
    clearInterval(monitoringInterval);
  }
});