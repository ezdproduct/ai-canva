import * as React from "react";
import {
    MoreHorizontal,
    EyeOff,
    Eye,
    Trash2,
    Copy,
    ArrowUp,
    ArrowUpToLine,
    ArrowDown,
    ArrowDownToLine,
    Pencil,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { IEditorBlocks } from "@/lib/schema";
import { BlockIcon } from "../utils";

interface BlockItemProps extends React.HTMLAttributes<HTMLDivElement> {
    block: IEditorBlocks;
    selected?: boolean;
    onSelectBlock?: (block: IEditorBlocks) => void;
    onHoverChange?: (hovered: boolean) => void;
    onRename?: (id: string, label: string) => void;
    onDuplicate?: (id: string) => void;
    onDelete?: (id: string) => void;
    onToggleVisibility?: (id: string) => void;
    onBringForward?: (id: string) => void;
    onBringBackward?: (id: string) => void;
    onBringToFront?: (id: string) => void;
    onBringToBack?: (id: string) => void;
}

export const BlockItem = React.forwardRef<HTMLDivElement, BlockItemProps>(
    (
        {
            block,
            selected = false,
            onSelectBlock,
            onHoverChange,
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
                    "sidebar-item group/item relative mx-2 my-0.5",
                    {
                        "opacity-40": !block.visible,
                    },
                    className
                )}
                data-block-id={block.id}
                onMouseEnter={(event) => {
                    if (block.visible) {
                        onHoverChange?.(true);
                    }
                    onMouseEnter?.(event);
                }}
                onMouseLeave={(event) => {
                    onHoverChange?.(false);
                    onMouseLeave?.(event);
                }}
                {...props}
            >
                <button
                    type="button"
                    className={cn(
                        "group/button flex items-center gap-3 w-full p-[3px] border rounded-xl transition-colors group-hover/item:bg-muted",
                        {
                            "bg-muted border-border/60": selected,
                            "border-transparent": !selected,
                        }
                    )}
                    onClick={handleSelect}
                    aria-label={`Select ${block.label}`}
                >
                    <div
                        className={cn(
                            "flex justify-center items-center shrink-0 size-8 rounded-lg transition-all group-hover/item:bg-background",
                            {
                                "bg-background shadow-sm": selected,
                                "bg-muted": !selected,
                            }
                        )}
                    >
                        <div className="text-base opacity-70">{BlockIcon(block.type)}</div>
                    </div>
                    {editable ? (
                        <Input
                            type="text"
                            value={label}
                            onChange={(event) => setLabel(event.target.value)}
                            className="sidebar-item-label-input flex-1 h-6 overflow-hidden text-ellipsis px-1 text-sm truncate border-border bg-muted"
                            autoFocus
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
                                if (event.key === "Escape") {
                                    setEditable(false);
                                    setLabel(block.label);
                                }
                            }}
                        />
                    ) : (
                        <div className="flex-1 h-6 px-1 text-sm truncate flex items-center">
                            {block.label}
                        </div>
                    )}
                </button>
                <DropdownMenu>
                    <DropdownMenuTrigger
                        className="sidebar-item-actions absolute top-1/2 right-3 -translate-y-1/2 z-3 invisible"
                        asChild
                    >
                        <button
                            type="button"
                            className="rounded-lg p-1.5 text-foreground/50 transition-all hover:bg-muted hover:text-foreground"
                            onClick={(event) => {
                                event.stopPropagation();
                                handleSelect();
                            }}
                        >
                            <MoreHorizontal className="size-4" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-52">
                        <DropdownMenuItem onClick={() => setEditable(true)}>
                            <Pencil className="mr-1 size-4" />
                            Rename
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onDuplicate?.(block.id)}>
                            <Copy className="mr-1 size-4" />
                            Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDelete?.(block.id)}>
                            <Trash2 className="mr-1 size-4" />
                            Delete
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onToggleVisibility?.(block.id)}>
                            {block.visible ? (
                                <EyeOff className="mr-1 size-4" />
                            ) : (
                                <Eye className="mr-1 size-4" />
                            )}
                            {block.visible ? "Hide" : "Show"}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onBringForward?.(block.id)}>
                            <ArrowUp className="mr-1 size-4" />
                            Bring forward
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onBringToFront?.(block.id)}>
                            <ArrowUpToLine className="mr-1 size-4" />
                            Bring to front
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onBringBackward?.(block.id)}>
                            <ArrowDown className="mr-1 size-4" />
                            Bring backward
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onBringToBack?.(block.id)}>
                            <ArrowDownToLine className="mr-1 size-4" />
                            Bring to back
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        );
    }
);

BlockItem.displayName = "BlockItem";
