import React from "react";

type Recipient = { recipient_id: number; name: string; kwh: number };
type Props = { recipients: Recipient[] };

const TopRecipientsTable: React.FC<Props> = ({ recipients }) => {
    const total = recipients.reduce((a, b) => a + b.kwh, 0) || 1;

    return (
        <div className="list-card top-recipients">
            <div className="list-card__title">Bestemming</div>
            <table className="list-card__table">
                <thead>
                    <tr>
                        <th>Ontvanger</th>
                        <th>kWh</th>
                        <th>Aandeel</th>
                    </tr>
                </thead>
                <tbody>
                    {recipients.map((r) => (
                        <tr key={r.recipient_id}>
                            <td>{r.name}</td>
                            <td>{r.kwh}</td>
                            <td>
                                <div className="bar">
                                    <div
                                        className="bar__fill"
                                        style={{ width: `${(r.kwh / total) * 100}%` }}
                                    />
                                    <span className="bar__label">
                                        {Math.round((r.kwh / total) * 100)}%
                                    </span>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {recipients.length === 0 && (
                        <tr>
                            <td colSpan={3} className="empty">
                                Geen ontvangers beschikbaar
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default TopRecipientsTable;
