"use client";

import * as React from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { cn } from "@/lib/utils";
import type { EditorContextType } from "./canvas/use-editor";
import { blockSchema } from "@/lib/schema";
import type { CustomUIMessage } from "@/lib/ai-tools";
import { v4 as uuid } from "uuid";
import { Button } from "./ui/button";
import { Loader2, Send, X } from "lucide-react";

interface AIPromptProps {
  editor: EditorContextType;
}

export default function AIPrompt({ editor }: AIPromptProps) {
  const [input, setInput] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [isExpanded, setIsExpanded] = React.useState(false);

  const { sendMessage, status } = useChat<CustomUIMessage>({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
    onError: (error) => {
      setError(error.message || "Failed to generate block");
    },
    onToolCall: async ({ toolCall }) => {
      try {
        // With CustomUIMessage, toolCall.input is now properly typed based on the tool's inputSchema
        // The type is automatically inferred from the tool definition
        const blockInput = toolCall.input as Record<string, unknown>;

        // Add ID to the block (same as server-side execute function)
        const blockWithId = {
          ...blockInput,
          id: uuid(),
        };

        // Validate the block structure with ID
        const validatedBlock = blockSchema.parse(blockWithId);

        // Add the validated block to the canvas
        editor.addBlock(validatedBlock);
        setError(null);
      } catch (err) {
        console.error("Failed to add generated block:", err, toolCall);
        setError(
          err instanceof Error ? err.message : "Failed to add generated block"
        );
      }
    },
  });

  const isLoading = status === "submitted" || status === "streaming";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    setError(null);
    sendMessage({ text: input });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div
      className={cn(
        "fixed bottom-4 left-1/2 z-50 w-full max-w-2xl -translate-x-1/2 transform transition-all duration-200 ease-out",
        isExpanded ? "translate-y-0" : "translate-y-0"
      )}
    >
      <div className="mx-4 rounded-lg border border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80 shadow-lg">
        {error && (
          <div className="flex items-center justify-between border-b border-border bg-destructive/10 px-4 py-2 text-sm text-destructive">
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="hover:text-destructive/80"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex items-end gap-2 p-4">
          <div className="flex-1">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsExpanded(true)}
              placeholder="Describe the design you want to generate... (e.g., 'Create a modern landing page with a hero section, features list, and footer')"
              disabled={isLoading}
              rows={isExpanded ? 3 : 1}
              className={cn(
                "w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm",
                "placeholder:text-muted-foreground",
                "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                "disabled:cursor-not-allowed disabled:opacity-50",
                "transition-all duration-200 ease-out"
              )}
            />
          </div>
          <Button
            type="submit"
            disabled={!input.trim() || isLoading}
            size="icon"
            className="h-9 w-9 shrink-0"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
        {isExpanded && !isLoading && (
          <div className="border-t border-border px-4 py-2 text-xs text-muted-foreground">
            Press Enter to generate, Shift+Enter for new line
          </div>
        )}
      </div>
    </div>
  );
}
