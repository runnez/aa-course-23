import { specFactory } from '../app';
import { authSdk } from '../sdk';

export const authMiddleware = specFactory.createUseSpec({
  handler: async (ctx, next) => {
    console.log('auth middleware headers', ctx.req.headers);
    const account = await authSdk.verify(ctx.req.headers);
    console.log('verified account', account);
    ctx.state.account = account;
    await next();
  },
});