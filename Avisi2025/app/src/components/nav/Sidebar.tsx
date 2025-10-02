import React from "react";
import "../../assets/scss/components/nav/Sidebar.scss";

const Sidebar: React.FC = () => {
    return (
        <aside className="sidebar">
            <div className="logo">
                <span className="logo-text">
                    Watt<i className="fa-solid fa-bolt"></i>Share
                </span>
            </div>
            <div className="sidenav-options">
                <div className="sidenav-selected">
                    <i className="fa-solid fa-chart-line"></i>Overzicht
                </div>
                <div className="">
                    <i className="fa-solid fa-user-group"></i>Matches
                </div>
                <div className="">
                    <i className="fa-solid fa-money-bills"></i>Transacties
                </div>
                <div className="">
                    <i className="fa-solid fa-gear"></i>Instellingen
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
