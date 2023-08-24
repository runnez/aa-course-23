import { Event, EventName } from "sdk";
import { createAccount } from "../models/account.model";

export async function handleAccountEvent({ name, payload }: Event) {
  if (name === EventName.AccountCreated) {
    await createAccount(payload.account);
  }
}