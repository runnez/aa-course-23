import { createAccount } from "../models/account.model";

export async function processAccountEvent({ name, payload }: { name: string, payload: {} }) {
  console.log('processAccountEvent', name);
  if (name === 'accountCreated') {
    await createAccount((payload as any).account);
  }
}