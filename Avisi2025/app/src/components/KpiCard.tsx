import React from "react";
import "../assets/scss/components/KpiCard.scss";

interface KpiCardProps {
    title: string;
    value: string | number;
    change?: string;
    changeType?: "up" | "down";
}

const KpiCard: React.FC<KpiCardProps> = ({ title, value, change, changeType }) => {
    return (
        <div className="kpi-card">
            <div className="kpi-card__title">{title}</div>
            <div className="kpi-card__content">
                <span className="kpi-card__value">{value}</span>
                {change && (
                    <span
                        className={`kpi-card__change ${changeType === "up" ? "up" : "down"
                            }`}
                    >
                        {change} <i className={`fa-solid fa-arrow-${changeType}`}></i>
                    </span>
                )}
            </div>
        </div>
    );
};

export default KpiCard;
