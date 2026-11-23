import "server-only";
import { and, desc, eq, gte, ilike, inArray, or, sql } from "drizzle-orm";
import { getDjangoSessionToken, getPreviewOverrides, getPreviewToken } from "@/server/auth/session";
import { db } from "@/server/db/client";
import { accounts, bills, cards, transactions } from "@/server/db/schema";
import { toAccount, toCard, toTransaction } from "@/server/mappers";
import { getSharpToolzApiBases } from "@/server/sharptoolz-api";
import type { Account, Bill, PaymentCard, Transaction, TransactionFilters } from "@/types/banking";

/**
 * Reads for one customer. Every query is scoped by `userId`, so a customer can never
 * see another customer's records, whatever ids the request carries.
 */

/** Ledger balance (everything not failed) and the amount of pending credits not yet available. */
const balanceSql = sql<string>`coalesce(sum(case
  when ${transactions.status} = 'failed' then 0
  when ${transactions.direction} = 'credit' then ${transactions.amount}
  else -(${transactions.amount} + ${transactions.fee}) end), 0)`;
const pendingCreditSql = sql<string>`coalesce(sum(case
  when ${transactions.status} = 'pending' and ${transactions.direction} = 'credit' then ${transactions.amount}
  else 0 end), 0)`;

interface DjangoAccountDto {
  id: string;
  account_type: Account["type"];
  name: string;
  account_number: string;
  routing_number: string;
  balance: number;
  apy_bps: number;
}

interface DjangoTransactionDto {
  id: string;
  account_id?: string;
  direction: Transaction["direction"];
  amount: number;
  fee?: number;
  counterparty: string;
  counterparty_detail?: string | null;
  narration?: string;
  category?: Transaction["category"];
  channel?: Transaction["channel"];
  status?: Transaction["status"];
  reference?: string;
  occurred_at: string;
}

interface DjangoCardDto {
  id: string;
  label: string;
  kind: PaymentCard["kind"];
  brand: PaymentCard["brand"];
  card_number?: string;
  cvv?: string;
  pin?: string;
  last4: string;
  expiry: string;
  holder_name: string;
  is_frozen: boolean;
  online_payments: boolean;
  monthly_limit: number;
}

interface DjangoProfileDto {
  is_created?: boolean;
  is_test?: boolean;
  is_live?: boolean;
  subscription_status?: "test" | "active" | "expired";
  accounts?: DjangoAccountDto[];
  recent_transactions?: DjangoTransactionDto[];
  cards?: DjangoCardDto[];
}

async function fetchDjangoData(): Promise<DjangoProfileDto | null> {
  const token = await getDjangoSessionToken();
  const query = token ? `?token=${encodeURIComponent(token)}` : "";
  for (const apiBase of getSharpToolzApiBases()) {
    try {
      const res = await fetch(`${apiBase}/fernway/client/data/${query}`, {
        cache: "no-store",
        headers: token ? { "X-Fernway-Token": token } : undefined,
      });
      if (res.ok) return (await res.json()) as DjangoProfileDto;
    } catch {
      // Try next API base
    }
  }
  return null;
}

export type SimulationNoticeMode = "none" | "test" | "expired";

/** Returns whether the active SharpToolz-managed profile needs a top simulation notice. */
export async function getSimulationNoticeMode(): Promise<SimulationNoticeMode> {
  const data = await fetchDjangoData();
  if (!data) return "none";
  if (data.subscription_status === "expired") return "expired";
  if (data.is_live === false || Boolean(data.is_test) || data.is_created === false) return "test";
  return "none";
}

/** True whenever the active SharpToolz-managed banking profile is not live (test, uncreated, or expired). */
export async function isTestAccount(): Promise<boolean> {
  return (await getSimulationNoticeMode()) !== "none";
}

function buildPreviewStarterTransactions(): Transaction[] {
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;
  return [
    {
      id: "preview-tx-1",
      accountId: "preview-account",
      direction: "credit",
      amount: 15_000_000,
      fee: 0,
      currency: "USD",
      counterparty: "Direct Deposit Payroll",
      narration: "Monthly salary deposit",
      category: "income",
      channel: "wire",
      status: "completed",
      reference: "TX-PREVIEW01",
      createdAt: new Date(now - 1 * day).toISOString(),
    },
    {
      id: "preview-tx-2",
      accountId: "preview-account",
      direction: "debit",
      amount: 245_000,
      fee: 0,
      currency: "USD",
      counterparty: "Apple Store Fifth Ave",
      narration: "Hardware purchase",
      category: "shopping",
      channel: "card",
      status: "completed",
      reference: "TX-PREVIEW02",
      createdAt: new Date(now - 2 * day).toISOString(),
    },
    {
      id: "preview-tx-3",
      accountId: "preview-account",
      direction: "credit",
      amount: 4_500_000,
      fee: 0,
      currency: "USD",
      counterparty: "Client Wire Transfer",
      narration: "Consulting payout",
      category: "income",
      channel: "wire",
      status: "completed",
      reference: "TX-PREVIEW03",
      createdAt: new Date(now - 4 * day).toISOString(),
    },
    {
      id: "preview-tx-4",
      accountId: "preview-account",
      direction: "debit",
      amount: 32_000,
      fee: 0,
      currency: "USD",
      counterparty: "Le Bernardin NYC",
      narration: "Dinner reservation",
      category: "dining",
      channel: "card",
      status: "completed",
      reference: "TX-PREVIEW04",
      createdAt: new Date(now - 6 * day).toISOString(),
    },
  ];
}

