import React, { useMemo } from "react";
import EChart from "./EChart";

type Point = { ts: string; wind_kwh: number; solar_kwh: number };
type Props = { data: Point[] };

const maandNamenNL = ["jan", "feb", "mrt", "apr", "mei", "jun", "jul", "aug", "sep", "okt", "nov", "dec"];

function formatNLDate(isoDateStr: string): string {
    const [y, m, d] = isoDateStr.split("-").map(Number);
    return `${d} ${maandNamenNL[(m || 1) - 1]} ${y}`;
}

const TimelineChart: React.FC<Props> = ({ data }) => {
    const times = useMemo(() => data.map(d => d.ts), [data]);
    const solar = useMemo(() => data.map(d => d.solar_kwh), [data]);
    const wind = useMemo(() => data.map(d => d.wind_kwh), [data]);

    const chartDate = useMemo(() => {
        if (!times.length) return "";
        const datePart = times[0].split(" ")[0];
        return formatNLDate(datePart);
    }, [times]);

    const option = {
        title: {
            text: chartDate,
            left: "left",
            bottom: 0,
            textStyle: { fontSize: 12, color: "#666" }
        },
        tooltip: { trigger: "axis" },
        legend: { data: ["Zon", "Wind"] },
        grid: { left: 46, right: 20, bottom: 62, top: 30 },
        xAxis: {
            type: "category",
            data: times,
            axisLabel: {
                interval: (_idx: number, value: string) => value.split(" ")[1]?.split(":")[1] === "00",
                formatter: (value: string) => `${value.split(" ")[1]?.split(":")[0] ?? "00"}u`
            },
            axisTick: { alignWithLabel: true }
        },
        yAxis: { type: "value", name: "kWh" },
        series: [
            { name: "Zon", type: "bar", stack: "kwh", data: solar },
            { name: "Wind", type: "bar", stack: "kwh", data: wind }
        ],
        color: ["#F99B2A", "#2F6B9A"]
    };

    return <EChart option={option} style={{ height: 360, width: "100%" }} />;
};

export default TimelineChart;
