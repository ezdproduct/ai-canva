import { IEditorBlockText } from "@/components/canvas/editor-types";
import { EditorContextType } from "@/components/canvas/use-editor";
import { Input } from "@/components/ui/input";
import ControllerRow from "../controller-row";

function ContentControl({
  editor,
  id,
  block,
}: {
  editor: EditorContextType;
  id: string;
  block: IEditorBlockText | undefined;
}) {
  return (
    <ControllerRow label="Content">
      <Input
        value={block?.text}
        onChange={(e) => {
          if (block) {
            const el = document.querySelector(`.block-${block.id}`) as Element;
            if (el && el?.scrollHeight > el?.clientHeight) {
              editor.updateBlockValues(block.id, {
                text: e.target.value,
                height: (el?.scrollHeight || block.height) + 2,
              });
            } else {
              editor.updateBlockValues(id, {
                text: e.target.value,
              });
            }
          }
        }}
        onPaste={() => {
          if (block) {
            setTimeout(() => {
              const el = document.querySelector(
                `.block-${block.id}`
              ) as Element;
              if (el && el?.scrollHeight > el?.clientHeight) {
                editor.updateBlockValues(block.id, {
                  height: (el?.scrollHeight || block.height) + 2,
                });
              }
            }, 100);
          }
        }}
      />
    </ControllerRow>
  );
}

export default ContentControl;
