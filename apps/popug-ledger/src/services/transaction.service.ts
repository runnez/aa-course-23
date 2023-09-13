import { db } from "../db";
import { Account } from "../models/account.model";
import { Transaction } from "../models/transaction.model";

export async function applyTransaction(accountId: number, amount: number, description: string) {
  await db.transaction(async manager => {
    const account = await Account.findOneByOrFail({ id: accountId })
    const transaction = Transaction.create({
      amount,
      account,
      description,
    });
    account.balance += amount;
    manager.save(account);
    manager.save(transaction);
  });
}