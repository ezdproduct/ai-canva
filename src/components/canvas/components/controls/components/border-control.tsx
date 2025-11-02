import * as React from "react";
import type { IBorderType, IEditorBlocks } from "@/lib/schema";
import type { EditorContextType } from "@/components/canvas/use-editor";
import { BoxIcon, Cross2Icon } from "@radix-ui/react-icons";
import { NumberInput } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TbBorderSides } from "react-icons/tb";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import ControllerRow from "./controller-row";
import ColorControl from "./color-control";

interface BorderControlProps {
  editor: EditorContextType;
  id: string;
  block: IEditorBlocks | undefined;
  className?: string;
}

const DEFAULT_BORDER_WIDTH = 1;

const ensureBorder = (
  block: IEditorBlocks | undefined,
  editor: EditorContextType,
  id: string
) => {
  if (block?.border) {
    return;
  }
  editor.updateBlockValues(id, {
    border: {
      width: {
        type: "all",
        left: DEFAULT_BORDER_WIDTH,
        right: DEFAULT_BORDER_WIDTH,
        top: DEFAULT_BORDER_WIDTH,
        bottom: DEFAULT_BORDER_WIDTH,
      },
      type: "solid",
      color: "#000000",
    },
  });
};

function BorderControl({ editor, id, block, className }: BorderControlProps) {
  const [open, setOpen] = React.useState(false);

  const handleToggle = React.useCallback(() => {
    ensureBorder(block, editor, id);
  }, [block, editor, id]);

  const handleClear = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      editor.updateBlockValues(id, { border: undefined });
      setOpen(false);
    },
    [editor, id]
  );

  return (
    <ControllerRow
      label="Border"
      className={className}
      contentClassName="justify-between"
    >
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            onClick={handleToggle}
            className="flex h-7 w-full items-center justify-between rounded-md border border-border bg-muted px-1 text-xs transition hover:border-primary"
          >
            <span className="flex items-center gap-2">
              <span
                className="h-5 w-5 rounded-sm border border-border bg-foreground/20"
                style={
                  block?.border?.color
                    ? { background: block.border.color }
                    : undefined
                }
              />
              {block?.border ? (
                <span className="max-w-[100px] overflow-hidden text-ellipsis whitespace-nowrap capitalize">
                  {block.border.type}
                </span>
              ) : (
                <span className="opacity-50">Add…</span>
              )}
            </span>
            {block?.border ? (
              <button
                type="button"
                className="rounded p-1 text-foreground/60 hover:bg-accent"
                onClick={handleClear}
              >
                <Cross2Icon className="h-3 w-3" />
              </button>
            ) : null}
          </button>
        </PopoverTrigger>
        <PopoverContent align="center" side="left">
          <div className="mb-4 flex items-center justify-between border-b border-border pb-2">
            <p className="text-xs font-semibold">Border</p>
            <button
              type="button"
              className="rounded p-1 text-foreground/60 hover:bg-accent"
              onClick={() => setOpen(false)}
            >
              <Cross2Icon className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="flex flex-col gap-2.5">
            <ColorControl
              name="Color"
              value={block?.border?.color}
              disableGradient
              onChange={(color) => {
                if (!block) {
                  return;
                }
                editor.updateBlockValues(id, {
                  border: {
                    ...block.border,
                    color,
                  },
                });
              }}
            />
            <ControllerRow label="Style">
              <select
                name="type"
                value={block?.border?.type}
                onChange={(event) => {
                  if (!block) {
                    return;
                  }
                  editor.updateBlockValues(id, {
                    border: {
                      ...block.border,
                      type: event.target.value as IBorderType,
                    },
                  });
                }}
                className="h-8 w-full rounded-md border border-border bg-background px-2 text-xs"
              >
                <option value="solid">Solid</option>
                <option value="dotted">Dotted</option>
                <option value="dashed">Dashed</option>
                <option value="double">Double</option>
                <option value="groove">Groove</option>
                <option value="ridge">Ridge</option>
                <option value="inset">Inset</option>
                <option value="outset">Outset</option>
              </select>
            </ControllerRow>
            <ControllerRow label="Width" contentClassName="items-stretch gap-2">
              <NumberInput
                value={
                  block?.border?.width?.type === "all"
                    ? block?.border?.width.top
                    : parseFloat("")
                }
                onChange={(value) => {
                  if (!block) {
                    return;
                  }
                  editor.updateBlockValues(id, {
                    border: {
                      ...block.border,
                      width: {
                        type: "all",
                        top: value,
                        right: value,
                        bottom: value,
                        left: value,
                      },
                    },
                  });
                }}
                className="w-20"
                min={0}
              />
              <Tabs
                value={block?.border?.width?.type}
                className="w-[140px]"
                onValueChange={(value) => {
                  if (!block) {
                    return;
                  }
                  editor.updateBlockValues(id, {
                    border: {
                      ...block.border,
                      width: {
                        ...block.border?.width,
                        type: value as "all" | "single",
                      },
                    },
                  });
                }}
              >
                <TabsList>
                  <TabsTrigger value="all">
                    <BoxIcon className="h-3 w-3" />
                  </TabsTrigger>
                  <TabsTrigger value="single">
                    <TbBorderSides className="h-3.5 w-3.5" />
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </ControllerRow>
            {block?.border?.width?.type === "single" && (
              <ControllerRow contentClassName="grid gap-2">
                <div>
                  <div className="flex">
            <NumberInput
              className="rounded-tr-none rounded-br-none"
              value={block?.border?.width?.left}
              onChange={(value) => {
                if (!block || !block.border) {
                  return;
                }
                editor.updateBlockValues(id, {
                  border: {
                    ...block.border,
                    width: {
                      ...block.border.width,
                      left: value,
                    },
                  },
                });
              }}
              min={0}
            />
            <NumberInput
              className="rounded-none"
              value={block?.border?.width?.top}
              onChange={(value) => {
                if (!block || !block.border) {
                  return;
                }
                editor.updateBlockValues(id, {
                  border: {
                    ...block.border,
                            width: {
                              ...block.border.width,
                              top: value,
                            },
                          },
                        });
                      }}
                      min={0}
            />
            <NumberInput
              className="rounded-none"
              value={block?.border?.width?.right}
              onChange={(value) => {
                if (!block || !block.border) {
                  return;
                }
                editor.updateBlockValues(id, {
                  border: {
                    ...block.border,
                            width: {
                              ...block.border.width,
                              right: value,
                            },
                          },
                        });
                      }}
                      min={0}
            />
            <NumberInput
              className="rounded-tl-none rounded-bl-none"
              value={block?.border?.width?.bottom}
              onChange={(value) => {
                if (!block || !block.border) {
                  return;
                }
                editor.updateBlockValues(id, {
                  border: {
                    ...block.border,
                            width: {
                              ...block.border.width,
                              bottom: value,
                            },
                          },
                        });
                      }}
                      min={0}
                    />
                  </div>
                  <div className="flex justify-between pt-1 text-[9px] text-foreground/40">
                    <span>Left</span>
                    <span>Top</span>
                    <span>Right</span>
                    <span>Bottom</span>
                  </div>
                </div>
              </ControllerRow>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </ControllerRow>
  );
}

export default BorderControl;
