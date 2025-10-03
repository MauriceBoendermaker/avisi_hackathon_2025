import React, { useMemo } from "react";
import EChart from "./EChart";

type Props = {
    sharedKwh?: number;
    effectiveKwh?: number;
    height?: number | string;
    decimals?: number;
};

const UtilizationKPI: React.FC<Props> = ({
    sharedKwh = 120,
    effectiveKwh = 84,
    height = 220,
    decimals = 0,
}) => {
    const pct = useMemo(() => {
        const v = sharedKwh <= 0 ? 0 : (effectiveKwh / sharedKwh) * 100;
        return Math.max(0, Math.min(100, +v.toFixed(decimals)));
    }, [sharedKwh, effectiveKwh, decimals]);

    const option = useMemo(
        () => ({
            series: [
                {
                    type: "gauge",
                    startAngle: 220,
                    endAngle: -40,
                    min: 0,
                    max: 100,
                    splitNumber: 5,
                    progress: { show: true, roundCap: true },
                    axisLine: { lineStyle: { width: 16 } },
                    axisTick: { show: false },
                    splitLine: { show: false },
                    axisLabel: { show: false },
                    pointer: { show: false },
                    detail: {
                        valueAnimation: true,
                        formatter: `{value}%`,
                        fontSize: 28,
                        offsetCenter: [0, "10%"],
                    },
                    data: [{ value: pct, name: "Utilization rate" }],
                    title: { show: true, fontSize: 12, offsetCenter: [0, "60%"] },
                },
            ],
            tooltip: { show: true, formatter: `Effectief/ge-deeld: ${pct}%` },
        }),
        [pct]
    );

    return (
        <div className="chart-card">
            <div className="chart-card__head">
                <h3>Utilization rate</h3>
                <p>Effectief ÷ Gedeeld</p>
            </div>
            <EChart option={option} style={{ height, width: "100%" }} />
        </div>
    );
};

export default UtilizationKPI;
