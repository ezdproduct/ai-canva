import { NumberInput } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EditorContextType } from "../../use-editor";
import { IEditorBlocks } from "../../editor-types";
import ControllerRow from "./components/controller-row";

function LayoutController({
  editor,
  id,
  block,
}: {
  editor: EditorContextType;
  id: string;
  block: IEditorBlocks | undefined;
}) {
  return (
    <div className="p-4 flex flex-col gap-2.5">
      <p className="text-sm font-semibold mb-1">Layout</p>
      <ControllerRow label="Position">
        <NumberInput
          value={block?.x}
          onChange={(e) => {
            editor.updateBlockValues(id, {
              x: e,
            });
          }}
          leftChild={<p className="text-xs text-foreground/40">X</p>}
        />
        <NumberInput
          leftChild={<p className="text-xs text-foreground/40">Y</p>}
          value={block?.y}
          onChange={(e) => {
            editor.updateBlockValues(id, {
              y: e,
            });
          }}
        />
      </ControllerRow>
      <ControllerRow label="Size">
        <NumberInput
          leftChild={<p className="text-xs text-foreground/40">W</p>}
          value={block?.width}
          onChange={(e) => {
            if (!Number.isNaN(e)) {
              if (block?.type === "image") {
                const aspectRatio = block.width / block.height;
                editor.updateBlockValues(id, {
                  width: e,
                  height: parseFloat((e / aspectRatio).toFixed(1)),
                });
              } else {
                editor.updateBlockValues(id, {
                  width: e,
                });
              }
            }
          }}
          min={2}
        />
        <NumberInput
          leftChild={<p className="text-xs text-foreground/40">H</p>}
          value={block?.height}
          onChange={(e) => {
            if (!Number.isNaN(e)) {
              if (block?.type === "image") {
                const aspectRatio = block.width / block.height;
                editor.updateBlockValues(id, {
                  height: e,
                  width: parseFloat((e * aspectRatio).toFixed(1)),
                });
              } else {
                editor.updateBlockValues(id, {
                  height: e,
                });
              }
            }
          }}
          min={2}
        />
      </ControllerRow>
      <ControllerRow label="Rotate">
        <NumberInput
          value={block?.rotate?.value}
          onChange={(e) => {
            if (block) {
              editor.updateBlockValues(id, {
                rotate: {
                  ...block.rotate,
                  type: "2d",
                  value: e,
                },
              });
            }
          }}
        />
        <Tabs
          value={block?.rotate?.type || "2d"}
          className="w-full"
          onValueChange={(e) => {
            if (block) {
              editor.updateBlockValues(id, {
                rotate: {
                  value: e === "3d" ? parseFloat("") : 0,
                  valueX: 0,
                  valueY: 0,
                  valueZ: 0,
                  type: e as "2d" | "3d",
                },
              });
            }
          }}
        >
          <TabsList>
            <TabsTrigger value="2d">2D</TabsTrigger>
            <TabsTrigger value="3d">3D</TabsTrigger>
          </TabsList>
        </Tabs>
      </ControllerRow>
      {block?.rotate?.type === "3d" && (
        <ControllerRow>
          <div>
            <div className="flex">
              <NumberInput
                className="rounded-tr-none rounded-br-none"
                value={block?.rotate?.valueX}
                onChange={(e) => {
                  if (block) {
                    editor.updateBlockValues(id, {
                      rotate: {
                        ...block.rotate,
                        type: "3d",
                        valueX: e,
                      },
                    });
                  }
                }}
              />
              <NumberInput
                value={block?.rotate?.valueY}
                className="rounded-none"
                onChange={(e) => {
                  if (block) {
                    editor.updateBlockValues(id, {
                      rotate: {
                        ...block.rotate,
                        type: "3d",
                        valueY: e,
                      },
                    });
                  }
                }}
              />
              <NumberInput
                className="rounded-tl-none rounded-bl-none"
                value={block?.rotate?.valueZ}
                onChange={(e) => {
                  if (block) {
                    editor.updateBlockValues(id, {
                      rotate: {
                        ...block.rotate,
                        type: "3d",
                        valueZ: e,
                      },
                    });
                  }
                }}
              />
            </div>
            <div className="pt-1 flex justify-between *:flex-1 *:text-[9px] *:text-center *:text-foreground/40">
              <span>X</span>
              <span>Y</span>
              <span>Z</span>
            </div>
          </div>
        </ControllerRow>
      )}
    </div>
  );
}

export default LayoutController;
