import React from "react";
import LayoutDonate from "../../src/layouts/LayoutDonate";
import FinancialImpactWaterfall from "../../src/components/FinancialImpactWaterfall";
import StackedDonationTrend from "../../src/components/charts/StackedDonationTrend";


const DashboardDonate: React.FC = () => {
    return (
        <LayoutDonate>
            <div className="matches-head">
                <h2>Welkom terug, donateur!</h2>
            </div>

            <div
                style={{
                    display: "grid",
                    gap: "20px",
                    gridTemplateColumns: "1fr",
                }}
            >
                <FinancialImpactWaterfall />
                <StackedDonationTrend />
            </div>
        </LayoutDonate>
    );
};

export default DashboardDonate;
