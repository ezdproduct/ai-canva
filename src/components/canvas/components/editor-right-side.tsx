import { ScrollArea } from "@/components/ui/scroll-area";
import { useMemo } from "react";
import LayoutController from "./controls/layout-controller";
import { EditorContextType } from "../use-editor";
import { IEditorBlockText, IEditorBlockType } from "../editor-types";
import TextController from "./controls/text-controller";
import LayerController from "./controls/layer-controller";
import CanvasController from "./controls/canvas-controller";

function EditorRightSide({ editor }: { editor: EditorContextType }) {
  const blockType = useMemo(() => {
    if (editor?.selectedBlocks?.length === 1) {
      const type = (editor?.selectedBlocks?.[0]?.getAttribute(
        "data-block-type"
      ) || null) as IEditorBlockType | null;
      return type;
    }
    return null;
  }, [editor.selectedBlocks]);

  return (
    <div className="border-l border-border w-64 flex flex-col z-20 relative bg-background">
      <ScrollArea>
        {blockType &&
        editor?.selectedBlocks?.[0]?.id &&
        editor.blocks.find((e) => e.id === editor?.selectedBlocks?.[0]?.id) ? (
          <>
            <LayoutController
              editor={editor}
              id={editor?.selectedBlocks?.[0]?.id}
              block={editor.blocks.find(
                (e) => e.id === editor?.selectedBlocks?.[0]?.id
              )}
            />
            {blockType === "text" && (
              <TextController
                editor={editor}
                id={editor?.selectedBlocks?.[0]?.id}
                block={
                  editor.blocks.find(
                    (e) => e.id === editor?.selectedBlocks?.[0]?.id
                  ) as IEditorBlockText
                }
              />
            )}
            <LayerController
              editor={editor}
              id={editor?.selectedBlocks?.[0]?.id}
              block={editor.blocks.find(
                (e) => e.id === editor?.selectedBlocks?.[0]?.id
              )}
            />
          </>
        ) : (
          <CanvasController editor={editor} />
        )}
      </ScrollArea>
    </div>
  );
}

export default EditorRightSide;
