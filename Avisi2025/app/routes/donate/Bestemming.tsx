import React from "react";
import LayoutDonate from "../../src/layouts/LayoutDonate";
import DonutRecipients from "../../src/components/charts/DonutRecipients";
import EffectivenessHeatmap from "../../src/components/charts/EffectivenessHeatmap";
import TopRecipientsTable from "../../src/components/tables/TopRecipientsTable";

const Transactions: React.FC = () => {
    const recipients = [
        { recipient_id: 1, name: "Huishoudens", kwh: 62 },
        { recipient_id: 2, name: "Buurtcentrum", kwh: 38 },
        { recipient_id: 3, name: "Energiebank", kwh: 32 },
    ];

    return (
        <LayoutDonate>
            <div className="matches-head">
                <h2>Waar gaat je stroom heen?</h2>
            </div>

            <div style={{ display: "grid", gap: 20, gridTemplateColumns: "1fr 1fr" }}>
                <DonutRecipients recipients={recipients} />
                <EffectivenessHeatmap />
            </div>

            <div style={{ marginTop: 20 }}>
                <TopRecipientsTable recipients={recipients} />
            </div>
        </LayoutDonate>
    );
};

export default Transactions;
