import Koa from 'koa';
import zodRouter from 'koa-zod-router';
import { createAccountRoute } from './controllers/account.controller';
import { sessionsRoute, verifyRoute } from './controllers/auth';

export const createServer = () => {
  const app = new Koa();
  const router = zodRouter();
  router.register(createAccountRoute);
  router.register(sessionsRoute);
  router.register(verifyRoute);
  app.use(router.routes());
  return app;
}