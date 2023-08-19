// listen ACCOUNT.created;

import { createAccount } from "../models/account.model";

export function processEvent(payload: { account: {} }) {
  createAccount(payload.account);
}