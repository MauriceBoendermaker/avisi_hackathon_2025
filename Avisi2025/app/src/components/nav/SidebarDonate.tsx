import React from "react";
import { NavLink } from "react-router-dom";
import "../../assets/scss/components/nav/Sidebar.scss";

const SidebarDonate: React.FC = () => {
    return (
        <aside className="sidebar">
            <div className="logo">
                <span className="logo-text">
                    Watt<i className="fa-solid fa-bolt"></i>Share
                </span>
            </div>

            <div className="sidenav-options">
                <NavLink
                    to="/doneren/dashboard/overzicht"
                    className={({ isActive }) =>
                        `sidenav-item ${isActive ? "sidenav-selected" : ""}`
                    }
                >
                    <i className="fa-solid fa-chart-line"></i>
                    <span>Overzicht</span>
                </NavLink>

                <NavLink
                    to="/doneren/dashboard/bestemming"
                    className={({ isActive }) =>
                        `sidenav-item ${isActive ? "sidenav-selected" : ""}`
                    }
                >
                    <i className="fa-solid fa-map-pin"></i>
                    <span>Bestemming</span>
                </NavLink>
            </div>
        </aside>
    );
};

export default SidebarDonate;
