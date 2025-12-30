import { useMemo, useCallback } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import LayoutController from "../controls/layout-controller";
import TextController from "../controls/text-controller";
import LayerController from "../controls/layer-controller";
import CanvasController from "../controls/canvas-controller";
import { useEditorStore } from "../use-editor";
import type { IEditorBlockText, IEditorBlocks } from "@/lib/schema";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, ImageDown, ClipboardCopy, LayersIcon } from "lucide-react";
import { toast } from "sonner";
import { useOrderedBlocks } from "../hooks/use-ordered-blocks";
import { useShallow } from "zustand/react/shallow";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BlockItem } from "./block-item";

function EditorLeftSide({ className }: { className?: string }) {
  // Select separately to avoid creating new array references
  const selectedIds = useEditorStore((state) => state.selectedIds);
  const blocksById = useEditorStore((state) => state.blocksById);
  const [
    setHoveredId,
    updateBlockValues,
    duplicateBlock,
    deleteBlock,
    showHideBlock,
    bringForwardBlock,
    bringBackwardBlock,
    bringToTopBlock,
    bringToBackBlock,
    setSelectedIds,
  ] = useEditorStore(
    useShallow((state) => [
      state.setHoveredId,
      state.updateBlockValues,
      state.duplicateBlock,
      state.deleteBlock,
      state.showHideBlock,
      state.bringForwardBlock,
      state.bringBackwardBlock,
      state.bringToTopBlock,
      state.bringToBackBlock,
      state.setSelectedIds,
    ])
  );

  const handleSelect = useCallback(
    (block: IEditorBlocks) => {
      if (!block.visible) {
        return;
      }
      setSelectedIds([block.id]);
    },
    [setSelectedIds]
  );

  const downloadImage = useEditorStore((state) => state.downloadImage);
  const blocks = useOrderedBlocks();
  const [canvasSize, canvasBackground] = useEditorStore(
    useShallow((state) => [state.canvas.size, state.canvas.background])
  );

  const handleCopyJson = useCallback(async () => {
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

  // Compute active block with stable reference
  const activeBlock = useMemo(() => {
    if (selectedIds.length === 1) {
      return blocksById[selectedIds[0]] ?? null;
    }
    return null;
  }, [selectedIds, blocksById]);
  const blockType = activeBlock?.type ?? null;

  return (
    <div
      className={cn(
        "fixed left-3 top-3 bottom-3 z-20 hidden md:flex w-64 flex-col border border-border/50 bg-background/95 backdrop-blur shadow-xl rounded-[1.25rem] overflow-hidden",
        className
      )}
    >
      <Tabs defaultValue="design" className="flex flex-col h-full">
        <div className="p-4 border-b flex justify-between items-center bg-card/50">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="design">Design</TabsTrigger>
            <TabsTrigger value="layers">Layers</TabsTrigger>
          </TabsList>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="outline" className="h-8 gap-2 ml-2">
                <Download className="h-3.5 w-3.5" />
                <span className="text-xs">Xuất ảnh</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem
                onClick={() => {
                  void downloadImage();
                }}
              >
                <ImageDown className="mr-2 h-4 w-4" />
                Export as image
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  void handleCopyJson();
                }}
              >
                <ClipboardCopy className="mr-2 h-4 w-4" />
                Copy as JSON
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <TabsContent value="design" className="flex-1 min-h-0 mt-0">
          <ScrollArea className="h-full">
            <div className="p-4 flex flex-col gap-4">
              {activeBlock && blockType ? (
                <>
                  <LayoutController blockId={activeBlock.id} />
                  {blockType === "text" ? (
                    <TextController
                      blockId={activeBlock.id}
                      block={activeBlock as IEditorBlockText}
                    />
                  ) : null}
                  {blockType !== "text" && <LayerController blockId={activeBlock.id} />}
                </>
              ) : (
                <CanvasController />
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="layers" className="flex-1 min-h-0 mt-0">
          <ScrollArea className="h-full">
            <div className="p-2">
              {blocks.map((block) => (
                <BlockItem
                  key={block.id}
                  block={block}
                  selected={selectedIds.length === 1 && selectedIds[0] === block.id}
                  onSelectBlock={handleSelect}
                  onHoverChange={(hovered: boolean) => setHoveredId(hovered ? block.id : null)}
                  onRename={(id: string, label: string) => updateBlockValues(id, { label })}
                  onDuplicate={duplicateBlock}
                  onDelete={deleteBlock}
                  onToggleVisibility={showHideBlock}
                  onBringForward={bringForwardBlock}
                  onBringBackward={bringBackwardBlock}
                  onBringToFront={bringToTopBlock}
                  onBringToBack={bringToBackBlock}
                />
              ))}
              {blocks.length === 0 && (
                <div className="flex flex-col items-center justify-center p-8 text-muted-foreground">
                  <LayersIcon className="h-8 w-8 mb-2 opacity-50" />
                  <p className="text-sm">No layers yet</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default EditorLeftSide;
