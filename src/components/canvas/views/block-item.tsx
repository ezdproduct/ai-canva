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
    Lock,
    Unlock,
    GripVertical
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
import { Button } from "@/components/ui/button";

interface BlockItemProps extends React.HTMLAttributes<HTMLDivElement> {
    block: IEditorBlocks;
    selected?: boolean;
    onSelectBlock?: (block: IEditorBlocks) => void;
    onHoverChange?: (hovered: boolean) => void;
    onRename?: (id: string, label: string) => void;
    onDuplicate?: (id: string) => void;
    onDelete?: (id: string) => void;
    onToggleVisibility?: (id: string) => void;
    onToggleLock?: (id: string) => void;
    onBringForward?: (id: string) => void;
    onBringBackward?: (id: string) => void;
    onBringToFront?: (id: string) => void;
    onBringToBack?: (id: string) => void;
    isDragging?: boolean;
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
            onToggleLock,
            onBringForward,
            onBringBackward,
            onBringToFront,
            onBringToBack,
            className,
            onMouseEnter,
            onMouseLeave,
            isDragging,
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
            // Allow selecting locked blocks, but visibility check remains if needed
            // Usually we still want to select invisible blocks in layer panel to show them
            onSelectBlock?.(block);
        }, [block, onSelectBlock]);

        return (
            <div
                ref={ref}
                className={cn(
                    "group/item relative mx-2 mb-1 rounded-lg transition-all border border-transparent",
                    {
                        "bg-sidebar-accent border-sidebar-border shadow-sm": selected,
                        "hover:bg-sidebar-accent/50": !selected && !isDragging,
                        "opacity-50 scale-95": isDragging,
                        "opacity-60": !block.visible,
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
                <div className="flex items-center gap-2 p-2">
                    {/* Drag Handle (Visual only for now if no dnd lib yet) */}
                    <div className="opacity-0 group-hover/item:opacity-40 cursor-grab active:cursor-grabbing hover:opacity-100 transition-opacity">
                        <GripVertical className="size-3.5" />
                    </div>

                    <button
                        type="button"
                        className="flex-1 flex items-center gap-3 min-w-0 text-left"
                        onClick={handleSelect}
                    >
                        <div
                            className={cn(
                                "flex justify-center items-center shrink-0 size-8 rounded-md border transition-colors bg-background overflow-hidden",
                                {
                                    "border-primary/20": selected,
                                    "border-border/50": !selected,
                                }
                            )}
                        >
                            {block.type === "image" && block.url ? (
                                <img
                                    src={block.url}
                                    alt={block.label}
                                    className="w-full h-full object-cover select-none pointer-events-none"
                                />
                            ) : (
                                <div className="text-foreground/70 scale-90">{BlockIcon(block.type)}</div>
                            )}
                        </div>

                        {editable ? (
                            <Input
                                value={label}
                                onChange={(e) => setLabel(e.target.value)}
                                className="h-7 px-1 text-xs"
                                autoFocus
                                onBlur={() => {
                                    setEditable(false);
                                    if (label !== block.label) onRename?.(block.id, label);
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        setEditable(false);
                                        if (label !== block.label) onRename?.(block.id, label);
                                    }
                                    if (e.key === "Escape") {
                                        setEditable(false);
                                        setLabel(block.label);
                                    }
                                }}
                                onClick={(e) => e.stopPropagation()}
                            />
                        ) : (
                            <span className="text-xs font-medium truncate text-foreground/80">
                                {block.label}
                            </span>
                        )}
                    </button>

                    {/* Quick Actions on Hover */}
                    <div className={cn(
                        "flex items-center gap-0.5 opacity-0 group-hover/item:opacity-100 transition-opacity",
                        (selected || block.locked || !block.visible) && "opacity-100" // Always show if active state
                    )}>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-muted-foreground hover:text-foreground"
                            onClick={(e) => {
                                e.stopPropagation();
                                onToggleLock?.(block.id);
                            }}
                        >
                            {block.locked ? <Lock className="size-3.5 text-orange-500" /> : <Unlock className="size-3.5" />}
                        </Button>

                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-muted-foreground hover:text-foreground"
                            onClick={(e) => {
                                e.stopPropagation();
                                onToggleVisibility?.(block.id);
                            }}
                        >
                            {block.visible ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5 text-muted-foreground/60" />}
                        </Button>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-foreground">
                                    <MoreHorizontal className="size-3.5" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-48" align="end">
                                <DropdownMenuItem onClick={() => setEditable(true)}>
                                    <Pencil className="mr-2 size-3.5" /> Rename
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => onDuplicate?.(block.id)}>
                                    <Copy className="mr-2 size-3.5" /> Duplicate
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => onBringForward?.(block.id)}>
                                    <ArrowUp className="mr-2 size-3.5" /> Bring Forward
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => onBringBackward?.(block.id)}>
                                    <ArrowDown className="mr-2 size-3.5" /> Bring Backward
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => onBringToFront?.(block.id)}>
                                    <ArrowUpToLine className="mr-2 size-3.5" /> Bring to Front
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => onBringToBack?.(block.id)}>
                                    <ArrowDownToLine className="mr-2 size-3.5" /> Bring to Back
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => onDelete?.(block.id)}>
                                    <Trash2 className="mr-2 size-3.5" /> Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
        );
    }
);

BlockItem.displayName = "BlockItem";

