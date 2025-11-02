import type { IEditorBlocks } from "@/lib/schema";
import type { EditorContextType } from "@/components/canvas/use-editor";
import { BoxIcon } from "@radix-ui/react-icons";
import { NumberInput } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TbBorderSides } from "react-icons/tb";
import ControllerRow from "./controller-row";

interface RadiusControlProps {
  editor: EditorContextType;
  id: string;
  block: IEditorBlocks | undefined;
  className?: string;
}

function RadiusControl({ editor, id, block, className }: RadiusControlProps) {
  return (
    <>
      <ControllerRow label="Radius" className={className} contentClassName="gap-3">
        <NumberInput
          min={0}
          value={
            block?.radius?.type === "all" ? block?.radius.tl : parseFloat("")
          }
          onChange={(e) => {
            if (block) {
              editor.updateBlockValues(id, {
                radius: {
                  type: "all",
                  tl: e,
                  tr: e,
                  br: e,
                  bl: e,
                },
              });
            }
          }}
        />
        <Tabs
          value={block?.radius?.type}
          className="w-full"
          onValueChange={(value) => {
            if (block) {
              editor.updateBlockValues(id, {
                radius: {
                  ...block.radius,
                  type: value as "all" | "single",
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
      {block?.radius?.type === "single" && (
        <ControllerRow contentClassName="flex-col gap-2">
          <div className="flex">
            <NumberInput
              className="rounded-tr-none rounded-br-none"
              value={block?.radius.tl}
              onChange={(value) => {
                if (block) {
                  editor.updateBlockValues(id, {
                    radius: {
                      ...block.radius,
                      tl: value,
                    },
                  });
                }
              }}
              min={0}
            />
            <NumberInput
              className="rounded-none"
              value={block?.radius.tr}
              onChange={(value) => {
                if (block) {
                  editor.updateBlockValues(id, {
                    radius: {
                      ...block.radius,
                      tr: value,
                    },
                  });
                }
              }}
              min={0}
            />
            <NumberInput
              className="rounded-none"
              value={block?.radius.br}
              onChange={(value) => {
                if (block) {
                  editor.updateBlockValues(id, {
                    radius: {
                      ...block.radius,
                      br: value,
                    },
                  });
                }
              }}
              min={0}
            />
            <NumberInput
              className="rounded-tl-none rounded-bl-none"
              value={block?.radius.bl}
              onChange={(value) => {
                if (block) {
                  editor.updateBlockValues(id, {
                    radius: {
                      ...block.radius,
                      bl: value,
                    },
                  });
                }
              }}
              min={0}
            />
          </div>
          <div className="flex justify-between text-[9px] text-foreground/40">
            <span>TL</span>
            <span>TR</span>
            <span>BR</span>
            <span>BL</span>
          </div>
        </ControllerRow>
      )}
    </>
  );
}

export default RadiusControl;
