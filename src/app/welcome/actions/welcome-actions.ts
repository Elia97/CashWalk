'use server';

import { ClientBankAccount } from '@/drizzle/schema';
import { WelcomeService } from '@/services/welcome-service';

type ActionResult<T = void> = {
  error: boolean;
  data?: T;
  message?: string;
};

const service = new WelcomeService();

export async function createWelcomeDataAction(data: {
  bankAccount: ClientBankAccount;
  categories: string[];
}): Promise<ActionResult> {
  return await service.createWelcomeData(data);
}
