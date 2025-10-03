import React, { useMemo } from "react";
import EChart from "./EChart";

type Recipient = { name: string; kwh: number };
type Props = {
    recipients?: Recipient[];
    totalDonatedKwh?: number;
    height?: number | string;
};

const DonutRecipients: React.FC<Props> = ({
    recipients,
    totalDonatedKwh = 180,
    height = 300,
}) => {
    const data = useMemo<Recipient[]>(() => {
        if (recipients && recipients.length > 0) return recipients;
        const names = ["Huishoudens", "Buurtcentrum", "Energiebank"];
        const weights = [0.35, 0.25, 0.2, 0.2];
        return names.map((n, i) => ({ name: n, kwh: +(totalDonatedKwh * weights[i]).toFixed(2) }));
    }, [recipients, totalDonatedKwh]);

    const option = useMemo(
        () => ({
            tooltip: { trigger: "item", formatter: "{b}: {c} kWh ({d}%)" },
            legend: { bottom: 0 },
            series: [
                {
                    type: "pie",
                    radius: ["55%", "80%"],
                    avoidLabelOverlap: false,
                    itemStyle: { borderRadius: 8, borderColor: "#FFF", borderWidth: 2 },
                    label: { show: true, formatter: "{b}\n{d}%" },
                    data: data.map(d => ({ value: d.kwh, name: d.name })),
                },
            ],
        }),
        [data]
    );

    return (
        <div className="chart-card">
            <div className="chart-card__head">
                <h3>Bestemming van je stroom</h3>
                <p>Verdeling van gedeelde kWh</p>
            </div>
            <EChart option={option} style={{ height, width: "100%" }} />
        </div>
    );
};

export default DonutRecipients;
