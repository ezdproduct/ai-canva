"use client";

import * as React from "react";
import { useChat } from "@ai-sdk/react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { blockSchema } from "@/lib/schema";
import type { z } from "zod";
import type { ChatUIMessage } from "@/ai/messages/types";
import type { DataPart } from "@/ai/messages/data-parts";
import type { IEditorBlockHtml } from "@/lib/schema";
import { Button } from "./ui/button";
import { Loader2, Send } from "lucide-react";
import { useEditorStore } from "./canvas/use-editor";
import { useOrderedBlocks } from "./canvas/hooks/use-ordered-blocks";
import {
  captureSelectedBlocksAsImage,
  calculateSelectedBlocksBounds,
} from "./canvas/services/export";
import type { SelectionBounds } from "@/lib/types";
import { ApiKeyDialog, OPENAI_API_KEY_STORAGE_KEY } from "./api-key-dialog";
import { transport } from "./demo-transport";
import { useLocalStorage } from "@/hooks/use-local-storage";

export default function AIPrompt() {
  const [input, setInput] = React.useState("");
  const [mode, setMode] = React.useState<"generate" | "build">("generate");
  const [showApiKeyModal, setShowApiKeyModal] = React.useState(false);
  const [apiKey, , removeApiKey] = useLocalStorage<string>(
    OPENAI_API_KEY_STORAGE_KEY,
    ""
  );
  const addBlock = useEditorStore((state) => state.addBlock);
  const updateBlockValues = useEditorStore((state) => state.updateBlockValues);
  const blockOrder = useEditorStore((state) => state.blockOrder);
  const stage = useEditorStore((state) => state.stage);
  const blocks = useOrderedBlocks();
  const selectedIds = useEditorStore((state) => state.selectedIds);

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
        let shouldUpdate = false;
        let updateBlockId: string | undefined;

        if (data["generate-text-block"]) {
          block = data["generate-text-block"].block;
        } else if (data["generate-frame-block"]) {
          block = data["generate-frame-block"].block;
        } else if (data["generate-image-block"]) {
          block = data["generate-image-block"].block;
        } else if (data["add-html-to-canvas"]) {
          block = data["add-html-to-canvas"].block;
          const htmlData = data["add-html-to-canvas"];
          if (htmlData.status === "loading") {
            // Create loading block
            shouldUpdate = false;
          } else if (htmlData.status === "done") {
            // Check if we should update an existing loading block
            if (htmlData.updateBlockId) {
              // Explicit updateBlockId provided
              shouldUpdate = true;
              updateBlockId = htmlData.updateBlockId;
            } else {
              // Find the most recent HTML block with loading content
              // Use blockOrder to get proper creation order
              const loadingHtmlBlocks = blocks
                .filter((b) => b.type === "html")
                .filter((b) => {
                  const htmlBlock = b as IEditorBlockHtml;
                  // Check if it's the loading HTML by looking for the spinner class
                  return (
                    htmlBlock.html.includes("spinner") &&
                    htmlBlock.html.includes("Generating HTML...")
                  );
                })
                .sort((a, b) => {
                  // Sort by creation order using blockOrder
                  const aIndex = blockOrder.indexOf(a.id);
                  const bIndex = blockOrder.indexOf(b.id);
                  return bIndex - aIndex; // Most recent first
                });

              if (loadingHtmlBlocks.length > 0) {
                // Update the most recent loading block
                shouldUpdate = true;
                updateBlockId = loadingHtmlBlocks[0].id;
              }
            }
          }
        }

        if (block) {
          const validatedBlock = blockSchema.parse(block);
          if (shouldUpdate && updateBlockId) {
            // Update existing block (loading -> done)
            updateBlockValues(updateBlockId, validatedBlock);
          } else {
            // Create new block
            addBlock(validatedBlock);
          }
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

    const buildRequestBody = (selectionBounds?: SelectionBounds | null) => ({
      ...(apiKey ? { openaiApiKey: apiKey } : {}),
      mode,
      ...(selectionBounds ? { selectionBounds } : {}),
    });

    try {
      let canvasImage: string | null = null;
      let selectionBounds: SelectionBounds | null = null;

      if (mode === "build") {
        // In build mode, capture only selected blocks (or full canvas if no selection)
        canvasImage = await captureSelectedBlocksAsImage(
          stage,
          blocks,
          selectedIds
        );

        // Calculate selection bounds for positioning (without padding)
        if (selectedIds.length > 0) {
          const boundsWithPadding = calculateSelectedBlocksBounds(
            blocks,
            selectedIds
          );
          if (boundsWithPadding) {
            // Remove padding to get actual selection bounds
            const EXPORT_PADDING = 20;
            selectionBounds = {
              x: boundsWithPadding.x + EXPORT_PADDING,
              y: boundsWithPadding.y + EXPORT_PADDING,
              width: boundsWithPadding.width - EXPORT_PADDING * 2,
              height: boundsWithPadding.height - EXPORT_PADDING * 2,
            };
          }
        }
      } else {
        // In generate mode, capture full canvas (no selection = empty array)
        canvasImage = await captureSelectedBlocksAsImage(stage, blocks, []);
      }

      const filePart = canvasImage
        ? {
            type: "file" as const,
            mediaType: "image/png" as const,
            url: canvasImage,
          }
        : undefined;

      // Send message with or without image
      sendMessage(
        filePart ? { text: input, files: [filePart] } : { text: input },
        { body: buildRequestBody(selectionBounds) }
      );
    } catch (error) {
      console.error("Failed to capture canvas image:", error);
      // Fallback: send without image
      sendMessage({ text: input }, { body: buildRequestBody() });
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
            <div className="flex gap-2 items-center">
              <select
                value={mode}
                onChange={(e) =>
                  setMode(e.target.value as "generate" | "build")
                }
                disabled={isLoading}
                className={cn(
                  "px-3 py-2 text-sm rounded-xl border border-border bg-background",
                  "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1",
                  "disabled:cursor-not-allowed disabled:opacity-50"
                )}
              >
                <option value="generate">Generate</option>
                <option value="build">Build</option>
              </select>
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
