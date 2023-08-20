import { createRouteSpec } from 'koa-zod-router';
import { z } from 'zod';
import { db } from '../database';
import { sendEvent } from '../lib/kafka';
import { createAccount } from '../models/account.model';

const AccountSchema = z.object({
  id: z.number(),
  email: z.string(),
  role: z.enum(['admin', 'user']),
});

export const createAccountRoute = createRouteSpec({
  method: 'post',
  path: '/accounts',
  handler: async (ctx) => {
    const newAccount = ctx.request.body.account;
    await db.transaction().execute(async (trx) => {
      const account = await createAccount(newAccount, { trx });
      await sendEvent('account', {
        name: 'accountCreated',
        payload: { account: AccountSchema.parse(account) },
      });
      ctx.body = {
        account,
      };
    })
  },
  validate: {
    body: z.object({
      account: z.object({
        email: z.string(),
        password: z.string(),
        role: z.enum(['admin', 'user']),
      })
    }),
    response: z.object({
      account: z.object({
        id: z.number(),
        role: z.string(),
        email: z.string(),
      }),
    }),
  },
});