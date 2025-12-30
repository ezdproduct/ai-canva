import * as React from "react";
import {
  Loader2,
  Send,
  Sparkles,
  SettingsIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/mode-toggle";
import { ApiKeyDialog, GATEWAY_API_KEY_STORAGE_KEY } from "../../api-key-dialog";
import { useEditorStore } from "../use-editor";
import { useShallow } from "zustand/react/shallow";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { useChat } from "@ai-sdk/react";
import { toast } from "sonner";
import { blockSchema } from "@/lib/schema";
import type {
  BuildModeChatUIMessage,
  GenerateModeChatUIMessage,
} from "@/ai/messages/types";
import type { DataPart } from "@/ai/messages/data-parts";
import {
  InputGroup,
  InputGroupTextarea,
  InputGroupAddon,
  InputGroupButton,
} from "@/components/ui/input-group";
import {
  captureSelectedBlocksAsImage,
  calculateSelectedBlocksBounds,
} from "../services/export";
import { EXPORT_PADDING } from "../utils/constants";
import type { SelectionBounds } from "@/lib/types";
import { transport } from "../../demo-transport";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useOrderedBlocks } from "../hooks/use-ordered-blocks";

function EditorRightSide({ className }: { className?: string }) {
  const [showApiKeyDialog, setShowApiKeyDialog] = React.useState(false);
  const blocks = useOrderedBlocks();
  const selectedIds = useEditorStore((state) => state.selectedIds);
  const stage = useEditorStore((state) => state.stage);
  const addBlock = useEditorStore((state) => state.addBlock);
  const updateBlockValues = useEditorStore((state) => state.updateBlockValues);

  // AI Prompt state
  const [input, setInput] = React.useState("");
  const [apiKey, , removeApiKey] = useLocalStorage<string>(
    GATEWAY_API_KEY_STORAGE_KEY,
    ""
  );

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
        toast.error(
          "Invalid API key. Please enter a valid Vercel Gateway API key."
        );
        setShowApiKeyDialog(true);
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

  const handleSubmit = React.useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!input.trim() || isLoading) return;

      const buildRequestBody = (selectionBounds?: SelectionBounds | null) => ({
        ...(apiKey ? { gatewayApiKey: apiKey } : {}),
        ...(selectionBounds ? { selectionBounds } : {}),
      });

      try {
        // Always capture canvas image for backend to determine mode
        const canvasImage = await captureSelectedBlocksAsImage(
          stage,
          blocks,
          selectedIds
        );

        let selectionBounds: SelectionBounds | null = null;
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
        setInput("");
      } catch {
        sendMessage({ text: input }, { body: buildRequestBody() });
        setInput("");
      }
    },
    [
      input,
      isLoading,
      apiKey,
      sendMessage,
      stage,
      blocks,
      selectedIds,
      setInput,
    ]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [input]);

  return (
    <div className={cn("fixed right-3 top-3 bottom-3 z-20 hidden md:flex w-64 flex-col border border-border/50 bg-background/95 backdrop-blur shadow-xl rounded-[1.25rem] overflow-hidden", className)}>
      <div className="p-4 border-b flex items-center gap-2">
        <Sparkles className="size-4 text-purple-500" />
        <span className="font-semibold text-sm">AI Assistant</span>
      </div>

      <div className="flex-1 p-4 flex flex-col gap-4">
        <div className="flex-1 overflow-y-auto min-h-0">
          <p className="text-sm text-muted-foreground">
            Describe what you want to create or edit. You can select elements on the canvas to reference them in your prompt.
          </p>
        </div>

        <InputGroup className="w-full">
          <InputGroupTextarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe what to create..."
            disabled={isLoading}
            rows={3}
            className={cn(
              "min-h-[80px] max-h-[200px] text-foreground p-3 resize-none",
              "placeholder:text-muted-foreground/50"
            )}
          />
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              variant="secondary"
              type="submit"
              onClick={handleSubmit}
              disabled={isLoading}
              className="h-8 w-8"
            >
              {isLoading ? (
                <Loader2 className="animate-spin size-4" />
              ) : (
                <Send className="size-4" />
              )}
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </div>

      <div className="border-t border-border p-2 flex items-center justify-between gap-2">
        <div>
          <Button variant="outline" size="icon" asChild>
            <Link href="https://github.com/kyh/ai-canvas">
              <span className="sr-only">GitHub</span>
              <GitHubLogoIcon className="size-5" />
            </Link>
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <ModeToggle />
          <Button
            variant="outline"
            size="icon"
            className="size-10"
            onClick={() => setShowApiKeyDialog(true)}
          >
            <SettingsIcon className="size-5" />
          </Button>
        </div>
      </div>
      <ApiKeyDialog
        open={showApiKeyDialog}
        onOpenChange={setShowApiKeyDialog}
      />
    </div>
  );
}

export default EditorRightSide;
