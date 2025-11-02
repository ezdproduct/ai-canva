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
import type { EditorContextType } from "../use-editor";
import type { IEditorBlocks } from "@/lib/schema";
import { BlockIcon } from "../utils";

interface BlockItemProps extends React.HTMLAttributes<HTMLDivElement> {
  block: IEditorBlocks;
  editor: EditorContextType;
  selected?: boolean;
  onSelectBlock?: (block: IEditorBlocks) => void;
}

const BlockItem = React.forwardRef<HTMLDivElement, BlockItemProps>(
  (
    {
      block,
      editor,
      selected = false,
      onSelectBlock,
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
        onMouseEnter={(event) => {
          if (block.visible) {
            editor.setHoveredBlockId(block.id);
          }
          onMouseEnter?.(event);
        }}
        onMouseLeave={(event) => {
          editor.setHoveredBlockId(null);
          onMouseLeave?.(event);
        }}
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
                editor.updateBlockValues(block.id, { label });
              }
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                setEditable(false);
                if (block.label !== label) {
                  editor.updateBlockValues(block.id, { label });
                }
              }
            }}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger
            className="sidebar-item-actions relative z-[3] invisible"
            asChild
          >
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
            <DropdownMenuItem
              onClick={() => {
                editor.duplicateBlock(block.id);
              }}
            >
              <DuplicateIcon className="mr-2 h-5 w-5" />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                editor.deleteBlock(block.id);
              }}
            >
              <DeleteIcon className="mr-2 h-5 w-5" />
              Delete
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                editor.showHideBlock(block.id);
              }}
            >
              {block.visible ? (
                <AiOutlineEyeInvisible className="mr-2 h-5 w-5" />
              ) : (
                <AiOutlineEye className="mr-2 h-5 w-5" />
              )}
              {block.visible ? "Hide" : "Show"}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                editor.bringForwardBlock(block.id);
              }}
            >
              <FarwardIcon className="mr-2 h-5 w-5" />
              Bring forward
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                editor.bringToTopBlock(block.id);
              }}
            >
              <FrontIcon className="mr-2 h-5 w-5" />
              Bring to front
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                editor.bringBackwardBlock(block.id);
              }}
            >
              <BackwardIcon className="mr-2 h-5 w-5" />
              Bring backward
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                editor.bringToBackBlock(block.id);
              }}
            >
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

function EditorLeftSide({ editor }: { editor: EditorContextType }) {
  const handleSelect = React.useCallback(
    (block: IEditorBlocks) => {
      const blockElement = editor.getBlockElement(block.id);
      if (blockElement) {
        editor.setSelectedBlocks([blockElement]);
      }
    },
    [editor]
  );

  return (
    <div className="editor-left-side relative z-20 flex w-64 flex-col border-r border-border bg-background">
      <p className="p-4 pb-3 text-sm font-semibold">Layers</p>
      <ScrollArea>
        {editor.blocks.map((block) => (
          <BlockItem
            key={block.id}
            block={block}
            editor={editor}
            selected={
              editor.selectedBlocks.length === 1 &&
              editor.selectedBlocks[0]?.id === block.id
            }
            onSelectBlock={handleSelect}
          />
        ))}
      </ScrollArea>
    </div>
  );
}

export default EditorLeftSide;
