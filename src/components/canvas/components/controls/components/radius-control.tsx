import { IEditorBlocks } from "@/components/canvas/editor-types";
import { EditorContextType } from "@/components/canvas/use-editor";
import { BoxIcon } from "@radix-ui/react-icons";
import { NumberInput } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TbBorderSides } from "react-icons/tb";
import ControllerRow from "./controller-row";

function RadiusControl({
  editor,
  id,
  block,
}: {
  editor: EditorContextType;
  id: string;
  block: IEditorBlocks | undefined;
}) {
  return (
    <>
      <ControllerRow label="Radius">
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
          onValueChange={(e) => {
            if (block) {
              editor.updateBlockValues(id, {
                radius: {
                  ...block.radius,
                  type: e as "all" | "single",
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
        <ControllerRow>
          <div>
            <div className="flex">
              <NumberInput
                className="rounded-tr-none rounded-br-none"
                value={block?.radius.tl}
                onChange={(e) => {
                  if (block) {
                    editor.updateBlockValues(id, {
                      radius: {
                        ...block.radius,
                        tl: e,
                      },
                    });
                  }
                }}
                min={0}
              />
              <NumberInput
                className="rounded-l-none rounded-r-none"
                value={block?.radius.tr}
                onChange={(e) => {
                  if (block) {
                    editor.updateBlockValues(id, {
                      radius: {
                        ...block.radius,
                        tr: e,
                      },
                    });
                  }
                }}
                min={0}
              />
              <NumberInput
                className="rounded-l-none rounded-r-none"
                value={block?.radius.br}
                onChange={(e) => {
                  if (block) {
                    editor.updateBlockValues(id, {
                      radius: {
                        ...block.radius,
                        br: e,
                      },
                    });
                  }
                }}
                min={0}
              />
              <NumberInput
                className="rounded-tl-none rounded-bl-none"
                value={block?.radius.bl}
                onChange={(e) => {
                  if (block) {
                    editor.updateBlockValues(id, {
                      radius: {
                        ...block.radius,
                        bl: e,
                      },
                    });
                  }
                }}
                min={0}
              />
            </div>
            <div className="pt-1 flex justify-between *:flex-1 *:text-[9px] *:text-center *:text-foreground/40">
              <span>TL</span>
              <span>TR</span>
              <span>BR</span>
              <span>BL</span>
            </div>
          </div>
        </ControllerRow>
      )}
    </>
  );
}

export default RadiusControl;
