import React from "react";
import EChart from "./EChart";

type Props = { wind: number; solar: number };

const DonutSources: React.FC<Props> = ({ wind, solar }) => {
    const option = {
        tooltip: { trigger: "item", formatter: "{b}: {c} kWh ({d}%)" },
        legend: { bottom: 0 },
        series: [
            {
                type: "pie",
                radius: ["55%", "80%"],
                avoidLabelOverlap: false,
                itemStyle: { borderRadius: 8, borderColor: "#FFF", borderWidth: 2 },
                label: { show: true, formatter: "{b}\n{d}%",  },
                data: [
                    { value: solar, name: "Zon" },
                    { value: wind, name: "Wind" }
                ],
                color: ["#F99B2A", "#2F6B9A"]
            }
        ]
    };

    return <EChart option={option} style={{ height: 320, width: "100%" }} />;
};

export default DonutSources;
