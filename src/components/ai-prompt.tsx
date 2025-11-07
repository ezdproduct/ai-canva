"use client";

import * as React from "react";
import { useChat } from "@ai-sdk/react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { blockSchema } from "@/lib/schema";
import type { z } from "zod";
import type { ChatUIMessage } from "@/ai/messages/types";
import type { DataPart } from "@/ai/messages/data-parts";
import { Button } from "./ui/button";
import { Loader2, Send } from "lucide-react";
import { useEditorStore } from "./canvas/use-editor";
import { useOrderedBlocks } from "./canvas/hooks/use-ordered-blocks";
import { captureStageAsImage } from "./canvas/services/export";
import { ApiKeyDialog, OPENAI_API_KEY_STORAGE_KEY } from "./api-key-dialog";
import { transport } from "./demo-transport";
import { useLocalStorage } from "@/hooks/use-local-storage";

export default function AIPrompt() {
  const [input, setInput] = React.useState("");
  const [showApiKeyModal, setShowApiKeyModal] = React.useState(false);
  const [apiKey, , removeApiKey] = useLocalStorage<string>(
    OPENAI_API_KEY_STORAGE_KEY,
    ""
  );
  const addBlock = useEditorStore((state) => state.addBlock);
  const stage = useEditorStore((state) => state.stage);
  const blocks = useOrderedBlocks();

  const { sendMessage, status } = useChat<ChatUIMessage>({
    id: apiKey,
    transport: apiKey === "demo" ? transport : undefined,
    onError: (error) => {
      // Check if error is authentication-related
      const errorMessage = error.message?.toLowerCase() || "";
      const isAuthError =
        errorMessage.includes("unauthorized") ||
        errorMessage.includes("authentication") ||
        errorMessage.includes("invalid api key") ||
        errorMessage.includes("401") ||
        errorMessage.includes("403");

      if (isAuthError) {
        // Remove invalid key from localStorage
        removeApiKey();
        toast.error("Invalid API key. Please enter a valid OpenAI API key.");
        setShowApiKeyModal(true);
      } else {
        toast.error(error.message || "Failed to generate block");
      }
    },
    onData: (dataPart) => {
      try {
        const data = dataPart.data as DataPart;
        let block: z.infer<typeof blockSchema> | undefined;

        if (data["generate-text-block"]) {
          block = data["generate-text-block"].block;
        } else if (data["generate-frame-block"]) {
          block = data["generate-frame-block"].block;
        } else if (data["generate-image-block"]) {
          block = data["generate-image-block"].block;
        }

        if (block) {
          const validatedBlock = blockSchema.parse(block);
          addBlock(validatedBlock);
        }
      } catch (err) {
        console.error("Failed to add generated block:", err, dataPart);
        toast.error(
          err instanceof Error ? err.message : "Failed to add generated block"
        );
      }
    },
  });

  const isLoading = status === "submitted" || status === "streaming";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    try {
      // Capture canvas as image before sending
      const canvasImage = await captureStageAsImage(stage, blocks);

      if (canvasImage) {
        // Create FileUIPart object with mediaType, url, and type
        const filePart = {
          type: "file" as const,
          mediaType: "image/png" as const,
          url: canvasImage,
        };

        // Send message with canvas image attached
        sendMessage(
          {
            text: input,
            files: [filePart],
          },
          {
            body: apiKey ? { openaiApiKey: apiKey } : undefined,
          }
        );
      } else {
        // Fallback: send without image if capture fails
        sendMessage(
          { text: input },
          {
            body: apiKey ? { openaiApiKey: apiKey } : undefined,
          }
        );
      }
    } catch (error) {
      console.error("Failed to capture canvas image:", error);
      // Fallback: send without image
      sendMessage(
        { text: input },
        {
          body: apiKey ? { openaiApiKey: apiKey } : undefined,
        }
      );
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleTextareaFocus = () => {
    if (!apiKey) {
      setShowApiKeyModal(true);
    }
  };

  return (
    <>
      <div className="fixed bottom-3 left-1/2 z-50 w-full max-w-2xl -translate-x-1/2">
        <div className="mx-4 rounded-3xl border border-border/50 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80 shadow-2xl">
          <div className="pt-5 p-3">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={handleTextareaFocus}
              placeholder="Describe your 3D object or scene..."
              disabled={isLoading}
              rows={1}
              className={cn(
                "w-full bg-transparent h-6! mb-8 pl-2 text-base text-foreground outline-none resize-none",
                "placeholder:text-muted-foreground/50",
                "disabled:cursor-not-allowed disabled:opacity-50"
              )}
            />
            <div className="flex gap-2">
              <Button
                type="submit"
                onClick={handleSubmit}
                disabled={!input.trim() || isLoading}
                size="icon"
                variant={input.trim() ? "default" : "outline"}
                className="w-10 h-10 p-0 rounded-xl ml-auto"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5 -rotate-90" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
      <ApiKeyDialog open={showApiKeyModal} onOpenChange={setShowApiKeyModal} />
    </>
  );
}
