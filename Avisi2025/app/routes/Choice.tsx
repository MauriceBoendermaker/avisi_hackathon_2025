import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import "../src/assets/scss/ChoiceRG.scss";


const WattShareChoice: React.FC = () => {
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const navigate = useNavigate();

  const toggleDarkMode = (): void => {
    setDarkMode(!darkMode);
  };

  const handleDonateEnergy = (): void => {
    // Navigate to donate energy page
    navigate('/donate');
  };

  const handleReceiveEnergy = (): void => {
    // Navigate to receive energy page
    navigate('/receive');
  };



  return (
    <div className={`wattshare-choice ${darkMode ? 'dark-mode' : ''}`}>
      <button className="dark-mode-toggle" onClick={toggleDarkMode}>
        {darkMode ? '☀️ Lichte modus' : '🌙 Donkere modus'}
      </button>
      <section className="choice-container">
        <div className="container">
          <div className="choice-header">
            <div className="choice-logo">⚡</div>
            <h1 className="choice-title">Maak je keuze</h1>
            <p className="choice-subtitle">
              Kies hoe je wilt deelnemen aan het WattShare netwerk en begin met energie delen
            </p>
          </div>

          <div className="choice-cards-wrapper">
            {/* Donate Energy Card */}
            <div className="choice-card" onClick={handleDonateEnergy}>
              <div className="choice-icon">
                <span>🎁</span>
              </div>
              <h2 className="choice-card-title">Ik wil energie schenken</h2>
            </div>

            {/* Receive Energy Card */}
            <div className="choice-card" onClick={handleReceiveEnergy}>
              <div className="choice-icon">
                <span>🔋</span>
              </div>
              <h2 className="choice-card-title">Ik wil energie ontvangen</h2>
            </div>
          </div>

          <div className="back-link">
            <a href="/">← Terug naar home</a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WattShareChoice;