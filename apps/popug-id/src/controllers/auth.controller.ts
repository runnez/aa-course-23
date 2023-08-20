import jwt from 'jsonwebtoken';
import { createRouteSpec } from 'koa-zod-router';
import { z } from 'zod';
import { findAccountByEmailAndPassword } from '../models/account.model';

type AccessTokenPayload = {
  accountId: number;
  role: string;
}

const jwtSecretToken = 'JWT SECRET KEY';

export const sessionsRoute = createRouteSpec({
  method: 'post',
  path: '/sessions',
  handler: async (ctx) => {
    const { email, password } = ctx.request.body;
    const account = await findAccountByEmailAndPassword(email, password);
    console.log(account);
    if (!account) {
      throw new Error('404');
    }
    const payload: AccessTokenPayload = { accountId: account.id, role: account.role }
    const accessToken = jwt.sign(
      payload,
      jwtSecretToken,
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
    const accessToken = ctx.request.headers['x-access-token'];
    const payload = jwt.verify(accessToken, jwtSecretToken) as AccessTokenPayload;
    ctx.body = payload;
  },
  validate: {
    headers: z.object({
      'x-access-token': z.string(),
    }),
    response: z.object({
      accountId: z.number(),
      role: z.string(),
    }),
  },
});