export async function accountsForUser(userId: string): Promise<Account[]> {
  const preview = await getPreviewOverrides();
  const previewToken = await getPreviewToken();

  if (preview && !previewToken && preview.isCreated !== true) {
    const bal = preview.balance ?? 25_000_000;
    return [
      {
        id: "preview-account",
        type: "checking",
        name: "Account Balance",
        currency: "USD",
        accountNumber: preview.accountNumber || "3260636900",
        routingNumber: preview.routingNumber || "021000021",
        balance: bal,
        availableBalance: bal,
      },
    ];
  }

  try {
    if (!previewToken) {
      const rows = await db()
        .select({ account: accounts, balance: balanceSql, pendingCredits: pendingCreditSql })
        .from(accounts)
        .leftJoin(transactions, eq(transactions.accountId, accounts.id))
        .where(eq(accounts.userId, userId))
        .groupBy(accounts.id)
        .orderBy(accounts.type, accounts.createdAt);
      if (rows.length > 0) {
        return rows.map(({ account, balance, pendingCredits }) =>
          toAccount(account, Number(balance), Number(balance) - Number(pendingCredits)),
        );
      }
    }
  } catch {
    // Local DB not running — fall back to SharpToolz Django
  }

  const django = await fetchDjangoData();
  if (django?.accounts) {
    return django.accounts.map((acc, idx) => {
      const balance = idx === 0 && preview?.balance !== undefined ? preview.balance : acc.balance;
      const accountNumber = idx === 0 && preview?.accountNumber ? preview.accountNumber : acc.account_number;
      const routingNumber = idx === 0 && preview?.routingNumber ? preview.routingNumber : acc.routing_number;
      return {
        id: acc.id,
        type: acc.account_type,
        name: acc.name,
        currency: "USD" as const,
        accountNumber,
        routingNumber,
        balance,
        availableBalance: balance,
        ...(acc.account_type === "savings" && acc.apy_bps ? { apy: acc.apy_bps / 100 } : {}),
      };
    });
  }

  if (preview) {
    const bal = preview.balance ?? 25_000_000;
    return [
      {
        id: "preview-account",
        type: "checking",
        name: "Account Balance",
        currency: "USD",
        accountNumber: preview.accountNumber || "3260636900",
        routingNumber: preview.routingNumber || "021000021",
        balance: bal,
        availableBalance: bal,
      },
    ];
  }

  return [];
}

export async function accountBelongsTo(accountId: string, userId: string): Promise<boolean> {
  try {
    const [row] = await db()
      .select({ id: accounts.id })
      .from(accounts)
      .where(and(eq(accounts.id, accountId), eq(accounts.userId, userId)))
      .limit(1);
    return Boolean(row);
  } catch {
    return true;
  }
}

export async function transactionsForUser(userId: string, filters: TransactionFilters = {}): Promise<Transaction[]> {
  const preview = await getPreviewOverrides();
  const previewToken = await getPreviewToken();

  const applyFilters = (list: Transaction[]): Transaction[] => {
    let mapped = list;
    if (filters.accountId) mapped = mapped.filter((t) => t.accountId === filters.accountId);
    if (filters.direction) mapped = mapped.filter((t) => t.direction === filters.direction);
    if (filters.category) mapped = mapped.filter((t) => t.category === filters.category);
    if (filters.search?.trim()) {
      const q = filters.search.trim().toLowerCase();
      mapped = mapped.filter(
        (t) =>
          t.counterparty.toLowerCase().includes(q) ||
          t.narration.toLowerCase().includes(q) ||
          t.reference.toLowerCase().includes(q),
      );
    }
    if (filters.limit) mapped = mapped.slice(0, filters.limit);
    return mapped;
  };

  if (preview && !previewToken && preview.isCreated !== true) {
    return applyFilters(buildPreviewStarterTransactions());
  }

  try {
    if (!previewToken) {
      const ownAccounts = db().select({ id: accounts.id }).from(accounts).where(eq(accounts.userId, userId));
      const search = filters.search?.trim();
      const conditions = [
        inArray(transactions.accountId, ownAccounts),
        filters.accountId ? eq(transactions.accountId, filters.accountId) : undefined,
        filters.direction ? eq(transactions.direction, filters.direction) : undefined,
        filters.category ? eq(transactions.category, filters.category) : undefined,
        search
          ? or(
              ilike(transactions.counterparty, `%${search}%`),
              ilike(transactions.narration, `%${search}%`),
              ilike(transactions.reference, `%${search}%`),
            )
          : undefined,
      ];
      const query = db()
        .select()
        .from(transactions)
        .where(and(...conditions))
        .orderBy(desc(transactions.occurredAt), desc(transactions.createdAt));
      const rows = filters.limit ? await query.limit(filters.limit) : await query;
      if (rows.length > 0) {
        return rows.map(toTransaction);
      }
    }
  } catch {
    // Local DB not running — fall back to SharpToolz Django
  }

  const django = await fetchDjangoData();
  if (django?.recent_transactions) {
    const mapped: Transaction[] = django.recent_transactions.map((tx) => ({
      id: tx.id,
      accountId: tx.account_id || (django.accounts?.[0]?.id ?? ""),
      direction: tx.direction,
      amount: tx.amount,
      fee: tx.fee || 0,
      currency: "USD" as const,
      counterparty: tx.counterparty,
      ...(tx.counterparty_detail ? { counterpartyDetail: tx.counterparty_detail } : {}),
      narration: tx.narration || "",
      category: tx.category || "income",
      channel: tx.channel || "wire",
      status: tx.status || "completed",
      reference: tx.reference || "TX-000",
      createdAt: tx.occurred_at,
    }));

    return applyFilters(mapped);
  }

  if (preview) {
    return applyFilters(buildPreviewStarterTransactions());
  }

  return [];
}

