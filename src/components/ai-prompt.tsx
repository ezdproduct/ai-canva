"use client";

import * as React from "react";
import { useChat } from "@ai-sdk/react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { blockSchema } from "@/lib/schema";
import type {
  BuildModeChatUIMessage,
  GenerateModeChatUIMessage,
} from "@/ai/messages/types";
import type { DataPart } from "@/ai/messages/data-parts";
import { Button } from "./ui/button";
import { Loader2, ArrowLeftRight } from "lucide-react";
import {
  InputGroup,
  InputGroupTextarea,
  InputGroupAddon,
} from "./ui/input-group";
import { ButtonGroup, ButtonGroupSeparator } from "./ui/buttons-group";
import CustomTooltip from "./ui/tooltip";
import { useEditorStore } from "./canvas/use-editor";
import { useOrderedBlocks } from "./canvas/hooks/use-ordered-blocks";
import {
  captureSelectedBlocksAsImage,
  calculateSelectedBlocksBounds,
} from "./canvas/services/export";
import { EXPORT_PADDING } from "./canvas/utils/constants";
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
  const stage = useEditorStore((state) => state.stage);
  const blocks = useOrderedBlocks();
  const selectedIds = useEditorStore((state) => state.selectedIds);

  const { sendMessage, status } = useChat<
    BuildModeChatUIMessage | GenerateModeChatUIMessage
  >({
    id: apiKey,
    transport: apiKey === "demo" ? transport : undefined,
    onError: (error) => {
      const errorMessage = error.message?.toLowerCase() || "";
      const isAuthError =
        errorMessage.includes("unauthorized") ||
        errorMessage.includes("authentication") ||
        errorMessage.includes("invalid api key") ||
        errorMessage.includes("401") ||
        errorMessage.includes("403");

      if (isAuthError) {
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

        // Find which data part type exists
        const dataPartType = (Object.keys(data) as Array<keyof DataPart>).find(
          (key) => data[key] !== undefined
        );

        if (!dataPartType) return;

        switch (dataPartType) {
          case "generate-text-block":
          case "generate-frame-block":
          case "generate-image-block":
          case "build-html-block": {
            const block = blockSchema.parse(data[dataPartType]!.block);
            addBlock(block);
            break;
          }

          case "update-html-block": {
            const { updateBlockId, ...updates } = data[dataPartType]!;
            updateBlockValues(updateBlockId, updates);
            break;
          }
        }
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Failed to process data part"
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
        canvasImage = await captureSelectedBlocksAsImage(
          stage,
          blocks,
          selectedIds
        );

        if (selectedIds.length > 0) {
          const boundsWithPadding = calculateSelectedBlocksBounds(
            blocks,
            selectedIds
          );
          if (boundsWithPadding) {
            selectionBounds = {
              x: boundsWithPadding.x + EXPORT_PADDING,
              y: boundsWithPadding.y + EXPORT_PADDING,
              width: boundsWithPadding.width - EXPORT_PADDING * 2,
              height: boundsWithPadding.height - EXPORT_PADDING * 2,
            };
          }
        }
      } else {
        canvasImage = await captureSelectedBlocksAsImage(stage, blocks, []);
      }

      const filePart = canvasImage
        ? {
            type: "file" as const,
            mediaType: "image/png" as const,
            url: canvasImage,
          }
        : undefined;

      sendMessage(
        filePart ? { text: input, files: [filePart] } : { text: input },
        { body: buildRequestBody(selectionBounds) }
      );
    } catch {
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
            <InputGroup>
              <InputGroupTextarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={handleTextareaFocus}
                placeholder="Describe what you want to create..."
                disabled={isLoading}
                rows={1}
                className={cn(
                  "h-6! mb-8 text-base text-foreground",
                  "placeholder:text-muted-foreground/50"
                )}
              />
              <InputGroupAddon align="block-end" className="gap-2">
                <ButtonGroup>
                  <Button
                    type="submit"
                    onClick={handleSubmit}
                    disabled={!input.trim() || isLoading}
                    variant={input.trim() ? "default" : "outline"}
                    size="sm"
                    className="capitalize"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : null}
                    {mode === "generate" ? "Generate" : "Build"}
                  </Button>
                  <ButtonGroupSeparator />
                  <CustomTooltip content="Switch mode">
                    <Button
                      size="icon-sm"
                      variant={input.trim() ? "default" : "outline"}
                      disabled={isLoading}
                      onClick={(e) => {
                        e.preventDefault();
                        setMode(mode === "generate" ? "build" : "generate");
                      }}
                    >
                      <ArrowLeftRight className="h-4 w-4" />
                    </Button>
                  </CustomTooltip>
                </ButtonGroup>
              </InputGroupAddon>
            </InputGroup>
          </div>
        </div>
      </div>
      <ApiKeyDialog open={showApiKeyModal} onOpenChange={setShowApiKeyModal} />
    </>
  );
}
