import { IBorderType, IEditorBlocks } from "@/components/canvas/editor-types";
import { EditorContextType } from "@/components/canvas/use-editor";
import { BoxIcon, Cross2Icon } from "@radix-ui/react-icons";
import { NumberInput } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TbBorderSides } from "react-icons/tb";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import ControllerRow from "./controller-row";
import ColorControl from "./color-control";

function BorderControl({
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
    if (!block?.border) {
      editor.updateBlockValues(id, {
        border: {
          width: {
            type: "all",
            left: 1,
            right: 1,
            top: 1,
            bottom: 1,
          },
          type: "solid",
          color: "#000000",
        },
      });
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const removeBorder = (e: any) => {
    e.stopPropagation();
    editor.updateBlockValues(id, {
      border: undefined,
    });
    setOpen(false);
  };

  return (
    <ControllerRow label="Border">
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
                  ...(block?.border?.color
                    ? { background: block?.border?.color }
                    : {}),
                }}
              />
              {block?.border ? (
                <p className="text-xs capitalize">{block.border.type}</p>
              ) : (
                <p className="text-xs opacity-40">Add...</p>
              )}
            </div>
            {block?.border && (
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
            <p className="text-xs font-semibold">Border</p>
            <div
              role="presentation"
              className="p-1 -mr-1 cursor-pointer"
              onClick={() => setOpen(false)}
            >
              <Cross2Icon className="h-3.5 w-3.5 opacity-50" />
            </div>
          </div>
          <div className="flex flex-col gap-2.5">
            <ColorControl
              name="Color"
              value={block?.border?.color}
              disableGradient
              onChange={(e) => {
                if (block) {
                  editor.updateBlockValues(id, {
                    border: {
                      ...block.border,
                      color: e,
                    },
                  });
                }
              }}
            />
            <ControllerRow label="Style">
              <select
                name="type"
                id="type"
                value={block?.border?.type}
                onChange={(e) => {
                  if (block) {
                    editor.updateBlockValues(id, {
                      border: {
                        ...block.border,
                        type: e.target.value as IBorderType,
                      },
                    });
                  }
                }}
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
            <ControllerRow label="Width">
              <NumberInput
                value={
                  block?.border?.width?.type === "all"
                    ? block?.border?.width.top
                    : parseFloat("")
                }
                onChange={(e) => {
                  if (block) {
                    editor.updateBlockValues(id, {
                      border: {
                        ...block.border,
                        width: {
                          type: "all",
                          top: e,
                          right: e,
                          bottom: e,
                          left: e,
                        },
                      },
                    });
                  }
                }}
                min={0}
              />
              <Tabs
                value={block?.border?.width?.type}
                className="w-[140px]"
                onValueChange={(e) => {
                  if (block) {
                    editor.updateBlockValues(id, {
                      border: {
                        ...block.border,
                        width: {
                          ...block.border?.width,
                          type: e as "all" | "single",
                        },
                      },
                    });
                  }
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
              <ControllerRow>
                <div>
                  <div className="flex">
                    <NumberInput
                      className="rounded-tr-none rounded-br-none"
                      value={block?.border.width.top}
                      onChange={(e) => {
                        if (block) {
                          editor.updateBlockValues(id, {
                            border: {
                              ...block.border,
                              width: {
                                ...block.border?.width,
                                top: e,
                              },
                            },
                          });
                        }
                      }}
                      min={0}
                    />
                    <NumberInput
                      className="rounded-l-none rounded-r-none"
                      value={block?.border.width.right}
                      onChange={(e) => {
                        if (block) {
                          editor.updateBlockValues(id, {
                            border: {
                              ...block.border,
                              width: {
                                ...block.border?.width,
                                right: e,
                              },
                            },
                          });
                        }
                      }}
                      min={0}
                    />
                    <NumberInput
                      className="rounded-l-none rounded-r-none"
                      value={block?.border.width.bottom}
                      onChange={(e) => {
                        if (block) {
                          editor.updateBlockValues(id, {
                            border: {
                              ...block.border,
                              width: {
                                ...block.border?.width,
                                bottom: e,
                              },
                            },
                          });
                        }
                      }}
                      min={0}
                    />
                    <NumberInput
                      className="rounded-tl-none rounded-bl-none"
                      value={block?.border.width.left}
                      onChange={(e) => {
                        if (block) {
                          editor.updateBlockValues(id, {
                            border: {
                              ...block.border,
                              width: {
                                ...block.border?.width,
                                left: e,
                              },
                            },
                          });
                        }
                      }}
                      min={0}
                    />
                  </div>
                  <div className="pt-1 flex justify-between *:flex-1 *:text-[9px] *:text-center *:text-foreground/40">
                    <span>T</span>
                    <span>R</span>
                    <span>B</span>
                    <span>L</span>
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
