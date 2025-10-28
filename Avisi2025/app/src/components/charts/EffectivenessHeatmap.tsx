import React, { useMemo } from "react";
import EChart from "./EChart";

type Props = {
    months?: string[];
    hours?: number[];
    ratios?: number[][];
    height?: number | string;
};

const EffectivenessHeatmap: React.FC<Props> = ({
    months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"],
    hours = Array.from({ length: 24 }, (_, i) => i),
    ratios,
    height = 380,
}) => {
    const matrix = useMemo(() => {
        if (ratios && ratios.length) return ratios;
        const base: number[][] = [];
        for (let m = 0; m < months.length; m++) {
            const row: number[] = [];
            for (let h = 0; h < hours.length; h++) {
                const solarFactor = Math.max(0, Math.sin(((h - 6) / 24) * Math.PI * 2));
                const seasonal = 0.5 + 0.4 * Math.sin(((m + 1) / 12) * Math.PI * 2);
                const val = Math.min(1, Math.max(0, 0.4 + 0.4 * solarFactor + 0.2 * seasonal));
                row.push(+val.toFixed(2));
            }
            base.push(row);
        }
        return base;
    }, [ratios, months.length, hours.length]);

    const heatData = useMemo(
        () =>
            matrix.flatMap((row, mi) =>
                row.map((v, hi) => [hi, mi, Math.round(v * 100)])
            ),
        [matrix]
    );

    const option = useMemo(
        () => ({
            tooltip: {
                position: "top",
                formatter: (p: any) => {
                    const h = hours[p.data[0]];
                    const m = months[p.data[1]];
                    return `${m} ${h}:00<br/>Effectief/gedeeld: ${p.data[2]}%`;
                },
            },
            grid: { left: 60, right: 20, top: 40, bottom: 40 },
            xAxis: {
                type: "category",
                data: hours.map(h => `${h}:00`),
                splitArea: { show: true },
            },
            yAxis: {
                type: "category",
                data: months,
                splitArea: { show: true },
            },
            visualMap: {
                min: 0,
                max: 100,
                calculable: true,
                orient: "horizontal",
                left: "center",
                bottom: 8,
            },
            series: [
                {
                    name: "Effectief/gedeeld",
                    type: "heatmap",
                    data: heatData,
                    emphasis: { itemStyle: { shadowBlur: 10, shadowColor: "rgba(0,0,0,0.3)" } },
                },
            ],
        }),
        [hours, months, heatData]
    );

    return (
        <div className="chart-card">
            <div className="chart-card__head">
                <h3>Efficiëntie per uur × maand</h3>
                <p>Ratio effectief/gedeeld</p>
            </div>
            <EChart option={option} style={{ height, width: "100%" }} />
        </div>
    );
};

export default EffectivenessHeatmap;
