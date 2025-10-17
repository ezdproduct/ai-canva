import { IEditorBlocks } from "@/components/canvas/editor-types";
import { EditorContextType } from "@/components/canvas/use-editor";
import { Cross2Icon } from "@radix-ui/react-icons";
import { NumberInput } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import ControllerRow from "./controller-row";
import ColorControl from "./color-control";

function ShadowControl({
  editor,
  id,
  block,
}: {
  editor: EditorContextType;
  id: string;
  block: IEditorBlocks | undefined;
}) {
  const [open, setOpen] = useState(false);
  const onClick = () => {
    if (!block?.shadow) {
      editor.updateBlockValues(id, {
        shadow: {
          type: "box",
          position: "outside",
          color: "#00000040",
          x: 0,
          y: 1,
          blur: 5,
          spread: 0,
        },
      });
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const removeBorder = (e: any) => {
    e.stopPropagation();
    editor.updateBlockValues(id, {
      shadow: undefined,
    });
    setOpen(false);
  };

  return (
    <ControllerRow label="Shadow">
      <Popover open={open} onOpenChange={(e) => setOpen(e)}>
        <PopoverTrigger asChild>
          <div
            role="presentation"
            onClick={onClick}
            onKeyDown={onClick}
            className="h-7 rounded-md bg-gray w-full border border-border flex items-center justify-between px-1 cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <div
                className="h-5 w-5 rounded-sm bg-foreground/20"
                style={{
                  ...(block?.shadow?.color
                    ? { background: block?.shadow?.color }
                    : {}),
                }}
              />
              {block?.shadow ? (
                <p className="text-xs capitalize">{block.shadow.color}</p>
              ) : (
                <p className="text-xs opacity-40">Add...</p>
              )}
            </div>
            {block?.shadow && (
              <div
                role="presentation"
                className="p-1 -mr-1"
                onClick={removeBorder}
                onKeyDown={removeBorder}
              >
                <Cross2Icon className="opacity-50 h-3 w-3" />
              </div>
            )}
          </div>
        </PopoverTrigger>
        <PopoverContent align="center" side="left">
          <div className="flex items-center justify-between border-b border-border pb-2 mb-4">
            <p className="text-xs font-semibold">Shadow</p>
            <div
              role="presentation"
              className="p-1 -mr-1 cursor-pointer"
              onClick={() => setOpen(false)}
            >
              <Cross2Icon className="h-3.5 w-3.5 opacity-50" />
            </div>
          </div>
          <div className="flex flex-col gap-2.5">
            <ControllerRow label="Type">
              <Tabs
                value={block?.shadow?.type}
                className="w-full"
                onValueChange={(e) => {
                  if (block) {
                    editor.updateBlockValues(id, {
                      shadow: {
                        ...block.shadow,
                        type: e as "box" | "realistic",
                      },
                    });
                  }
                }}
              >
                <TabsList>
                  <TabsTrigger value="box">
                    <p className="text-xs">Box</p>
                  </TabsTrigger>
                  <TabsTrigger value="realistic">
                    <p className="text-xs">Realistic</p>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </ControllerRow>
            {block?.shadow?.type !== "realistic" && (
              <ControllerRow label="Position">
                <Tabs
                  value={block?.shadow?.position}
                  className="w-full"
                  onValueChange={(e) => {
                    if (block) {
                      editor.updateBlockValues(id, {
                        shadow: {
                          ...block.shadow,
                          position: e as "inside" | "outside",
                        },
                      });
                    }
                  }}
                >
                  <TabsList>
                    <TabsTrigger value="inside">
                      <p className="text-xs">Inside</p>
                    </TabsTrigger>
                    <TabsTrigger value="outside">
                      <p className="text-xs">Outside</p>
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </ControllerRow>
            )}
            <ColorControl
              name="Color"
              value={block?.shadow?.color}
              disableGradient
              onChange={(e) => {
                if (block) {
                  editor.updateBlockValues(id, {
                    shadow: {
                      ...block.shadow,
                      color: e,
                    },
                  });
                }
              }}
            />
            <ControllerRow label="X">
              <NumberInput
                value={block?.shadow?.x}
                onChange={(e) => {
                  if (block) {
                    editor.updateBlockValues(id, {
                      shadow: {
                        ...block.shadow,
                        x: e,
                      },
                    });
                  }
                }}
              />
            </ControllerRow>
            <ControllerRow label="Y">
              <NumberInput
                value={block?.shadow?.y}
                onChange={(e) => {
                  if (block) {
                    editor.updateBlockValues(id, {
                      shadow: {
                        ...block.shadow,
                        y: e,
                      },
                    });
                  }
                }}
              />
            </ControllerRow>
            <ControllerRow label="Blur">
              <NumberInput
                value={block?.shadow?.blur}
                onChange={(e) => {
                  if (block) {
                    editor.updateBlockValues(id, {
                      shadow: {
                        ...block.shadow,
                        blur: e,
                      },
                    });
                  }
                }}
              />
            </ControllerRow>
            {block?.shadow?.type !== "realistic" && (
              <ControllerRow label="Spread">
                <NumberInput
                  value={block?.shadow?.spread}
                  onChange={(e) => {
                    if (block) {
                      editor.updateBlockValues(id, {
                        shadow: {
                          ...block.shadow,
                          spread: e,
                        },
                      });
                    }
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
