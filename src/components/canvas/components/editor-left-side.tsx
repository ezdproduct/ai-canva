/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { HiDotsHorizontal } from "react-icons/hi";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  DeleteIcon,
  DuplicateIcon,
  FarwardIcon,
  FrontIcon,
  BackIcon,
  BackwardIcon,
} from "@/components/ui/icons";
import { EditorContextType } from "../use-editor";
import { IEditorBlocks } from "../editor-types";
import { BlockIcon } from "../utils";

function BlockItem({
  block,
  onClick,
  selected,
  editor,
}: {
  block: IEditorBlocks;
  onClick: () => void;
  selected: boolean;
  editor: EditorContextType;
} & any) {
  const [label, setLabel] = useState(block.label);
  const [editable, setEditable] = useState(false);
  return (
    <div
      className={cn(
        "flex items-center justify-between pl-4 pr-3 border relative border-transparent hover:border-primary transition-all min-h-8",
        "sidebar-item",
        {
          "opacity-40": !block.visible,
          "bg-muted": selected,
        }
      )}
      data-block-id={block.id}
    >
      <div
        className="absolute top-0 bottom-0 right-0 left-0 z-1"
        onClick={onClick}
        onKeyDown={onClick}
        role="presentation"
      />
      <div
        className="flex items-center gap-1.5 z-2 relative"
        onClick={onClick}
        role="presentation"
      >
        <div className="opacity-50">{BlockIcon(block.type)}</div>
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          className={cn(
            "w-auto text-sm h-6 px-1 outline-hidden bg-transparent cursor-default border border-transparent overflow-hidden text-ellipsis",
            { "bg-background border-foreground/30": editable },
            "sidebar-item-label-input"
          )}
          readOnly={!editable}
          onDoubleClick={() => setEditable(true)}
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
        <DropdownMenuTrigger className="z-3 relative invisible sidebar-item-actions">
          <HiDotsHorizontal />
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

function EditorLeftSide({ editor }: { editor: EditorContextType }) {
  return (
    <div className="editor-left-side border-r border-border w-64 flex flex-col z-20 relative bg-background">
      <p className="p-4 pb-3 text-sm font-semibold">Layers</p>
      <ScrollArea>
        {editor.blocks.map((block) => (
          <BlockItem
            key={block.id}
            block={block}
            editor={editor}
            onClick={() => {
              if (block.visible) {
                const elm = document.querySelector(
                  `.editor-canvas .block-${block.id}`
                ) as HTMLElement;
                if (elm) {
                  editor.setSelectedBlocks([elm]);
                }
              }
            }}
            selected={
              editor.selectedBlocks.length === 1 &&
              editor.selectedBlocks[0]?.id === block.id
            }
          />
        ))}
      </ScrollArea>
    </div>
  );
}

export default EditorLeftSide;
