import { createRouteSpec } from 'koa-zod-router';
import { AccountSchema, CreateAccountEndpoint, EventName, EventTopic } from 'sdk';
import { sendEvent } from '../lib/kafka';
import { createAccount } from '../models/account.model';

export const createAccountRoute = createRouteSpec({
  method: 'post',
  path: '/accounts',
  handler: async (ctx) => {
    const newAccount = ctx.request.body.account;
    const account = await createAccount(newAccount);
    await sendEvent(EventTopic.account, {
      name: EventName.AccountCreated,
      payload: { account: AccountSchema.parse(account) },
    });
    ctx.body = {
      account,
    };
  },
  validate: CreateAccountEndpoint,
});