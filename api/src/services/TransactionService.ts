import Service from "./Service.js";
import TransactionRepository from "../repositories/TransacitonRepository.js";
import type {TransactionRequest} from "../types.js";
import logger from "../util/logger.js";

class TransactionService extends Service<TransactionRepository>{
    constructor() {
        super(new TransactionRepository());
    }
    public async logTransaction(transaction: TransactionRequest) {
        const result = await this.repository().insertTransactionLogEntry(transaction);
        if(!result) {
            logger.error(`Failed to log transaction regarding`)
        }
        return result;
    }
}

export default TransactionService;