import { z } from 'zod';
import { specFactory } from '../app';
import { Account } from '../models/account.model';

export const getBalance = specFactory.createRouteSpec({
  method: 'get',
  path: '/balance',
  handler: async (ctx) => {
    const account = await Account.findOneByOrFail({ id: ctx.state.account.accountId }, );
    ctx.body = {
      balance: account.balance,
    };
  },
  validate: {
    response: z.object({
      balance: z.number(),
    }),
  },
});
