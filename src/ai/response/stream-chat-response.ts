import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  stepCountIs,
  streamText,
} from "ai";
import { createOpenAI } from "@ai-sdk/openai";

import type { ChatUIMessage } from "../messages/types";
import { tools } from "../tools";
import prompt from "./stream-chat-response-prompt.md";

export const streamChatResponse = (
  messages: ChatUIMessage[],
  openaiApiKey?: string
) => {
  const openai = createOpenAI({
    apiKey: openaiApiKey || process.env.OPENAI_API_KEY,
  });

  return createUIMessageStreamResponse({
    stream: createUIMessageStream({
      originalMessages: messages,
      execute: ({ writer }) => {
        const result = streamText({
          model: "xai/grok-4-fast-non-reasoning",
          system: prompt,
          messages: convertToModelMessages(messages),
          stopWhen: stepCountIs(20),
          toolChoice: "required",
          tools: tools({ writer }),
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
