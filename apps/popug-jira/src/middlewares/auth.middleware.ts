import { specFactory } from '../app';
import { sdk } from '../sdk';

export const authMiddleware = specFactory.createUseSpec({
  handler: async (ctx, next) => {
    console.log('auth middleware headers', ctx.req.headers);
    const account = await sdk.auth.verify(ctx.req.headers);
    console.log('verified account', account);
    ctx.state.account = account;
    await next();
  },
});