import { streamChatResponse } from "@/ai/response/stream-chat-response";

import type { ChatUIMessage } from "@/ai/messages/types";
import type { SelectionBounds } from "@/lib/types";

type BodyData = {
  messages: ChatUIMessage[];
  openaiApiKey?: string;
  mode?: "generate" | "build";
  selectionBounds?: SelectionBounds;
};

export async function POST(request: Request) {
  const bodyData = (await request.json()) as BodyData;
  const { messages, openaiApiKey, mode, selectionBounds } = bodyData;

  return streamChatResponse(messages, openaiApiKey, mode, selectionBounds);
}
