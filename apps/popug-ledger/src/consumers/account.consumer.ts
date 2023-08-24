import { Event, EventName } from "sdk";
import { Account } from "../models/account.model";

export async function handleAccountEvent({ name, payload }: Event) {
  if (name === EventName.AccountCreated) {
    await Account.insert({
      id: payload.account.id,
      balance: 0,
    });
  }
}