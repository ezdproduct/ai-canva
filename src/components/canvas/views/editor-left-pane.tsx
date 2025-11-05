import * as React from "react";
import { HiDotsHorizontal } from "react-icons/hi";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  BackIcon,
  BackwardIcon,
  DeleteIcon,
  DuplicateIcon,
  FarwardIcon,
  FrontIcon,
} from "@/components/ui/icons";
import type { IEditorBlocks } from "@/lib/schema";
import { BlockIcon } from "../utils";
import { useEditorStore } from "../use-editor";
import { shallow } from "zustand/shallow";

interface BlockItemProps extends React.HTMLAttributes<HTMLDivElement> {
  block: IEditorBlocks;
  selected?: boolean;
  onSelectBlock?: (block: IEditorBlocks) => void;
  onRename?: (id: string, label: string) => void;
  onDuplicate?: (id: string) => void;
  onDelete?: (id: string) => void;
  onToggleVisibility?: (id: string) => void;
  onBringForward?: (id: string) => void;
  onBringBackward?: (id: string) => void;
  onBringToFront?: (id: string) => void;
  onBringToBack?: (id: string) => void;
}

const BlockItem = React.forwardRef<HTMLDivElement, BlockItemProps>(
  (
    {
      block,
      selected = false,
      onSelectBlock,
      onRename,
      onDuplicate,
      onDelete,
      onToggleVisibility,
      onBringForward,
      onBringBackward,
      onBringToFront,
      onBringToBack,
      className,
      onMouseEnter,
      onMouseLeave,
      ...props
    },
    ref
  ) => {
    const [label, setLabel] = React.useState(block.label);
    const [editable, setEditable] = React.useState(false);

    React.useEffect(() => {
      if (!editable) {
        setLabel(block.label);
      }
    }, [block.label, editable]);

    const handleSelect = React.useCallback(() => {
      if (!block.visible) {
        return;
      }
      onSelectBlock?.(block);
    }, [block, onSelectBlock]);

    return (
      <div
        ref={ref}
        className={cn(
          "sidebar-item relative flex min-h-8 items-center justify-between border border-transparent pl-4 pr-3 transition-all hover:border-primary",
          {
            "opacity-40": !block.visible,
            "bg-muted": selected,
          },
          className
        )}
        data-block-id={block.id}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        {...props}
      >
        <button
          type="button"
          className="absolute inset-0 z-[1] cursor-pointer rounded-none"
          onClick={handleSelect}
          aria-label={`Select ${block.label}`}
        />
        <div className="relative z-[2] flex items-center gap-1.5">
          <div className="opacity-50">{BlockIcon(block.type)}</div>
          <input
            type="text"
            value={label}
            onChange={(event) => setLabel(event.target.value)}
            className={cn(
              "sidebar-item-label-input h-6 w-auto cursor-default overflow-hidden text-ellipsis border border-transparent bg-transparent px-1 text-sm outline-hidden",
              { "border-foreground/30 bg-background": editable }
            )}
            readOnly={!editable}
            onDoubleClick={() => setEditable(true)}
            onFocus={(event) => event.stopPropagation()}
            onClick={(event) => event.stopPropagation()}
            onBlur={() => {
              setEditable(false);
              if (block.label !== label) {
                onRename?.(block.id, label);
              }
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                setEditable(false);
                if (block.label !== label) {
                  onRename?.(block.id, label);
                }
              }
            }}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger className="sidebar-item-actions relative z-[3] invisible" asChild>
            <button
              type="button"
              className="rounded p-1 text-foreground/70 transition hover:bg-accent"
              onClick={(event) => {
                event.stopPropagation();
                handleSelect();
              }}
            >
              <HiDotsHorizontal />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-52">
            <DropdownMenuItem onClick={() => onDuplicate?.(block.id)}>
              <DuplicateIcon className="mr-2 h-5 w-5" />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete?.(block.id)}>
              <DeleteIcon className="mr-2 h-5 w-5" />
              Delete
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onToggleVisibility?.(block.id)}>
              {block.visible ? (
                <AiOutlineEyeInvisible className="mr-2 h-5 w-5" />
              ) : (
                <AiOutlineEye className="mr-2 h-5 w-5" />
              )}
              {block.visible ? "Hide" : "Show"}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onBringForward?.(block.id)}>
              <FarwardIcon className="mr-2 h-5 w-5" />
              Bring forward
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onBringToFront?.(block.id)}>
              <FrontIcon className="mr-2 h-5 w-5" />
              Bring to front
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onBringBackward?.(block.id)}>
              <BackwardIcon className="mr-2 h-5 w-5" />
              Bring backward
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onBringToBack?.(block.id)}>
              <BackIcon className="mr-2 h-5 w-5" />
              Bring to back
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }
);

BlockItem.displayName = "BlockItem";

function EditorLeftPane() {
  const blocks = useEditorStore(
    (state) => state.blockOrder.map((id) => state.blocksById[id]).filter(Boolean),
    (prev, next) => prev.length === next.length && prev.every((value, index) => value === next[index])
  );
  const [selectedIds, setSelectedIds] = useEditorStore(
    (state) => [state.selectedIds, state.setSelectedIds],
    shallow
  );
  const [
    updateBlockValues,
    duplicateBlock,
    deleteBlock,
    showHideBlock,
    bringForwardBlock,
    bringBackwardBlock,
    bringToTopBlock,
    bringToBackBlock,
  ] = useEditorStore(
    (state) => [
      state.updateBlockValues,
      state.duplicateBlock,
      state.deleteBlock,
      state.showHideBlock,
      state.bringForwardBlock,
      state.bringBackwardBlock,
      state.bringToTopBlock,
      state.bringToBackBlock,
    ],
    shallow
  );

  const handleSelect = React.useCallback(
    (block: IEditorBlocks) => {
      if (!block.visible) {
        return;
      }
      setSelectedIds([block.id]);
    },
    [setSelectedIds]
  );

  return (
    <div className="editor-left-side relative z-20 flex w-64 flex-col border-r border-border bg-background">
      <p className="p-4 pb-3 text-sm font-semibold">Layers</p>
      <ScrollArea>
        {blocks.map((block) => (
          <BlockItem
            key={block.id}
            block={block}
            selected={selectedIds.length === 1 && selectedIds[0] === block.id}
            onSelectBlock={handleSelect}
            onRename={(id, label) => updateBlockValues(id, { label })}
            onDuplicate={duplicateBlock}
            onDelete={deleteBlock}
            onToggleVisibility={showHideBlock}
            onBringForward={bringForwardBlock}
            onBringBackward={bringBackwardBlock}
            onBringToFront={bringToTopBlock}
            onBringToBack={bringToBackBlock}
          />
        ))}
      </ScrollArea>
    </div>
  );
}

export default EditorLeftPane;
