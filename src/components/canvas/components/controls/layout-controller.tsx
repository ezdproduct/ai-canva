import { NumberInput } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type { EditorContextType } from "../../use-editor";
import type { IEditorBlocks } from "../../editor-types";
import ControllerRow from "./components/controller-row";

interface LayoutControllerProps {
  editor: EditorContextType;
  id: string;
  block: IEditorBlocks | undefined;
  className?: string;
}

function LayoutController({ editor, id, block, className }: LayoutControllerProps) {
  return (
    <div className={cn("flex flex-col gap-2.5 p-4", className)}>
      <p className="mb-1 text-sm font-semibold">Layout</p>

      <ControllerRow label="Position" contentClassName="gap-3">
        <NumberInput
          leftChild={<span className="text-xs text-muted-foreground">X</span>}
          value={block?.x}
          onChange={(value) => {
            editor.updateBlockValues(id, {
              x: value,
            });
          }}
        />
        <NumberInput
          leftChild={<span className="text-xs text-muted-foreground">Y</span>}
          value={block?.y}
          onChange={(value) => {
            editor.updateBlockValues(id, {
              y: value,
            });
          }}
        />
      </ControllerRow>

      <ControllerRow label="Size" contentClassName="gap-3">
        <NumberInput
          leftChild={<span className="text-xs text-muted-foreground">W</span>}
          value={block?.width}
          min={2}
          onChange={(value) => {
            if (Number.isNaN(value) || !block) {
              return;
            }
            if (block.type === "image") {
              const aspectRatio = block.width / block.height;
              editor.updateBlockValues(id, {
                width: value,
                height: Number.parseFloat((value / aspectRatio).toFixed(1)),
              });
            } else {
              editor.updateBlockValues(id, { width: value });
            }
          }}
        />
        <NumberInput
          leftChild={<span className="text-xs text-muted-foreground">H</span>}
          value={block?.height}
          min={2}
          onChange={(value) => {
            if (Number.isNaN(value) || !block) {
              return;
            }
            if (block.type === "image") {
              const aspectRatio = block.width / block.height;
              editor.updateBlockValues(id, {
                height: value,
                width: Number.parseFloat((value * aspectRatio).toFixed(1)),
              });
            } else {
              editor.updateBlockValues(id, { height: value });
            }
          }}
        />
      </ControllerRow>

      <ControllerRow label="Rotate" contentClassName="gap-3">
        <NumberInput
          value={block?.rotate?.value}
          onChange={(value) => {
            if (!block) {
              return;
            }
            editor.updateBlockValues(id, {
              rotate: {
                ...block.rotate,
                type: "2d",
                value,
              },
            });
          }}
        />
        <Tabs
          value={block?.rotate?.type || "2d"}
          className="w-full"
          onValueChange={(value) => {
            if (!block) {
              return;
            }
            editor.updateBlockValues(id, {
              rotate: {
                value: value === "3d" ? 0 : 0,
                valueX: 0,
                valueY: 0,
                valueZ: 0,
                type: value as "2d" | "3d",
              },
            });
          }}
        >
          <TabsList>
            <TabsTrigger value="2d">2D</TabsTrigger>
            <TabsTrigger value="3d">3D</TabsTrigger>
          </TabsList>
        </Tabs>
      </ControllerRow>

      {block?.rotate?.type === "3d" && (
        <ControllerRow contentClassName="flex-col gap-2">
          <div className="flex">
            <NumberInput
              className="rounded-tr-none rounded-br-none"
              value={block?.rotate?.valueX}
              onChange={(value) => {
                if (!block) {
                  return;
                }
                editor.updateBlockValues(id, {
                  rotate: {
                    ...block.rotate,
                    type: "3d",
                    valueX: value,
                  },
                });
              }}
            />
            <NumberInput
              className="rounded-none"
              value={block?.rotate?.valueY}
              onChange={(value) => {
                if (!block) {
                  return;
                }
                editor.updateBlockValues(id, {
                  rotate: {
                    ...block.rotate,
                    type: "3d",
                    valueY: value,
                  },
                });
              }}
            />
            <NumberInput
              className="rounded-tl-none rounded-bl-none"
              value={block?.rotate?.valueZ}
              onChange={(value) => {
                if (!block) {
                  return;
                }
                editor.updateBlockValues(id, {
                  rotate: {
                    ...block.rotate,
                    type: "3d",
                    valueZ: value,
                  },
                });
              }}
            />
          </div>
          <div className="flex justify-between text-[9px] text-foreground/40">
            <span>X</span>
            <span>Y</span>
            <span>Z</span>
          </div>
        </ControllerRow>
      )}
    </div>
  );
}

export default LayoutController;
