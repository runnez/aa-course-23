import { z } from 'zod';
import { specFactory } from '../app';
import { Transaction } from '../models/transaction.model';

export const getTransactions = specFactory.createRouteSpec({
  method: 'get',
  path: '/transactions',
  handler: async (ctx) => {
    const transactions = await Transaction.findBy({ accountId: ctx.state.account.accountId });
    ctx.body = {
      transactions,
    };
  },
  validate: {
    response: z.object({
      transactions: z.array(
        z.object({
          id: z.number(),
          description: z.string(),
          amount: z.number(),
        })
      ),
    }),
  },
});
