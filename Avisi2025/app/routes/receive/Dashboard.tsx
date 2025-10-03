import React from "react";
import LayoutReceive from "../../src/layouts/LayoutReceive";
import KpiCard from "../../src/components/KpiCard";
import CoverageGrid from "../../src/components/CoverageGrid";
import { useEffect, useState } from 'react';



const DashboardReceive: React.FC = () => {

    const [verbruik, setVerbruik] = useState<number | string | null>(null);

    useEffect(() => {
        fetch('http://localhost:8002/api/v1/api/totaal/1persoon')
            .then(res => res.json())
            .then(data => setVerbruik(data.totaal_verbruik_kwh))
            .catch(() => setVerbruik('Error'));
    }, []);

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

    return (
        <LayoutReceive>
            <div className="matches-head">
                <h2>Welkom terug, Alex!</h2>
            </div>
            <div className="row mb-4">
                <div className="col-md-4">
                    <KpiCard title="Totaal verbruik (jaar)" value={`${formatKwh(verbruik)} kWh`} change="-15%" changeType="down" />
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
