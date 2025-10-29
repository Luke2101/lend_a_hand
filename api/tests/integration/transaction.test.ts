import {app} from "../../src/api.js"
import TransactionService from "../../src/services/TransactionService.js";
import type {TransactionRequest} from "../../src/types.js";


const transactionService = new TransactionService();

it("Create valid transaction entry", async () => {
    const transaction: TransactionRequest = {
        amount: 200,
        fromAccount: "from",
        toAccount: "to"
    }
    const result = await transactionService.logTransaction(transaction)
    expect(result).toBeTruthy();
})
