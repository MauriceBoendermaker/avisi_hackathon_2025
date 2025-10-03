import React from "react";

type Supplier = { supplier_id: number; name: string; kwh: number };
type Props = { suppliers: Supplier[] };

const TopSuppliersTable: React.FC<Props> = ({ suppliers }) => {
    const total = suppliers.reduce((a, b) => a + b.kwh, 0) || 1;

    return (
        <div className="top-suppliers">
            <div className="top-suppliers__title">Herkomst</div>
            <table className="top-suppliers__table">
                <thead>
                    <tr>
                        <th>Leverancier</th>
                        <th>kWh</th>
                        <th>Bijdrage</th>
                    </tr>
                </thead>
                <tbody>
                    {suppliers.map(s => (
                        <tr key={s.supplier_id}>
                            <td>{s.name}</td>
                            <td>{s.kwh}</td>
                            <td>
                                <div className="bar">
                                    <div className="bar__fill" style={{ width: `${(s.kwh / total) * 100}%` }} />
                                    <span className="bar__label">{Math.round((s.kwh / total) * 100)}%</span>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {suppliers.length === 0 && (
                        <tr>
                            <td colSpan={3} className="empty">Geen leveranciers beschikbaar</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default TopSuppliersTable;
