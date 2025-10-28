import React, { useMemo } from "react";

type Props = {
    donatedKwh?: number;
    tlRateEurPerKwh?: number;
    adminFee?: number;
    recipientsCount?: number;
    currency?: string;
};

const FinancialImpactWaterfall: React.FC<Props> = ({
    donatedKwh = 255,
    recipientsCount = 12,
    currency = "€",
}) => {
    const ratePerKwh = 0.11;
    const socialValue = useMemo(() => donatedKwh * ratePerKwh, [donatedKwh]);
    const kwhLabel = `${donatedKwh.toFixed(0)} kWh`;
    const rateLabel = `${currency}${ratePerKwh.toFixed(2)}/kWh`;

    return (
        <div className="impact-card">
            <div className="impact-card__head">
                <h3>Jouw financiële impact</h3>
            </div>

            <div className="impact-bars">
                <div className="impact-bar impact-bar--kwh">
                    <span className="label">Gedoneerde energie</span>
                    <strong>{kwhLabel}</strong>
                </div>

                <div className="impact-connector">×</div>

                <div className="impact-bar impact-bar--rate">
                    <span className="label">Energietarief</span>
                    <strong>{rateLabel}</strong>
                </div>

                <div className="impact-connector">=</div>

                <div className="impact-bar impact-bar--impact">
                    <span className="label">Totale impact</span>
                    <strong>
                        {currency}
                        {socialValue.toFixed(2)}
                    </strong>
                </div>
            </div>

            <div className="impact-meta">
                <div className="meta-pill">
                    <span>Donatievolume</span>
                    <strong>{donatedKwh.toFixed(0)} kWh</strong>
                </div>
                <div className="meta-pill">
                    <span>Aantal mensen gedoneerd</span>
                    <strong>{recipientsCount}</strong>
                </div>
            </div>
        </div>
    );
};

export default FinancialImpactWaterfall;