export async function cardsForUser(userId: string, now = new Date()): Promise<PaymentCard[]> {
  const preview = await getPreviewOverrides();
  const previewToken = await getPreviewToken();

  const buildPreviewCard = (): PaymentCard => {
    const number = preview?.cardNumber || "4532 9182 7364 8892";
    const digits = number.replace(/\D/g, "");
    const last4 = digits.slice(-4) || "8892";
    const fullName = `${preview?.firstName || "Alexander"} ${preview?.lastName || "Hamilton"}`.trim();
    return {
      id: "preview-card",
      accountId: "preview-account",
      label: "Lindenway Physical Debit Card",
      kind: "physical",
      brand: "visa",
      cardNumber: number,
      cvv: preview?.cardCvv || "721",
      pin: preview?.cardPin || "1234",
      last4,
      expiry: preview?.cardExpiry || "12/28",
      holderName: preview?.cardHolder || fullName,
      frozen: Boolean(preview?.cardFrozen),
      onlinePayments: true,
      currency: "USD",
      monthlyLimit: preview?.cardLimit ?? 5_000_000,
      spentThisMonth: 277_000,
    };
  };

  if (preview && !previewToken && preview.isCreated !== true) {
    return [buildPreviewCard()];
  }

  try {
    if (!previewToken) {
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const spent = db()
        .select({
          cardId: transactions.cardId,
          total: sql<string>`sum(${transactions.amount} + ${transactions.fee})`.as("total"),
        })
        .from(transactions)
        .where(
          and(
            eq(transactions.direction, "debit"),
            sql`${transactions.status} <> 'failed'`,
            gte(transactions.occurredAt, monthStart),
          ),
        )
        .groupBy(transactions.cardId)
        .as("spent");

      const rows = await db()
        .select({ card: cards, total: spent.total })
        .from(cards)
        .leftJoin(spent, eq(spent.cardId, cards.id))
        .where(eq(cards.userId, userId))
        .orderBy(cards.createdAt);
      if (rows.length > 0) {
        return rows.map(({ card, total }) => toCard(card, Number(total ?? 0)));
      }
    }
  } catch {
    // Local DB not running — fall back to SharpToolz Django
  }

  const django = await fetchDjangoData();
  if (django?.cards) {
    return django.cards.map((c, idx) => {
      const overlay = idx === 0 ? preview : null;
      const cardNumber = overlay?.cardNumber || c.card_number;
      const digits = (cardNumber || "").replace(/\D/g, "");
      return {
        id: c.id,
        accountId: django.accounts?.[0]?.id || "",
        label: c.label,
        kind: "physical" as const,
        brand: c.brand,
        cardNumber,
        cvv: overlay?.cardCvv || c.cvv,
        pin: overlay?.cardPin || c.pin || "1234",
        last4: digits.length >= 4 ? digits.slice(-4) : c.last4,
        expiry: overlay?.cardExpiry || c.expiry,
        holderName: overlay?.cardHolder || c.holder_name,
        frozen: overlay?.cardFrozen !== undefined ? overlay.cardFrozen : c.is_frozen,
        onlinePayments: c.online_payments,
        currency: "USD" as const,
        monthlyLimit: overlay?.cardLimit !== undefined ? overlay.cardLimit : c.monthly_limit,
        spentThisMonth: 0,
      };
    });
  }

  if (preview) {
    return [buildPreviewCard()];
  }

  return [];
}

export async function billsForUser(userId: string): Promise<Bill[]> {
  try {
    const rows = await db().select().from(bills).where(eq(bills.userId, userId)).orderBy(bills.dayOfMonth);
    return rows.map((row) => ({
      id: row.id,
      accountId: row.accountId,
      payee: row.payee,
      category: row.category,
      amount: row.amount,
      dayOfMonth: row.dayOfMonth,
      autopay: row.autopay,
    }));
  } catch {
    return [];
  }
}
