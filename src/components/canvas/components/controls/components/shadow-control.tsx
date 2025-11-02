import * as React from "react";
import type { IEditorBlocks } from "@/lib/schema";
import type { EditorContextType } from "@/components/canvas/use-editor";
import { Cross2Icon } from "@radix-ui/react-icons";
import { NumberInput } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import ControllerRow from "./controller-row";
import ColorControl from "./color-control";

interface ShadowControlProps {
  editor: EditorContextType;
  id: string;
  block: IEditorBlocks | undefined;
  className?: string;
}

const DEFAULT_SHADOW = {
  type: "box" as const,
  position: "outside" as const,
  color: "#00000040",
  x: 0,
  y: 1,
  blur: 5,
  spread: 0,
};

function ShadowControl({ editor, id, block, className }: ShadowControlProps) {
  const [open, setOpen] = React.useState(false);

  const ensureShadow = React.useCallback(() => {
    if (block?.shadow) {
      return;
    }
    editor.updateBlockValues(id, { shadow: DEFAULT_SHADOW });
  }, [block, editor, id]);

  const handleClear = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      editor.updateBlockValues(id, { shadow: undefined });
      setOpen(false);
    },
    [editor, id]
  );

  return (
    <ControllerRow
      label="Shadow"
      className={className}
      contentClassName="justify-between"
    >
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="flex h-7 w-full items-center justify-between rounded-md border border-border bg-muted px-1 text-xs transition hover:border-primary"
            onClick={ensureShadow}
          >
            <span className="flex items-center gap-2">
              <span
                className="h-5 w-5 rounded-sm border border-border bg-foreground/20"
                style={{
                  ...(block?.shadow?.color
                    ? { background: block.shadow.color }
                    : {}),
                }}
              />
              {block?.shadow ? (
                <span className="max-w-[120px] overflow-hidden text-ellipsis whitespace-nowrap">
                  {block.shadow.color}
                </span>
              ) : (
                <span className="opacity-50">Add…</span>
              )}
            </span>
            {block?.shadow ? (
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
            <p className="text-xs font-semibold">Shadow</p>
            <button
              type="button"
              className="rounded p-1 text-foreground/60 hover:bg-accent"
              onClick={() => setOpen(false)}
            >
              <Cross2Icon className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="flex flex-col gap-2.5">
            <ControllerRow label="Type" contentClassName="justify-between">
              <Tabs
                value={block?.shadow?.type}
                className="w-full"
                onValueChange={(value) => {
                  if (!block) {
                    return;
                  }
                  editor.updateBlockValues(id, {
                    shadow: {
                      ...block.shadow,
                      type: value as "box" | "realistic",
                    },
                  });
                }}
              >
                <TabsList>
                  <TabsTrigger value="box">Box</TabsTrigger>
                  <TabsTrigger value="realistic">Realistic</TabsTrigger>
                </TabsList>
              </Tabs>
            </ControllerRow>
            {block?.shadow?.type !== "realistic" && (
              <ControllerRow
                label="Position"
                contentClassName="justify-between"
              >
                <Tabs
                  value={block?.shadow?.position}
                  className="w-full"
                  onValueChange={(value) => {
                    if (!block) {
                      return;
                    }
                    editor.updateBlockValues(id, {
                      shadow: {
                        ...block.shadow,
                        position: value as "inside" | "outside",
                      },
                    });
                  }}
                >
                  <TabsList>
                    <TabsTrigger value="inside">Inside</TabsTrigger>
                    <TabsTrigger value="outside">Outside</TabsTrigger>
                  </TabsList>
                </Tabs>
              </ControllerRow>
            )}
            <ColorControl
              name="Color"
              value={block?.shadow?.color}
              disableGradient
              onChange={(color) => {
                if (!block) {
                  return;
                }
                editor.updateBlockValues(id, {
                  shadow: {
                    ...block.shadow,
                    color,
                  },
                });
              }}
            />
            <ControllerRow label="X" contentClassName="justify-end">
              <NumberInput
                value={block?.shadow?.x}
                onChange={(value) => {
                  if (!block) {
                    return;
                  }
                  editor.updateBlockValues(id, {
                    shadow: {
                      ...block.shadow,
                      x: value,
                    },
                  });
                }}
              />
            </ControllerRow>
            <ControllerRow label="Y" contentClassName="justify-end">
              <NumberInput
                value={block?.shadow?.y}
                onChange={(value) => {
                  if (!block) {
                    return;
                  }
                  editor.updateBlockValues(id, {
                    shadow: {
                      ...block.shadow,
                      y: value,
                    },
                  });
                }}
              />
            </ControllerRow>
            <ControllerRow label="Blur" contentClassName="justify-end">
              <NumberInput
                value={block?.shadow?.blur}
                onChange={(value) => {
                  if (!block) {
                    return;
                  }
                  editor.updateBlockValues(id, {
                    shadow: {
                      ...block.shadow,
                      blur: value,
                    },
                  });
                }}
              />
            </ControllerRow>
            {block?.shadow?.type !== "realistic" && (
              <ControllerRow label="Spread" contentClassName="justify-end">
                <NumberInput
                  value={block?.shadow?.spread}
                  onChange={(value) => {
                    if (!block) {
                      return;
                    }
                    editor.updateBlockValues(id, {
                      shadow: {
                        ...block.shadow,
                        spread: value,
                      },
                    });
                  }}
                />
              </ControllerRow>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </ControllerRow>
  );
}

export default ShadowControl;
