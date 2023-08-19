import Koa from 'koa';
import zodRouter from 'koa-zod-router';
import { createTaskRoute } from './controllers/task.controller';

export const createServer = () => {
  const app = new Koa();
  const router = zodRouter();
  router.register(createTaskRoute);
  app.use(router.routes());
  return app;
}