import React from "react";
import "../../assets/scss/components/nav/Navbar.scss";

const Navbar: React.FC = () => {
  return (
    <nav>
        <div className="container-fluid">
            <div className="row">
                <div className="col-10">
                    <div className="searchbar">
                        <i className="fa-solid fa-magnifying-glass"></i>
                        <input type="text" placeholder="Begin met zoeken..." />
                    </div>
                </div>
            </div>
        </div>
    </nav>
  );
};

export default Navbar;
