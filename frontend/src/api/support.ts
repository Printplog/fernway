import { apiRequest } from "./client";

export interface SupportRealtimeConfig {
  enabled: boolean;
  key: string;
  cluster: string;
}

export interface SupportProfile {
  display_name: string;
  avatar_url: string | null;
}

export interface SupportTypingEvent {
  ticket_id: string;
  sender: "owner" | "customer";
  sender_name?: string;
  is_typing: boolean;
  sent_at?: number;
}

export interface SupportMessageEntry {
  id: string;
  direction: "customer" | "owner";
  body: string;
  delivery_status: string;
  created_at: string;
}

export interface SupportThread {
  id: string;
  tracking_id: string;
  customer_name: string;
  subject: string;
  status: "new" | "read" | "closed";
  created_at: string;
  updated_at: string;
  channel: string;
  conversation: SupportMessageEntry[];
  realtime?: SupportRealtimeConfig;
  support_profile?: SupportProfile;
}

export interface SupportListResponse {
  results: SupportThread[];
  realtime: SupportRealtimeConfig;
  support_profile?: SupportProfile;
}

export const listSupportThreads = () => apiRequest<SupportListResponse>("/support");

export const createSupportThread = (input: { subject: string; message: string }) =>
  apiRequest<SupportThread>("/support", { method: "POST", body: input });

export const sendSupportReply = (threadId: string, body: string) =>
  apiRequest<SupportMessageEntry>(`/support/${encodeURIComponent(threadId)}/replies`, {
    method: "POST",
    body: { body },
  });

export const sendSupportTyping = (threadId: string, isTyping: boolean) =>
  apiRequest<void>(`/support/${encodeURIComponent(threadId)}/typing`, {
    method: "POST",
    body: { is_typing: isTyping },
  });

export const authorizeSupportRealtime = (
  threadId: string,
  socketId: string,
  channelName: string,
) =>
  apiRequest<{ auth: string }>(`/support/${encodeURIComponent(threadId)}/realtime-auth`, {
    method: "POST",
    body: { socket_id: socketId, channel_name: channelName },
  });
