import Koa from 'koa';
import zodRouter from 'koa-zod-router';
import { authMiddleware } from './middlewares/auth.middleware';
import { getBalance } from './controllers/balance.controller';
import { getTransactions } from './controllers/transaction.controller';

export const createServer = () => {
  const app = new Koa();
  const router = zodRouter({
    zodRouter: {
      exposeRequestErrors: true,
      exposeResponseErrors: true,
    },
  });
  router.use(authMiddleware);
  router.register(getBalance);
  router.register(getTransactions);
  app.use(router.routes());
  return app;
}