import Koa from 'koa';
import zodRouter from 'koa-zod-router';
import { createAccountRoute } from './controllers/account.controller';
import { sessionsRoute, verifyRoute } from './controllers/auth.controller';

export const createServer = () => {
  const app = new Koa();
  const router = zodRouter({
    zodRouter: {
      exposeRequestErrors: true,
      exposeResponseErrors: true,
      validationErrorHandler: async (ctx, next) => {
        if (ctx.invalid.error) {
          console.log(ctx.invalid);
        }
        await next();
      }
    },
  });
  router.register(createAccountRoute);
  router.register(sessionsRoute);
  router.register(verifyRoute);
  app.use(router.routes());
  return app;
}