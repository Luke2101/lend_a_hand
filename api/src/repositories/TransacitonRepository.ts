import type {TransactionRequest} from "../types.js";
import {db} from "../lib/auth.js";
import {transactionsTable} from "../db/tables.js";

class TransactionRepository {

    public async insertTransactionLogEntry(transaction: TransactionRequest) {
        const res = await db.insert(transactionsTable).values({
            to_account: transaction.toAccount,
            from_account: transaction.fromAccount,
            amount: transaction.amount
        })
        return res[0].affectedRows == 1;
    }

}

export default TransactionRepository;