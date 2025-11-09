import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  stepCountIs,
  streamText,
} from "ai";

import type { ChatUIMessage } from "../messages/types";
import type { SelectionBounds } from "@/lib/types";
import { generateTools, buildTools } from "../tools";
import generatePrompt from "./stream-chat-response-prompt.md";
import buildPrompt from "./stream-chat-response-build-prompt.md";

export const streamChatResponse = (
  messages: ChatUIMessage[],
  openaiApiKey?: string,
  mode: "generate" | "build" = "generate",
  selectionBounds?: SelectionBounds
) => {
  const systemPrompt = mode === "build" ? buildPrompt : generatePrompt;

  return createUIMessageStreamResponse({
    stream: createUIMessageStream({
      originalMessages: messages,
      execute: ({ writer }) => {
        const tools =
          mode === "build"
            ? buildTools({ writer, selectionBounds })
            : generateTools({ writer });

        const result = streamText({
          model: "xai/grok-4-fast-non-reasoning",
          system: systemPrompt,
          messages: convertToModelMessages(messages),
          stopWhen: stepCountIs(20),
          toolChoice: "required",
          tools,
          onError: (error) => {
            console.error("Error communicating with AI");
            console.error(JSON.stringify(error, null, 2));
          },
        });
        void result.consumeStream();
        writer.merge(
          result.toUIMessageStream({
            sendReasoning: true,
          })
        );
      },
    }),
  });
};
