import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import "../src/assets/scss/ChoiceRG.scss";
import { useNavigate } from "react-router";

function AppContent() {
  const navigate = useNavigate();

  return (
    <div className="d-flex flex-column justify-content-between align-items-center vh-100 bg-light text-center py-5">
      {/* Top Section */}
      <div className="flex-grow-1 d-flex flex-column justify-content-end">
        <h2 className="fw-bold text-secondary mb-4">I want to...</h2>
      </div>

      {/* Button Section */}
      <div className="my-3">
        <button
          className="btn btn-lg text-white mx-3 shadow custom-btn"
          onClick={() => navigate("/receiver")}
        >
          Receive
        </button>
        <button
          className="btn btn-lg text-white mx-3 shadow custom-btn"
          onClick={() => navigate("/gifter")}
        >
          Gift
        </button>
      </div>

      {/* Bottom Section */}
      <div className="flex-grow-1 d-flex flex-column justify-content-start">
        <h2 className="fw-bold text-secondary mt-4">Energy</h2>
      </div>
    </div>
  );
}

export default AppContent;
