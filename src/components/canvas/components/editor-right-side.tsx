import * as React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import LayoutController from "./controls/layout-controller";
import type { EditorContextType } from "../use-editor";
import type { IEditorBlockText, IEditorBlockType } from "../editor-types";
import TextController from "./controls/text-controller";
import LayerController from "./controls/layer-controller";
import CanvasController from "./controls/canvas-controller";

interface EditorRightSideProps {
  editor: EditorContextType;
  className?: string;
}

function EditorRightSide({ editor, className }: EditorRightSideProps) {
  const activeBlockId = editor.selectedBlocks[0]?.id ?? null;

  const activeBlock = React.useMemo(() => {
    if (!activeBlockId) {
      return null;
    }
    return editor.blocks.find((block) => block.id === activeBlockId) ?? null;
  }, [activeBlockId, editor.blocks]);

  const blockType = React.useMemo<IEditorBlockType | null>(() => {
    if (editor.selectedBlocks.length !== 1) {
      return null;
    }
    return (
      editor.selectedBlocks[0]?.getAttribute("data-block-type") as
        | IEditorBlockType
        | null
    ) ?? null;
  }, [editor.selectedBlocks]);

  return (
    <div
      className={cn(
        "relative z-20 flex w-64 flex-col border-l border-border bg-background",
        className
      )}
    >
      <ScrollArea>
        {activeBlock && blockType ? (
          <>
            <LayoutController
              editor={editor}
              id={activeBlock.id}
              block={activeBlock}
            />
            {blockType === "text" ? (
              <TextController
                editor={editor}
                id={activeBlock.id}
                block={activeBlock as IEditorBlockText}
              />
            ) : null}
            <LayerController
              editor={editor}
              id={activeBlock.id}
              block={activeBlock}
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
