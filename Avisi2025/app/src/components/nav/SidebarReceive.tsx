import React from "react";
import { NavLink } from "react-router-dom";
import "../../assets/scss/components/nav/Sidebar.scss";

const SidebarReceive: React.FC = () => {
    return (
        <aside className="sidebar">
            <div className="logo">
                <span className="logo-text">
                    Watt<i className="fa-solid fa-bolt"></i>Share
                </span>
            </div>

            <div className="sidenav-options">
                <NavLink
                    to="/ontvangen/dashboard/overzicht"
                    className={({ isActive }) =>
                        `sidenav-item ${isActive ? "sidenav-selected" : ""}`
                    }
                >
                    <i className="fa-solid fa-chart-line"></i>
                    <span>Overzicht</span>
                </NavLink>

                <NavLink
                    to="/ontvangen/dashboard/matches"
                    className={({ isActive }) =>
                        `sidenav-item ${isActive ? "sidenav-selected" : ""}`
                    }
                >
                    <i className="fa-solid fa-user-group"></i>
                    <span>Matches</span>
                </NavLink>

                <NavLink
                    to="/ontvangen/dashboard/transacties"
                    className={({ isActive }) =>
                        `sidenav-item ${isActive ? "sidenav-selected" : ""}`
                    }
                >
                    <i className="fa-solid fa-money-bills"></i>
                    <span>Transacties</span>
                </NavLink>
            </div>
        </aside>
    );
};

export default SidebarReceive;
