import { useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import LayoutController from "../controls/layout-controller";
import TextController from "../controls/text-controller";
import LayerController from "../controls/layer-controller";
import CanvasController from "../controls/canvas-controller";
import { useEditorStore } from "../use-editor";
import type { IEditorBlockText, IEditorBlocks } from "@/lib/schema";
import { useOrderedBlocks } from "../hooks/use-ordered-blocks";
import { useShallow } from "zustand/react/shallow";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BlockItem } from "./block-item";
import { LayoutTemplate, Layers, Palette, Upload } from "lucide-react";
import { TEMPLATES } from "../data/templates";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";


import { useImportDesign } from "../hooks/use-import-design";

function EditorLeftSide({ className }: { className?: string }) {
  // Select separately to avoid creating new array references
  const selectedIds = useEditorStore((state) => state.selectedIds);
  const blocksById = useEditorStore((state) => state.blocksById);
  const loadTemplate = useEditorStore((state) => state.loadTemplate);

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
    toggleLockBlock,
    reorderBlock,
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
      state.toggleLockBlock,
      state.reorderBlock,
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

  const blocks = useOrderedBlocks();

  // Compute active block with stable reference
  const activeBlock = useMemo(() => {
    if (selectedIds.length === 1) {
      return blocksById[selectedIds[0]] ?? null;
    }
    return null;
  }, [selectedIds, blocksById]);
  const blockType = activeBlock?.type ?? null;

  // Import Logic
  const { importInputRef, triggerImport, handleFileChange } = useImportDesign();

  return (
    <div
      className={cn(
        "fixed left-3 top-3 bottom-3 z-20 hidden md:flex w-64 flex-col gap-3",
        className
      )}
    >
      {/* Design/Layers Section */}
      <div className="flex-1 flex flex-col border border-border/50 bg-background/95 backdrop-blur shadow-xl rounded-[1.25rem] overflow-hidden min-h-0">
        <Tabs defaultValue="design" className="flex flex-col h-full">
          <div className="p-1 border-b border-border/50 bg-muted/30">
            <TabsList className="grid w-full grid-cols-3 h-9 p-1 bg-muted/50">
              <TabsTrigger value="design" className="gap-2 text-xs font-medium">
                <Palette className="h-3.5 w-3.5" />
                Design
              </TabsTrigger>
              <TabsTrigger value="templates" className="gap-2 text-xs font-medium">
                <LayoutTemplate className="h-3.5 w-3.5" />
                Wait
              </TabsTrigger>
              <TabsTrigger value="layers" className="gap-2 text-xs font-medium">
                <Layers className="h-3.5 w-3.5" />
                Layers
              </TabsTrigger>
            </TabsList>
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

          <TabsContent value="templates" className="flex-1 min-h-0 mt-0">
            <ScrollArea className="h-full">
              <div className="p-4 grid grid-cols-1 gap-3">
                {Object.entries(TEMPLATES).map(([key, template]) => (
                  <Card
                    key={key}
                    className="cursor-pointer hover:border-primary/50 transition-colors overflow-hidden group"
                    onClick={() => {
                      loadTemplate(template);
                      toast.success(`Loaded template: ${key.replace("_", " ")}`);
                    }}
                  >
                    <div className="aspect-video bg-muted relative p-4 flex items-center justify-center">
                      <div className="absolute inset-0 bg-muted/20 group-hover:bg-primary/5 transition-colors" />
                      {/* Simple preview visualization */}
                      <div
                        style={{
                          backgroundColor: template.background,
                          aspectRatio: `${template.size.width}/${template.size.height}`,
                          height: '60%'
                        }}
                        className="shadow-sm border border-border/10 rounded-sm relative"
                      >
                        <div className="absolute inset-0 flex items-center justify-center opacity-20">
                          <LayoutTemplate className="w-8 h-8 text-foreground" />
                        </div>
                      </div>
                    </div>
                    <div className="p-3">
                      <h3 className="text-xs font-medium capitalize text-foreground/90">
                        {key.split('_').join(' ')}
                      </h3>
                      <p className="text-[10px] text-muted-foreground">
                        {template.size.width} x {template.size.height}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="layers" className="flex-1 min-h-0 mt-0">
            <ScrollArea className="h-full">
              <div
                className="p-2 min-h-full"
                onDragOver={(e) => {
                  e.preventDefault();
                  e.dataTransfer.dropEffect = "move";
                }}
              >
                {blocks.map((block, index) => (
                  <BlockItem
                    key={block.id}
                    block={block}
                    selected={selectedIds.length === 1 && selectedIds[0] === block.id}
                    draggable={true}
                    onDragStart={(e) => {
                      e.dataTransfer.setData("text/plain", block.id);
                      e.dataTransfer.effectAllowed = "move";
                      // Using a small delay to allow ghost image to be created before making element transparent/dragging state
                      requestAnimationFrame(() => {
                        // Optional: Visual feedback handling if needed locally
                      });
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                      // Implement reordering visual indicator if feasible, or just rely on drop
                      e.dataTransfer.dropEffect = "move";
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      const draggedId = e.dataTransfer.getData("text/plain");
                      if (draggedId && draggedId !== block.id) {
                        // Reorder
                        // Calculate new index.
                        // For simplicity, we drop *before* the target if dropping on top half, or we just swap their orders in the underlying array logic.
                        // But use-editor's 'reorderBlock' takes (id, newIndex).
                        // We need to find the index of the target block 'block.id' (which is 'index' in this map loop).
                        reorderBlock(draggedId, index);
                      }
                    }}
                    onSelectBlock={handleSelect}
                    onHoverChange={(hovered: boolean) => setHoveredId(hovered ? block.id : null)}
                    onRename={(id: string, label: string) => updateBlockValues(id, { label })}
                    onDuplicate={duplicateBlock}
                    onDelete={deleteBlock}
                    onToggleVisibility={showHideBlock}
                    onToggleLock={toggleLockBlock}
                    onBringForward={bringForwardBlock}
                    onBringBackward={bringBackwardBlock}
                    onBringToFront={bringToTopBlock}
                    onBringToBack={bringToBackBlock}
                  />
                ))}
                {blocks.length === 0 && (
                  <div className="flex flex-col items-center justify-center p-8 text-muted-foreground">
                    <Layers className="h-8 w-8 mb-2 opacity-50" />
                    <p className="text-sm">No layers yet</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>

      {/* Import Section */}
      <div className="bg-background/95 backdrop-blur shadow-xl rounded-[1.25rem] border border-border/50 p-1 shrink-0">
        <Button
          size="lg"
          variant="secondary"
          className="w-full gap-2 font-semibold h-12 rounded-xl shadow-sm bg-muted/50 hover:bg-muted/80 text-foreground"
          onClick={triggerImport}
        >
          <Upload className="h-4 w-4" />
          <span>Import Design</span>
        </Button>
        <input
          type="file"
          ref={importInputRef}
          className="hidden"
          accept=".json, image/*"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
}

export default EditorLeftSide;
