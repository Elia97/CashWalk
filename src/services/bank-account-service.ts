import { BankAccountRepository } from '@/repo/bank-account-repository';
import type {
  BankAccount,
  ClientBankAccount,
  PrimaryBankAccountWithRelations,
} from '@/drizzle/schema';

type ServiceResponse<T = void> = {
  error: boolean;
  data?: T;
  message?: string;
};

export class BankAccountService {
  private repository: BankAccountRepository;

  constructor() {
    this.repository = new BankAccountRepository();
  }

  private async handleErrors<T>(
    fn: () => Promise<T>,
    defaultMessage = 'An error occurred',
  ): Promise<ServiceResponse<T>> {
    try {
      const data = await fn();
      return { error: false, data: data! };
    } catch (error: unknown) {
      return {
        error: true,
        message: error instanceof Error ? error.message : defaultMessage,
      };
    }
  }

  async getAll(userId: string): Promise<ServiceResponse<ClientBankAccount[]>> {
    return this.handleErrors(
      async () =>
        await this.repository.findAll(userId).then(
          (rows) =>
            rows.map((account) => ({
              ...account,
              balance: Number(account.balance),
            })) as ClientBankAccount[],
        ),
      'Failed to retrieve bank accounts',
    );
  }

  async create(data: ClientBankAccount): Promise<ServiceResponse<BankAccount>> {
    return this.handleErrors(
      async () =>
        await this.repository.insert({
          ...data,
          balance: String(data.balance),
        }),
      'Failed to create bank account',
    );
  }

  async delete(accountId: string): Promise<ServiceResponse<BankAccount>> {
    return this.handleErrors(
      async () => await this.repository.delete(accountId),
      'Failed to delete bank account',
    );
  }

  async update(accountId: string, data: ClientBankAccount): Promise<ServiceResponse<BankAccount>> {
    return this.handleErrors(async () => {
      return await this.repository.update(accountId, {
        ...data,
        balance: String(data.balance),
      });
    }, 'Failed to update bank account');
  }

  async setPrimaryBankAccount(userId: string, accountId: string): Promise<ServiceResponse> {
    return this.handleErrors(
      async () => await this.repository.setPrimary(userId, accountId),
      'Failed to set primary bank account',
    );
  }

  async getPrimaryBankAccount(
    userId: string,
  ): Promise<ServiceResponse<PrimaryBankAccountWithRelations>> {
    return this.handleErrors(async () => {
      const res = await this.repository.findPrimary(userId);
      if (!res) throw new Error('Primary bank account not found');
      return {
        ...res,
        balance: Number(res.balance),
        transactions: res.transactions.map((tx) => ({
          ...tx,
          amount: Number(tx.amount),
        })),
      };
    }, 'Failed to retrieve primary bank account');
  }
}
