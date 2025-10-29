import { ClientTransaction } from "@/drizzle/schema";
import { TransactionService } from "@/services/transaction-service";
import type { TransactionActionResponse } from "@/services/transaction-service";

export async function getUserTransactions(
  userId: string,
): Promise<TransactionActionResponse<ClientTransaction[]>> {
  if (!userId || typeof userId !== "string") throw new Error("Invalid user ID");
  return TransactionService.findUserTransactions(userId);
}
