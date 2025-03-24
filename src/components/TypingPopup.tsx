import React, { useState, useEffect, useRef } from "react";
import Popup from 'reactjs-popup';

interface TypingPopupProps {
  onComplete: () => void;
}

const TypingPopup: React.FC<TypingPopupProps> = ({ onComplete }) => {
  const [inputText, setInputText] = useState("");
  const [timeLeft, setTimeLeft] = useState(10);
  const [showRetry, setShowRetry] = useState(false);
  const [difficulty, setDifficulty] = useState(7); // Starting difficulty level
  const [targetText, setTargetText] = useState(captcha(difficulty)); // Initial captcha with difficulty
  const [message, setMessage] = useState(generateFailMessage());
  
  const timerRef = useRef<NodeJS.Timeout | null>(null); // Store the timer ID

  // Timer logic
  useEffect(() => {
    if (timeLeft > 0) {
      timerRef.current = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else {
      setShowRetry(true);
    }

    // Cleanup the timer when the component unmounts or when the captcha is completed
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [timeLeft]);

  // Update message when showRetry changes
  useEffect(() => {
    if (showRetry) {
      setMessage(generateFailMessage());
    }
  }, [showRetry]);

  const handleRetry = () => {
    setInputText("");
    setTimeLeft(10);
    setDifficulty(difficulty + 1); // Increase difficulty
    setTargetText(captcha(difficulty + 1)); // Regenerate captcha with increased difficulty
    setShowRetry(false); // Close the retry popup
  };

  const handleSubmit = () => {
    if (inputText === targetText && timeLeft > 0) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      const element = document.getElementById("Captcha");
      if (element) {
        element.style.display = "none";
      }
    }
  };

  return (
    <div
      id="Captcha"
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50"
    >
      
      <div
        className="bg-gray-900 p-0 rounded shadow-lg text-center w-[50%] h-auto border-4 border-gray-700/50" // Largeur à 70%, hauteur automatique
      >
        <p className="text-lg mb-2 bg-gray-700/50 w-[100%] h-auto p-0">Human Tester - Certified by ChatGPT</p>
        <h2 className="text-lg text-red-500 font-bold mb-2">Are you a Robot ?</h2>

        <div className="text-2xl font-bold text-green-500 mb-4 pb-6">
           Type this text : 
           {targetText}
        </div>

        <p className="text-red-500 mb-2 font-bold">Time Left: {timeLeft} seconds</p>

        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && inputText === targetText) {
              handleSubmit();
            }
          }}
          className="border p-2 mt-2 text-green-500 w-80%" 
          placeholder="Write the hereabove text"
        />

        <br />
        <br />

        {inputText === targetText && (
          <button
            className="mt-3 bg-gray-700 text-white p-2 rounded m-4"
            onClick={handleSubmit}
          >
            Submit
          </button>
          
        )}
        <br />

        <Popup
          open={showRetry}
          modal
          closeOnDocumentClick // Allow clicking outside the popup to close it
          onClose={() => setShowRetry(false)}
          overlayStyle={{ background: "rgba(0, 0, 0, 0.87)" }} // Black background with 75% opacity
           // Close the popup and reset showRetry
        >
          <div id="popup" className="p-4 text-center bg-gray-900 border-4 border-red-500 rounded">
            <h3 className="text-lg font-bold text-red-500 mb-2"> {message}</h3>
            <p> Beware it gats harder </p>
            <button
              className="mt-3 bg-red-500 text-white p-2 font-bold rounded"
              onClick={handleRetry}
            >
              Retry
            </button>
          </div>
        </Popup>
      </div>
    </div>
  );
};

export default TypingPopup;

// Generate a random captcha based on difficulty
function captcha(difficulty: number) {
  const char = "mnuv";
  let clé = "";
  for (let i = 0; i < difficulty; i++) {
    clé += char.charAt(Math.floor(Math.random() * char.length));
  }
  return clé;
}

// Generate a random fail message
function generateFailMessage() {
  const failMessage = [
    "Are you you ?",
    "Did you think it would be this easy",
    "Is it an attack...",
    "A Robot could have done that",
    "Are you the guy from the film ?",
  ];
  let i = Math.floor(Math.random() * failMessage.length);
  return failMessage[i];
}