import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Cpu, Thermometer, MemoryStick as Memory } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    duration: 0
  },
  interaction: {
    intersect: false,
    mode: 'index' as const,
  },
  scales: {
    y: {
      beginAtZero: true,
      max: 100,
      grid: {
        color: 'rgba(255, 255, 255, 0.1)'
      },
      ticks: {
        color: 'rgba(255, 255, 255, 0.7)',
        callback: (value: number) => `${value}%`
      }
    },
    x: {
      grid: {
        color: 'rgba(255, 255, 255, 0.1)'
      },
      ticks: {
        color: 'rgba(255, 255, 255, 0.7)',
        maxRotation: 0
      }
    }
  },
  plugins: {
    legend: {
      position: 'top' as const,
      labels: {
        color: 'rgba(255, 255, 255, 0.7)'
      }
    }
  },
};

const generateRandomValue = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
};

const getFunnyComment = (cpu: number, memory: number, temp: number) => {
  if (temp > 60) return '🌡️ Did you plan for AC, or is this a sauna?';
  if (cpu < 20) return '🐢 You\'re slower than a turtle with a walker!';
  if (cpu > 90) return '⚡ Calm down, this ain\'t a Formula 1 race!';
  if (memory > 80) return '🔥 Burnout alert... Too many tabs open?';
  if (memory < 30) return '🧠 Uh-oh... memory loss or early Alzheimer\'s?';
  return '💻 All systems go, Captain!';
};

const SystemMonitor = () => {
  const [currentStats, setCurrentStats] = useState({
    cpu: 0,
    memory: 0,
    temp: 0
  });
  const [funnyComment, setFunnyComment] = useState('💻 All systems go, Captain!');

  const [data, setData] = useState({
    labels: Array(30).fill('').map((_, i) => `${29 - i}s`),
    datasets: [
      {
        label: 'CPU Usage',
        data: Array(30).fill(0),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Memory Usage',
        data: Array(30).fill(0),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Temperature',
        data: Array(30).fill(0),
        borderColor: 'rgb(255, 159, 64)',
        backgroundColor: 'rgba(255, 159, 64, 0.2)',
        tension: 0.4,
        fill: true
      }
    ]
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const newCpu = generateRandomValue(10, 100);
      const newMemory = generateRandomValue(30, 90);
      const newTemp = generateRandomValue(30, 90);

      setCurrentStats({ cpu: newCpu, memory: newMemory, temp: newTemp });

      setData(prev => ({
        labels: prev.labels,
        datasets: [
          {
            ...prev.datasets[0],
            data: [...prev.datasets[0].data.slice(1), newCpu]
          },
          {
            ...prev.datasets[1],
            data: [...prev.datasets[1].data.slice(1), newMemory]
          },
          {
            ...prev.datasets[2],
            data: [...prev.datasets[2].data.slice(1), newTemp]
          }
        ]
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const commentInterval = setInterval(() => {
      setFunnyComment(getFunnyComment(
        generateRandomValue(10, 100),
        generateRandomValue(30, 90),
        generateRandomValue(30, 90)
      ));
    }, 5000); // Mise à jour toutes les 5 secondes

    return () => clearInterval(commentInterval);
  }, []);

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-blue-400">SYSTEM VITALS</h2>
      </div>

      <div className="h-64">
        <Line options={options} data={data} />
      </div>
      
      <div className="mt-4 text-center text-lg font-bold text-yellow-400">
        {funnyComment}
      </div>
    </div>
  );
};

export default SystemMonitor;
