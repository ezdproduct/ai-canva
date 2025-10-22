/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
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
import type { EditorContextType } from "../../use-editor";

export interface CommonBlockProps
  extends React.HTMLAttributes<HTMLDivElement> {
  editor: EditorContextType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  block: any;
}

export const CommonBlock = React.forwardRef<HTMLDivElement, CommonBlockProps>(
  (
    {
      editor,
      block,
      className,
      style,
      onMouseEnter,
      onMouseLeave,
      children,
      ...props
    },
    forwardedRef
  ) => {
    const composedRef = React.useCallback(
      (node: HTMLDivElement | null) => {
        editor.registerBlockElement(block.id, node);
        if (!forwardedRef) {
          return;
        }
        if (typeof forwardedRef === "function") {
          forwardedRef(node);
        } else {
          (forwardedRef as React.MutableRefObject<HTMLDivElement | null>).current =
            node;
        }
      },
      [block.id, editor, forwardedRef]
    );

    const baseStyle: React.CSSProperties = {
      overflow: "clip",
      position: "absolute",
      width: block.width,
      height: block.height,
      outline: "none",
      transform: `translate(${block.x}px, ${block.y}px)${
        block?.flip?.verticle ? " scaleY(-1)" : ""
      }${block?.flip?.horizontal ? " scaleX(-1)" : ""} ${
        block.rotate?.type === "2d"
          ? `rotate(${block?.rotate?.value ?? 0}deg)`
          : `rotateX(${block?.rotate?.valueX ?? 0}deg) rotateY(${block?.rotate?.valueY ?? 0}deg) rotateZ(${block?.rotate?.valueZ ?? 0}deg)`
      }`,
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
      opacity: block.opacity / 100,
      filter: `${
        block?.shadow && block.shadow.type === "realistic"
          ? `drop-shadow(${block.shadow.x}px ${block.shadow.y}px ${block.shadow.blur}px ${block.shadow.color})`
          : ""
      }`,
    };

    if (block.border) {
      baseStyle.borderStyle = block.border.type;
      baseStyle.borderLeftWidth =
        block?.border?.width?.type === "all"
          ? block.border?.width.top
          : block.border?.width?.left;
      baseStyle.borderRightWidth =
        block?.border?.width?.type === "all"
          ? block.border.width.top
          : block.border?.width?.right;
      baseStyle.borderTopWidth = block?.border?.width?.top;
      baseStyle.borderBottomWidth =
        block?.border?.width?.type === "all"
          ? block.border?.width.top
          : block?.border?.width?.bottom;
      baseStyle.borderColor = block.border.color;
    }

    if (block?.background) {
      baseStyle.background = block.background;
    }

    if (block.shadow && block.shadow.type === "box") {
      baseStyle.boxShadow = `${block.shadow.x}px ${block.shadow.y}px ${block.shadow.blur}px ${block.shadow.spread}px ${block.shadow.color}${
        block.shadow.position === "inside" ? " inset" : ""
      }`;
    }

    return (
      <ContextMenu
        onOpenChange={(open) => {
          if (!open) {
            return;
          }
          const element = editor.getBlockElement(block.id);
          if (element) {
            editor.setSelectedBlocks([element]);
          }
        }}
      >
        <ContextMenuTrigger asChild>
          <div
            id={block.id}
            data-block-type={block.type}
            ref={composedRef}
            className={cn(
              `editor-block editor-block-${block.type}`,
              `block-${block.id}`,
              className
            )}
            style={{ ...baseStyle, ...style }}
            onMouseEnter={(event) => {
              editor.setHoveredBlockId(block.id);
              onMouseEnter?.(event);
            }}
            onMouseLeave={(event) => {
              editor.setHoveredBlockId(null);
              onMouseLeave?.(event);
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
);

CommonBlock.displayName = "CommonBlock";

export default CommonBlock;
