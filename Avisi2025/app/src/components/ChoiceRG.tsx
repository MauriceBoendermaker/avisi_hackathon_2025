import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export function ChoiceRG() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/choice");
  };

  return (
    <div className="welcome-container d-flex justify-content-center align-items-center">
      <video autoPlay loop muted playsInline className="background-video">
        <source src="/your-background-video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="overlay text-center p-4 rounded">
        <h1 className="display-4 fw-bold mb-4">Welcome</h1>
        <button 
          className="btn btn-lg custom-btn"
          onClick={handleClick}
        >
          Go Share Your Watt ⚡
        </button>
      </div>
    </div>
  );
}
