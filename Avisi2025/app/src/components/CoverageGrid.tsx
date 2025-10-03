import React from "react";
import "../assets/scss/components/CoverageGrid.scss";

const hours = Array.from({ length: 24 }, (_, i) => i);
const quarters = ["00–15", "15–30", "30–45", "45–60"];

function generateData(): number[] {
    const values: number[] = [];
    for (let h = 0; h < 24; h++) {
        for (let q = 0; q < 4; q++) {
            const t = h + q / 4;
            const sun = Math.max(0, Math.sin(((t - 6) / 12) * Math.PI));
            const quarterMod = q === 1 || q === 2 ? 1 : 0.85;
            const wind = 0.08 + 0.06 * Math.random();
            const mix = Math.min(1, sun * quarterMod + wind);
            values[h * 4 + q] = Math.round(mix * 100);
        }
    }
    return values;
}

const data = generateData();

const CoverageGrid: React.FC = () => {
    return (
        <div className="coverage-grid">
            <div className="cg-header">
                <h3>Dekking per dag</h3>
                <span>kWh per kwartier</span>
            </div>

            <div className="cg-axes">
                <div className="cg-corner">Kwartier</div>

                <div className="cg-hours">
                    {hours.map((h) => (
                        <div key={h} className="cg-hour">{h}u</div>
                    ))}
                </div>

                <div className="cg-quarters">
                    {quarters.map((q) => (
                        <div key={q} className="cg-quarter">{q}</div>
                    ))}
                </div>

                <div className="cg-matrix-wrap">
                    <div className="cg-matrix">
                        {quarters.map((_, row) =>
                            hours.map((h) => {
                                const idx = h * 4 + row;
                                const v = data[idx];
                                const alpha = v === 0 ? 0.12 : 0.18 + (v / 100) * 0.82;
                                return (
                                    <div
                                        key={`${row}-${h}`}
                                        className="cg-cell"
                                        style={{ backgroundColor: `rgba(255, 127, 9, ${alpha})` }}
                                        title={`${h}:00 ${quarters[row]} • ${v}%`}
                                        aria-label={`${h}:00 ${quarters[row]} • ${v}%`}
                                    />
                                );
                            })
                        )}
                    </div>
                </div>
            </div>

            <div className="cg-legend">
                <span>Laag</span>
                <div className="cg-swatch" style={{ backgroundColor: "rgba(255,127,9,0.15)" }} />
                <div className="cg-swatch" style={{ backgroundColor: "rgba(255,127,9,0.35)" }} />
                <div className="cg-swatch" style={{ backgroundColor: "rgba(255,127,9,0.55)" }} />
                <div className="cg-swatch" style={{ backgroundColor: "rgba(255,127,9,0.75)" }} />
                <div className="cg-swatch" style={{ backgroundColor: "rgba(255,127,9,0.95)" }} />
                <span>Hoog</span>
            </div>
        </div>
    );
};

export default CoverageGrid;
