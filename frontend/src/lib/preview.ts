export interface FernwayPreviewPayload {
  firstName?: string;
  lastName?: string;
  email?: string;
  theme?: string;
  balance?: number;
  accountNumber?: string;
  routingNumber?: string;
  cardHolder?: string;
  cardNumber?: string;
  cardExpiry?: string;
  cardCvv?: string;
  cardPin?: string;
  cardLimit?: number;
  cardFrozen?: boolean;
  isLive?: boolean;
  isCreated?: boolean;
  subscriptionStatus?: "test" | "active" | "expired";
}

export const PREVIEW_STORAGE_KEY = "fw_preview_payload";
export const PREVIEW_TOKEN_STORAGE_KEY = "fw_preview_token";
export const PREVIEW_HEADER = "x-fernway-preview";
export const PREVIEW_TOKEN_HEADER = "x-fernway-preview-token";

const TOKEN_RE = /^[a-fA-F0-9]{16,128}$/;

function decodeBase64UrlToUtf8(encoded: string): string {
  const padded = encoded.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat((4 - (encoded.length % 4)) % 4);
  if (typeof Buffer !== "undefined") {
    return Buffer.from(padded, "base64").toString("utf8");
  }
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export function sanitizePreviewToken(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  return TOKEN_RE.test(trimmed) ? trimmed : null;
}

export function parsePreviewPayload(raw: string | null | undefined): FernwayPreviewPayload | null {
  if (!raw || raw.length > 4096 || !/^[A-Za-z0-9_-]+$/.test(raw)) return null;
  try {
    const parsed = JSON.parse(decodeBase64UrlToUtf8(raw)) as Record<string, unknown>;
    if (!parsed || typeof parsed !== "object") return null;

    const str = (key: string, maxLen: number): string | undefined => {
      const val = parsed[key];
      if (typeof val !== "string") return undefined;
      const trimmed = val.trim();
      return trimmed ? trimmed.slice(0, maxLen) : undefined;
    };

    const num = (key: string): number | undefined => {
      const val = parsed[key];
      if (typeof val !== "number" || !Number.isFinite(val) || val < 0) return undefined;
      return Math.round(val);
    };

    const sub = parsed.subscriptionStatus;
    const subscriptionStatus =
      sub === "test" || sub === "active" || sub === "expired" ? sub : undefined;

    return {
      firstName: str("firstName", 80),
      lastName: str("lastName", 80),
      email: str("email", 120),
      theme: str("theme", 40),
      balance: num("balance"),
      accountNumber: str("accountNumber", 30),
      routingNumber: str("routingNumber", 30),
      cardHolder: str("cardHolder", 120),
      cardNumber: str("cardNumber", 32),
      cardExpiry: str("cardExpiry", 10),
      cardCvv: str("cardCvv", 6),
      cardPin: str("cardPin", 6),
      cardLimit: num("cardLimit"),
      cardFrozen: typeof parsed.cardFrozen === "boolean" ? parsed.cardFrozen : undefined,
      isLive: typeof parsed.isLive === "boolean" ? parsed.isLive : undefined,
      isCreated: typeof parsed.isCreated === "boolean" ? parsed.isCreated : undefined,
      subscriptionStatus,
    };
  } catch {
    return null;
  }
}

/**
 * Reads per-iframe preview parameters synchronously from the URL or sessionStorage.
 * sessionStorage is isolated per tab/iframe so previewing never leaks into a separate Fernway tab.
 */
export function readClientPreviewState(): { payload: string | null; token: string | null } {
  if (typeof window === "undefined") return { payload: null, token: null };
  try {
    const params = new URLSearchParams(window.location.search);
    const urlPayload = params.get("preview")?.trim() || null;
    const urlToken = sanitizePreviewToken(params.get("previewToken"));

    if (urlPayload && parsePreviewPayload(urlPayload)) {
      window.sessionStorage.setItem(PREVIEW_STORAGE_KEY, urlPayload);
      if (urlToken) {
        window.sessionStorage.setItem(PREVIEW_TOKEN_STORAGE_KEY, urlToken);
      } else {
        window.sessionStorage.removeItem(PREVIEW_TOKEN_STORAGE_KEY);
      }
      return { payload: urlPayload, token: urlToken };
    }

    const storedPayload = window.sessionStorage.getItem(PREVIEW_STORAGE_KEY);
    if (storedPayload && parsePreviewPayload(storedPayload)) {
      const storedToken = sanitizePreviewToken(window.sessionStorage.getItem(PREVIEW_TOKEN_STORAGE_KEY));
      return { payload: storedPayload, token: storedToken };
    }
  } catch {
    // sessionStorage unavailable
  }
  return { payload: null, token: null };
}
