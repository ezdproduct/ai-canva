import * as React from "react";
import {
  Download,
  ImageDown,
  ClipboardCopy,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useEditorStore } from "../use-editor";
import { useShallow } from "zustand/react/shallow";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useOrderedBlocks } from "../hooks/use-ordered-blocks";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AiChatPanel } from "./ai-chat-panel";

function EditorRightSide({ className }: { className?: string }) {
  const blocks = useOrderedBlocks();

  // Export Logic
  const downloadImage = useEditorStore((state) => state.downloadImage);
  const [canvasSize, canvasBackground] = useEditorStore(
    useShallow((state) => [state.canvas.size, state.canvas.background])
  );

  const handleCopyJson = React.useCallback(async () => {
    const serialized = JSON.stringify(
      {
        blocks,
        size: canvasSize,
        background: canvasBackground,
      },
      null,
      2
    );

    if (
      typeof navigator === "undefined" ||
      !navigator.clipboard ||
      typeof navigator.clipboard.writeText !== "function"
    ) {
      toast.error("Clipboard is not available in this environment.");
      return;
    }

    try {
      await navigator.clipboard.writeText(serialized);
      toast.success("Canvas JSON copied to clipboard.");
    } catch (error) {
      console.error("Failed to copy canvas JSON", error);
      toast.error("Failed to copy JSON to clipboard.");
    }
  }, [blocks, canvasBackground, canvasSize]);

  return (
    <div className={cn("fixed right-3 top-3 bottom-3 z-20 hidden md:flex w-64 flex-col gap-3", className)}>
      {/* Export Section */}
      <div className="bg-background/95 backdrop-blur shadow-xl rounded-[1.25rem] border border-border/50 p-1 shrink-0">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="lg" className="w-full gap-2 font-semibold h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm">
              <Download className="h-4 w-4" />
              <span>Export Design</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem
              className="cursor-pointer py-2.5"
              onClick={() => {
                void downloadImage();
              }}
            >
              <ImageDown className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>Export as Image</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer py-2.5"
              onClick={() => {
                void handleCopyJson();
              }}
            >
              <ClipboardCopy className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>Copy as JSON</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* AI Assistant Section */}
      <AiChatPanel />
    </div>
  );
}

export default EditorRightSide;
