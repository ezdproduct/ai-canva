/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { cn } from "@/lib/utils";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { AiOutlineEyeInvisible } from "react-icons/ai";

import {
  DeleteIcon,
  DuplicateIcon,
  FarwardIcon,
  FrontIcon,
  BackIcon,
  BackwardIcon,
} from "@/components/ui/icons";
import { EditorContextType } from "../../use-editor";

export interface CommonBlockProps extends React.HTMLAttributes<HTMLElement> {
  block: any;
  styles?: React.CSSProperties;
  children?: React.ReactNode;
  customRef?: React.RefObject<HTMLInputElement>;
  editor: EditorContextType;
}

function CommonBlock({
  block,
  editor,
  styles = {},
  children,
  customRef,
  ...props
}: CommonBlockProps) {
  return (
    <ContextMenu
      onOpenChange={(e) => {
        if (e) {
          const elm = document.querySelector(
            `.editor-canvas .block-${block.id}`
          ) as HTMLElement;
          if (elm) {
            editor.setSelectedBlocks([elm]);
          }
        }
      }}
    >
      <ContextMenuTrigger asChild>
        <div
          id={block.id}
          data-block-type={block.type}
          ref={customRef}
          className={cn(
            `editor-block editor-block-${block.type}`,
            `block-${block.id}`
          )}
          style={{
            overflow: "clip",
            position: "absolute",
            width: block.width,
            height: block.height,
            outline: "none",
            transform: `translate(${block.x}px, ${block.y}px)${block?.flip?.verticle ? " scaleY(-1)" : ""}${block?.flip?.horizontal ? " scaleX(-1)" : ""} ${block.rotate?.type === "2d" ? `rotate(${block?.rotate?.value ?? 0}deg)` : `rotateX(${block?.rotate?.valueX ?? 0}deg) rotateY(${block?.rotate?.valueY ?? 0}deg) rotateZ(${block?.rotate?.valueZ ?? 0}deg)`}`,
            ...(block.border
              ? {
                  borderStyle: block.border.type,
                  borderLeftWidth:
                    block?.border?.width?.type === "all"
                      ? block.border?.width.top
                      : block.border?.width?.left,
                  borderRightWidth:
                    block?.border?.width?.type === "all"
                      ? block.border.width.top
                      : block.border?.width?.right,
                  borderTopWidth: block?.border?.width?.top,
                  borderBottomWidth:
                    block?.border?.width?.type === "all"
                      ? block.border?.width.top
                      : block?.border?.width?.bottom,
                  borderColor: block.border.color,
                }
              : {}),
            borderTopLeftRadius: block?.radius?.tl || 0,
            borderTopRightRadius:
              block.radius?.type === "all"
                ? block?.radius?.tl || 0
                : block?.radius?.tr || 0,
            borderBottomRightRadius:
              block.radius?.type === "all"
                ? block?.radius?.tl || 0
                : block?.radius?.br || 0,
            borderBottomLeftRadius:
              block.radius?.type === "all"
                ? block?.radius?.tl || 0
                : block?.radius?.bl || 0,
            ...(block?.background
              ? {
                  background: block.background,
                }
              : {}),
            ...(block.shadow && block.shadow.type === "box"
              ? {
                  boxShadow: `${block.shadow.x}px ${block.shadow.y}px ${block.shadow.blur}px ${block.shadow.spread}px ${block.shadow.color}${block.shadow.position === "inside" ? " inset" : ""}`,
                }
              : {}),
            opacity: block.opacity / 100,
            filter: `${block?.shadow && block.shadow.type === "realistic" ? `drop-shadow(${block.shadow.x}px ${block.shadow.y}px ${block.shadow.blur}px ${block.shadow.color})` : ""}`,
            ...styles,
          }}
          {...props}
        >
          {children}
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-52">
        <ContextMenuItem
          onClick={() => {
            editor.duplicateBlock(block.id);
          }}
        >
          <DuplicateIcon className="mr-2 h-5 w-5" />
          Duplicate
        </ContextMenuItem>
        <ContextMenuItem
          onClick={() => {
            editor.deleteBlock(block.id);
          }}
        >
          <DeleteIcon className="mr-2 h-5 w-5" />
          Delete
        </ContextMenuItem>
        <ContextMenuItem
          onClick={() => {
            editor.showHideBlock(block.id);
          }}
        >
          <AiOutlineEyeInvisible className="mr-2.5 ml-0.5 h-4 w-4" />
          Hide
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem
          onClick={() => {
            editor.bringForwardBlock(block.id);
          }}
        >
          <FarwardIcon className="mr-2 h-5 w-5" />
          Bring forward
        </ContextMenuItem>
        <ContextMenuItem
          onClick={() => {
            editor.bringToTopBlock(block.id);
          }}
        >
          <FrontIcon className="mr-2 h-5 w-5" />
          Bring to front
        </ContextMenuItem>
        <ContextMenuItem
          onClick={() => {
            editor.bringBackwardBlock(block.id);
          }}
        >
          <BackwardIcon className="mr-2 h-5 w-5" />
          Bring backward
        </ContextMenuItem>
        <ContextMenuItem
          onClick={() => {
            editor.bringToBackBlock(block.id);
          }}
        >
          <BackIcon className="mr-2 h-5 w-5" />
          Bring to back
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

export default CommonBlock;
