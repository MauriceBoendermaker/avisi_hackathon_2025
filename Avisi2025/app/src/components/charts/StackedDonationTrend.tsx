import React, { useMemo } from "react";
import EChart from "./EChart";

type Props = {
    months?: string[];
    monthlyGeneratedKwh?: number[];
    monthlyConsumedKwh?: number[];
    minDonationKwh?: number;
    donationPct?: number;
    efficiencyByMonth?: number[];
    height?: number | string;
};

const StackedDonationTrend: React.FC<Props> = ({
    months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"],
    monthlyGeneratedKwh = [320, 290, 350, 420, 520, 600, 620, 580, 480, 380, 320, 280],
    monthlyConsumedKwh = [400, 380, 390, 410, 430, 450, 470, 460, 440, 420, 410, 400],
    minDonationKwh = 1,
    donationPct = 0.15,
    efficiencyByMonth = [0.55, 0.6, 0.62, 0.65, 0.7, 0.75, 0.78, 0.76, 0.7, 0.62, 0.58, 0.55],
    height = 360,
}) => {
    const { donated, effective, virtualTl } = useMemo(() => {
        const donated: number[] = [];
        const effective: number[] = [];
        const virtualTl: number[] = [];
        for (let i = 0; i < months.length; i++) {
            const gen = monthlyGeneratedKwh[i] ?? 0;
            const con = monthlyConsumedKwh[i] ?? 0;
            const surplus = Math.max(gen - con, 0);
            const target = Math.max(minDonationKwh, +(surplus * donationPct).toFixed(2));
            const actualDonation = Math.min(target, surplus);
            const eff = +(actualDonation * (efficiencyByMonth[i] ?? 0.65)).toFixed(2);
            const virt = +(actualDonation - eff).toFixed(2);
            donated.push(+actualDonation.toFixed(2));
            effective.push(eff);
            virtualTl.push(virt);
        }
        return { donated, effective, virtualTl };
    }, [months, monthlyGeneratedKwh, monthlyConsumedKwh, minDonationKwh, donationPct, efficiencyByMonth]);

    const option = useMemo(
        () => ({
            tooltip: { trigger: "axis" },
            legend: { data: ["Gedeeld", "Overschot", "Opwek"] },
            grid: { left: 12, right: 12, top: 48, bottom: 24, containLabel: true },
            xAxis: { type: "category", data: months },
            yAxis: { type: "value", name: "kWh" },
            series: [
                { name: "Gedeeld", type: "line", stack: "total", areaStyle: {}, smooth: true, data: donated },
                { name: "Overschot", type: "line", stack: "total", areaStyle: {}, smooth: true, data: effective },
                { name: "Opwek", type: "line", stack: "total", areaStyle: {}, smooth: true, data: virtualTl },
            ],
        }),
        [months, donated, effective, virtualTl]
    );

    return (
        <div className="chart-card">
            <div className="chart-card__head">
                <h3>Gedeeld vs. Overschot vs. Opwek</h3>
                <p>Maandelijkse kWh-trend</p>
            </div>
            <EChart option={option} style={{ height, width: "100%" }} />
        </div>
    );
};

export default StackedDonationTrend;
