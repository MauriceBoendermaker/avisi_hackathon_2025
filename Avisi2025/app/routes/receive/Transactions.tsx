import React from "react";
import LayoutReceive from "../../src/layouts/LayoutReceive";
import TransactionsList from "../../src/components/TransactionsList";

const Transactions: React.FC = () => {
    return (
        <LayoutReceive>
            <div className="matches-head">
                <h2>Alle transacties</h2>
            </div>
            <TransactionsList />
        </LayoutReceive>
    );
};

export default Transactions;
