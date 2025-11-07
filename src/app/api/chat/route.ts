import { streamChatResponse } from "@/ai/response/stream-chat-response";

import type { ChatUIMessage } from "@/ai/messages/types";

type BodyData = {
  messages: ChatUIMessage[];
  openaiApiKey?: string;
};

export async function POST(request: Request) {
  const bodyData = (await request.json()) as BodyData;
  const { messages, openaiApiKey } = bodyData;

  return streamChatResponse(messages, openaiApiKey);
}
