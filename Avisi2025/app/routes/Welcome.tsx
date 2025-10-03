import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import "../src/assets/scss/Welkom.scss";
import { useNavigate } from 'react-router-dom';


const WattShareWelcome = () => {
  const [verbruik, setVerbruik] = useState<number | string | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [helpBoxOpen, setHelpBoxOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'faq' | 'contact' | 'guide'>('faq');

  useEffect(() => {
    fetch('http://localhost:8002/api/v1/api/totaal/allepersonen')
      .then(res => res.json())
      .then(data => setVerbruik(data.totaal_verbruik_kwh))
      .catch(() => setVerbruik('Error'));
  }, []);

  const toggleDarkMode = () => setDarkMode(!darkMode);
  const toggleHelpBox = () => setHelpBoxOpen(!helpBoxOpen);

  const navigate = useNavigate();
  const handleGetStarted = (): void => {
    navigate('/Choice');
  };

  // Format kWh value professionally with thousand separators
  const formatKwh = (value: number | string | null): string => {
    if (value === null) return 'Laden...';
    if (value === 'Error') return 'Fout bij laden';
    
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    
    if (isNaN(numValue)) return 'Geen data';
    
    // Format with thousand separators and 2 decimal places
    return new Intl.NumberFormat('nl-NL', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(numValue);
  };

  const formatCost = (value: number | string | null): string => {
    if (value === null) return '...';
    if (value === 'Error') return 'Fout';
  
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
    if (isNaN(numValue)) return '-';
  
    const cost = numValue * 0.11;
  
    return new Intl.NumberFormat('nl-NL', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(cost);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'faq':
        return (
          <div className="help-content">
            <h4>Veelgestelde vragen</h4>
            <div className="help-item">
              <strong>Hoe werkt WattShare?</strong>
              <p>WattShare verbindt huishoudens om overtollige zonne-energie te delen met buren die het nodig hebben.</p>
            </div>
            <div className="help-item">
              <strong>Wat zijn de kosten?</strong>
              <p>Het platform is gratis te gebruiken. Je betaalt alleen voor de energie die je verbruikt.</p>
            </div>
            <div className="help-item">
              <strong>Hoe begin ik?</strong>
              <p>Klik op "Aan de slag" en begin met delen.</p>
            </div>
          </div>
        );
      case 'contact':
        return (
          <div className="help-content">
            <h4>Contact</h4>
            <div className="help-item">
              <strong>📧 Email</strong>
              <p>DummyData</p>
            </div>
            <div className="help-item">
              <strong>📞 Telefoon</strong>
              <p>DummyData</p>
            </div>
            <div className="help-item">
              <strong>💬 Chat</strong>
              <p>DummyData</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={`wattshare-welcome ${darkMode ? 'dark-mode' : ''}`}>
      <button className="dark-mode-toggle" onClick={toggleDarkMode}>
        {darkMode ? '☀️ Lichte modus' : '🌙 Donkere modus'}
      </button>

      {/* Help Box Widget */}
      <div className={`help-box ${helpBoxOpen ? 'open' : ''}`}>
        <button className="help-toggle" onClick={toggleHelpBox}>
          {helpBoxOpen ? '✕' : '❓'}
        </button>
        
        {helpBoxOpen && (
          <div className="help-box-content">
            <div className="help-tabs">
              <button 
                className={`help-tab ${activeTab === 'faq' ? 'active' : ''}`}
                onClick={() => setActiveTab('faq')}
              >
                FAQ
              </button>
              <button 
                className={`help-tab ${activeTab === 'contact' ? 'active' : ''}`}
                onClick={() => setActiveTab('contact')}
              >
                Contact
              </button>
            </div>
            {renderTabContent()}
          </div>
        )}
      </div>
       
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="hero-title">Welkom bij WattShare?</h1>
              <p className="hero-subtitle">
                Deel energie met je gemeenschap. Bespaar geld. Bouw samen aan een duurzame toekomst.
              </p>
              <div className="d-flex flex-wrap">
                <button className="btn btn-custom-white" onClick={handleGetStarted}>Aan de slag</button>
              </div>
            </div>
            <div className="col-lg-6 text-center">
              <div className="energy-icon" style={{ fontSize: '15rem', opacity: 0.9 }}>
                ⚡
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="feature-section">
        <div className="container">
          <h2 className="section-title">Hoe WattShare werkt?</h2>
          <p className="section-subtitle">
            Huishoudens verbinden om een slimmer, efficiënter energienetwerk te creëren
          </p>
          
          <div className="row g-4">
            <div className="col-md-4">
              <div className="feature-card">
                <div className="feature-icon">
                  <span>🔌</span>
                </div>
                <h3 className="feature-title">Energie overzicht</h3>
                <p className="feature-description">
                  Volg je energieproductie en -verbruik in real-time met een Dashboard.
                </p>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="feature-card">
                <div className="feature-icon">
                  <span>🤝</span>
                </div>
                <h3 className="feature-title">Deel energie</h3>
                <p className="feature-description">
                  Overtollige zonne-energie? Deel het met buren die het nodig hebben. Ontvang een beloning voor je bijdrage aan de gemeenschap.
                </p>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="feature-card">
                <div className="feature-icon">
                  <span>💰</span>
                </div>
                <h3 className="feature-title">Bespaar geld</h3>
                <p className="feature-description">
                  Verlaag je energierekening door toegang tot gedeelde hernieuwbare energie tegen betere tarieven dan traditionele bronnen.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="row">
            <div className="col-md-4">
              <div className="stat-card">
                <div className="stat-number">≈ <br></br>100+</div>
                <div className="stat-label">Verbonden huishoudens</div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="stat-card">
                <div className="stat-number">{formatKwh(verbruik)} kWh</div>
                <div className="stat-label">Totaal gedeelde energie over huishoudens</div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="stat-card">
                <div className="stat-number">≈ €{formatCost(verbruik)}</div>
                <div className="stat-label">Totale financiële impact</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <h2 className="cta-title">Klaar om lid te worden van WattShare?</h2>
          <p className="cta-description">
            Begin vandaag nog met het delen van energie met je gemeenschap en word onderdeel van de hernieuwbare energie revolutie.
          </p>
          <button className="btn btn-cta" onClick={handleGetStarted}>Meld je nu aan</button>
        </div>
      </section>
    </div>
  );
};

export default WattShareWelcome;