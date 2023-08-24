import { routerSpecFactory } from 'koa-zod-router';

export type AccountState = {
  account: {
    accountId: number;
    role: string;
  };
};

export const specFactory = routerSpecFactory<AccountState>();
