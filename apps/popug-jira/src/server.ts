import Koa from 'koa';
import zodRouter from 'koa-zod-router';
import { authMiddleware } from './middlewares/auth.middleware';
import { shufflePendingTasksRoute, createTaskRoute, getTasksRoute } from './controllers/task.controller';

export const createServer = () => {
  const app = new Koa();
  const router = zodRouter({
    zodRouter: {
      exposeRequestErrors: true,
      exposeResponseErrors: true,
    },
  });
  router.use(authMiddleware);
  router.register(createTaskRoute);
  router.register(getTasksRoute);
  router.register(shufflePendingTasksRoute);
  app.use(router.routes());
  return app;
}