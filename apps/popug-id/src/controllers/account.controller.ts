import { createRouteSpec } from 'koa-zod-router';
import { z } from 'zod';
import { db } from '../database';
import { kafka, sendEvent } from '../lib/kafka';
import { createAccount } from '../models/account.model';

export const createAccountRoute = createRouteSpec({
  method: 'post',
  path: '/accounts',
  handler: async (ctx) => {
    const newAccount = ctx.request.body.account;
    await db.transaction().execute(async (trx) => {
      const account = await createAccount(newAccount, { trx });
      await sendEvent('accounts', {
        name: 'accountCreated',
        payload: { accountId: account.id },
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