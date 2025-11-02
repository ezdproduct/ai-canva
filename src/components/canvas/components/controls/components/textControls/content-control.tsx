import type { IEditorBlockText } from "@/lib/schema";
import type { EditorContextType } from "@/components/canvas/use-editor";
import { Input } from "@/components/ui/input";
import ControllerRow from "../controller-row";

interface ContentControlProps {
  editor: EditorContextType;
  id: string;
  block: IEditorBlockText | undefined;
  className?: string;
}

function ContentControl({
  editor,
  id,
  block,
  className,
}: ContentControlProps) {
  return (
    <ControllerRow label="Content" className={className}
      contentClassName="gap-3">
      <Input
        value={block?.text}
        onChange={(e) => {
          if (block) {
            const el = editor.getBlockElement(block.id);
            if (el && el?.scrollHeight > el?.clientHeight) {
              editor.updateBlockValues(block.id, {
                text: e.target.value,
                height: (el?.scrollHeight || block.height) + 2,
              } as Parameters<typeof editor.updateBlockValues>[1]);
            } else {
              editor.updateBlockValues(id, {
                text: e.target.value,
              } as Parameters<typeof editor.updateBlockValues>[1]);
            }
          }
        }}
        onPaste={() => {
          if (block) {
            setTimeout(() => {
              const el = editor.getBlockElement(block.id);
              if (el && el?.scrollHeight > el?.clientHeight) {
                editor.updateBlockValues(block.id, {
                  height: (el?.scrollHeight || block.height) + 2,
                } as Parameters<typeof editor.updateBlockValues>[1]);
              }
            }, 100);
          }
        }}
      />
    </ControllerRow>
  );
}

export default ContentControl;
