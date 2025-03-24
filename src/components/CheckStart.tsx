import React, { useState, useEffect } from 'react';

type CustomAlertProps = {
  message: string;
  onClose: () => void;
  position: { top: string; left: string };
};

const CustomAlert: React.FC<CustomAlertProps> = ({ message, onClose, position }) => {
  const alertStyle: React.CSSProperties = {
    position: 'fixed',
    top: position.top,
    left: position.left,
    zIndex: 40,
  };

  return (
    <div className="bg-blue-900 bg-opacity-90 flex justify-center items-center rounded-lg" style={alertStyle}>
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg border-4 border-gray-700/50">
        <div className="text-red-500 text-lg mb-4 font-bold uppercase">{message}</div>
        <button
          className="bg-gray-700/50 text-green-500 font-bold px-4 py-2 rounded hover:bg-green-600 transition-colors"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

const CheckStart: React.FC = () => {
  const [showAlert, setShowAlert] = useState<{ message: string; position: { top: string; left: string } } | null>(null);
  const [alertIndex, setAlertIndex] = useState(0);
  const [isPopupActive, setIsPopupActive] = useState(false);
  const [isFirstAlertTriggered, setIsFirstAlertTriggered] = useState(false);

  const getRandomPosition = () => ({
    top: `${Math.floor(Math.random() * 70)}%`,
    left: `${Math.floor(Math.random() * 80)}%`,
  });

  const alerts = [
    { message: 'Did you close the door ?', position: getRandomPosition() },
    { message: 'Did you leave the baking tray on ?', position: getRandomPosition() },
    { message: 'I hear something, is your shower running ?', position: getRandomPosition() },
    { message: 'Did you take your Vitamin C today?', position: getRandomPosition() },
    { message: 'BEWARE OF THE FLU !!!', position: getRandomPosition() },
  ];

  function getRandomDelay(minSeconds = 5, maxSeconds = 30): number {
    return Math.floor(Math.random() * (maxSeconds - minSeconds + 1) + minSeconds) * 1000;
  }

  useEffect(() => {
    // Délai de 8 secondes pour la première alerte
    if (!isFirstAlertTriggered) {
      const firstTimeout = setTimeout(() => {
        setShowAlert(alerts[0]);
        setIsPopupActive(true);
        setIsFirstAlertTriggered(true);
      }, 8000);

      return () => clearTimeout(firstTimeout);
    }

    // Pour les alertes suivantes, délai aléatoire
    if (isFirstAlertTriggered) {
      const timeoutId = setTimeout(() => {
        setShowAlert(alerts[alertIndex]);
        setIsPopupActive(true);
      }, getRandomDelay());

      return () => clearTimeout(timeoutId);
    }
  }, [alertIndex, isFirstAlertTriggered]);

  const handleCloseAlert = () => {
    setShowAlert(null);
    setIsPopupActive(false);

    setTimeout(() => {
      setAlertIndex(prevIndex => (prevIndex + 1) % alerts.length);
    }, getRandomDelay());
  };

  return (
    <div>
      {isPopupActive && <div className="fixed inset-0 bg-black opacity-50 z-30"></div>}

      {showAlert && (
        <CustomAlert message={showAlert.message} onClose={handleCloseAlert} position={showAlert.position} />
      )}
    </div>
  );
};

export default CheckStart;
