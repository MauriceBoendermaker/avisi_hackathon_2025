import React from "react";
import "../assets/scss/components/TransactionsList.scss";

interface Transaction {
    timestamp: string;
    source: string;
    amount: number;
}

const generateTransactions = (): Transaction[] => {
    const transactions: Transaction[] = [];
    const startDate = new Date("2025-10-02T08:00:00");

    for (let i = 0; i < 25; i++) {
        const timestamp = new Date(startDate.getTime() + i * 15 * 60000);
        const formattedTimestamp = timestamp.toISOString().slice(0, 16).replace("T", " ");
        
        let source: string;
        if (i % 5 === 0) {
            source = "Windmolen";
        } else {
            const nummer = Math.floor(Math.random() * 150) + 1;
            source = `Opwekker ${nummer} (Zonnepaneel)`;
        }

        const amount = Math.floor(Math.random() * 100) + 1;

        transactions.push({
            timestamp: formattedTimestamp,
            source,
            amount,
        });
    }

    return transactions;
};

const TransactionsList: React.FC = () => {
    const transactions = generateTransactions();

    return (
        <div className="transactions-list">
            <div className="transactions-card">
                <div className="table-scroll">
                    <table>
                        <thead>
                            <tr>
                                <th>Herkomst</th>
                                <th>Hoeveelheid (kWh)</th>
                                <th>Tijdstip</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((tx, idx) => (
                                <tr key={idx}>
                                    <td>{tx.source}</td>
                                    <td>{tx.amount}</td>
                                    <td>{tx.timestamp}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default TransactionsList;
