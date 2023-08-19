import jwt from 'jsonwebtoken';
import { createRouteSpec } from 'koa-zod-router';
import { z } from 'zod';
import { findAccountByEmailAndPassword } from '../models/account.model';

export const sessionsRoute = createRouteSpec({
  method: 'post',
  path: '/sessions',
  handler: async (ctx) => {
    const { email, password } = ctx.request.body;
    const account = await findAccountByEmailAndPassword(email, password);
    if (!account) {
      ctx.status = 422;
      return;
    }
    const accessToken = jwt.sign(
      { accountId: account.id },
      process.env.TOKEN_KEY!,
      { expiresIn: "7d" }
    );
    ctx.body = {
      accessToken,
    };
  },
  validate: {
    body: z.object({
      email: z.string(),
      password: z.string(),
    }),
    response: z.object({
      accessToken: z.string(),
    }),
  },
});

export const verifyRoute = createRouteSpec({
  method: 'post',
  path: '/verify',
  handler: async (ctx) => {
    const { accessToken } = ctx.request.headers;
    jwt.verify(accessToken, process.env.TOKEN_KEY!);
    ctx.status = 204;
  },
  validate: {
    headers: z.object({
      accessToken: z.string(),
    }),
  },
});