import React, { useEffect, useMemo, useState } from "react";
import LayoutReceive from "../../src/layouts/LayoutReceive";
import DonutSources from "../../src/components/charts/DonutSources";
import TimelineChart from "../../src/components/charts/TimelineChart";
import TopSuppliersTable from "../../src/components/tables/TopSuppliersTable";

type EnergySources = {
    wind_kwh: number;
    solar_kwh: number;
    wind_percentage: number;
    solar_percentage: number;
};

type Supplier = {
    supplier_id: number;
    name: string;
    kwh: number;
};

type SummaryResponse = {
    consumer_id: number;
    total_kwh_received: number;
    money_saved_euros: number;
    energy_sources: EnergySources;
    top_solar_suppliers: Supplier[];
};

type SeriesPoint = { ts: string; wind_kwh: number; solar_kwh: number };

function rand(min: number, max: number): number {
    return Math.random() * (max - min) + min;
}

function pad(n: number): string {
    return String(n).padStart(2, "0");
}

function generateSeriesForToday(): SeriesPoint[] {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const points: SeriesPoint[] = [];
    for (let i = 0; i < 96; i++) {
        const t = new Date(start.getTime() + i * 15 * 60000);
        const hour = t.getHours();
        const solarCurve = Math.max(0, Math.sin(((hour - 6) / 12) * Math.PI));
        const windCurve = 0.6 + 0.6 * Math.sin((i / 12) * Math.PI);
        const solar = Number((solarCurve * rand(0.2, 0.8)).toFixed(2));
        const wind = Number((Math.max(0, windCurve) * rand(0.1, 0.6)).toFixed(2));
        points.push({
            ts: `${t.getFullYear()}-${pad(t.getMonth() + 1)}-${pad(t.getDate())} ${pad(t.getHours())}:${pad(t.getMinutes())}`,
            solar_kwh: solar,
            wind_kwh: wind,
        });
    }
    return points;
}

function generateSuppliers(): Supplier[] {
    const count = Math.floor(rand(2, 5));
    const picks = new Set<number>();
    while (picks.size < count) picks.add(Math.floor(rand(1, 151)));
    const arr = Array.from(picks).map((id, idx) => ({
        supplier_id: id,
        name: idx % 3 === 0 ? "Windmolen" : `Opwekker ${id}`,
        kwh: Number(rand(10, 120).toFixed(0)),
    }));
    arr.sort((a, b) => b.kwh - a.kwh);
    return arr;
}

const Matches: React.FC = () => {
    const [summary, setSummary] = useState<SummaryResponse | null>(null);
    const [series, setSeries] = useState<SeriesPoint[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const seriesData = generateSeriesForToday();
        const totalSolar = seriesData.reduce((a, p) => a + p.solar_kwh, 0);
        const totalWind = seriesData.reduce((a, p) => a + p.wind_kwh, 0);
        const total = totalSolar + totalWind;
        const suppliers = generateSuppliers();
        const moneySaved = Number((total * rand(0.007, 0.012)).toFixed(2));

        setSeries(seriesData);
        setSummary({
            consumer_id: 5,
            total_kwh_received: Number(total.toFixed(1)),
            money_saved_euros: moneySaved,
            energy_sources: {
                wind_kwh: Number(totalWind.toFixed(1)),
                solar_kwh: Number(totalSolar.toFixed(1)),
                wind_percentage: total ? Number(((totalWind / total) * 100).toFixed(1)) : 0,
                solar_percentage: total ? Number(((totalSolar / total) * 100).toFixed(1)) : 0,
            },
            top_solar_suppliers: suppliers,
        });

        setLoading(false);
    }, []);

    const donutData = useMemo(
        () => ({
            wind: summary?.energy_sources.wind_kwh ?? 0,
            solar: summary?.energy_sources.solar_kwh ?? 0,
        }),
        [summary]
    );

    const suppliers = useMemo<Supplier[]>(
        () => summary?.top_solar_suppliers ?? [],
        [summary]
    );

    return (
        <LayoutReceive>
            <div className="matches-head">
                <h2>Je matches</h2>
                {summary && (
                    <div className="matches-head__stats">
                        <div className="pill">
                            <span>Totaal ontvangen</span>
                            <strong>{summary.total_kwh_received.toFixed(1)} kWh</strong>
                        </div>
                        <div className="pill">
                            <span>Besparing</span>
                            <strong>€{summary.money_saved_euros.toFixed(2)}</strong>
                        </div>
                    </div>
                )}
            </div>

            <div className="matches-grid" aria-busy={loading}>
                <div className="matches-left">
                    <DonutSources wind={donutData.wind} solar={donutData.solar} />
                </div>
                <div className="matches-right">
                    <TimelineChart data={series} />
                </div>
                <div className="matches-bottom">
                    <TopSuppliersTable suppliers={suppliers} />
                </div>
            </div>
        </LayoutReceive>
    );
};

export default Matches;
