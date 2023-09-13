import z from 'zod';

export const AccountSchema = z.object({
  id: z.number(),
  email: z.string(),
  role: z.enum(['admin', 'user']),
});

export const CreateAccountEndpoint = {
  body: z.object({
    account: z.object({
      email: z.string(),
      password: z.string(),
      role: z.enum(['admin', 'user']),
    })
  }),
  response: z.object({
    account: AccountSchema,
  }),
}