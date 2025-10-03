import React from "react";
import LayoutReceive from "../../src/layouts/LayoutReceive";
import KpiCard from "../../src/components/KpiCard";
import CoverageGrid from "../../src/components/CoverageGrid";

const DashboardReceive: React.FC = () => {
    return (
        <LayoutReceive>
            <div className="matches-head">
                <h2>Welkom terug, Alex!</h2>
            </div>
            <div className="row mb-4">
                <div className="col-md-4">
                    <KpiCard title="Totaal verbruik (jaar)" value="42069 kWh" change="-15%" changeType="down" />
                </div>
                <div className="col-md-4">
                    <KpiCard title="Totaal ontvangen" value="21 kWh" change="+22%" changeType="up" />
                </div>
                <div className="col-md-4">
                    <KpiCard title="Totaal bespaard" value="€420" change="+€2" changeType="up" />
                </div>
            </div>
            <CoverageGrid />
        </LayoutReceive>
    );
};

export default DashboardReceive;
