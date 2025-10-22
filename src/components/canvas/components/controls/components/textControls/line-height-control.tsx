import type { IEditorBlockText } from "@/components/canvas/editor-types";
import type { EditorContextType } from "@/components/canvas/use-editor";
import { NumberInput } from "@/components/ui/input";
import ControllerRow from "../controller-row";

interface LineHeightControlProps {
  editor: EditorContextType;
  id: string;
  block: IEditorBlockText | undefined;
  className?: string;
}

function LineHeightControl({
  editor,
  id,
  block,
  className,
}: LineHeightControlProps) {
  const onChange = (v: number) => {
    if (block) {
      const el = editor.getBlockElement(block.id);
      if (el && el?.scrollHeight > el?.clientHeight) {
        editor.updateBlockValues(block.id, {
          lineHeight: v,
          height: (el?.scrollHeight || block.height) + 2,
        });
      } else {
        editor.updateBlockValues(id, {
          lineHeight: v,
        });
      }
    }
  };
  return (
    <ControllerRow label="Line" className={className} contentClassName="gap-3">
      <NumberInput
        min={0}
        max={500}
        value={block?.lineHeight}
        onChange={onChange}
      />
      <input
        type="range"
        className="h-1 w-full cursor-pointer"
        value={block?.lineHeight}
        max={100}
        min={5}
        onChange={(e) => {
          onChange(parseInt(e.target.value, 10));
        }}
      />
    </ControllerRow>
  );
}

export default LineHeightControl;
