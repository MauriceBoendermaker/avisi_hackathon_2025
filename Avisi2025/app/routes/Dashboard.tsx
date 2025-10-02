import React from "react";
import Navbar from "../src/components/nav/Navbar";
import Sidebar from "../src/components/nav/Sidebar";

const Dashboard: React.FC = () => {
    return (
        <div style={{ display: "flex" }}>
            <Sidebar />
            <div style={{ flex: 1 }}>
                <Navbar />
                <main style={{ padding: "20px" }}>
                    <h2>Welkom terug, Alex!</h2>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;
