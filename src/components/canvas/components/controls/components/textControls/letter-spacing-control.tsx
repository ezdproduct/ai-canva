import type { IEditorBlockText } from "@/lib/schema";
import type { EditorContextType } from "@/components/canvas/use-editor";
import { NumberInput } from "@/components/ui/input";
import ControllerRow from "../controller-row";

interface LetterSpacingControlProps {
  editor: EditorContextType;
  id: string;
  block: IEditorBlockText | undefined;
  className?: string;
}

function LetterSpacingControl({
  editor,
  id,
  block,
  className,
}: LetterSpacingControlProps) {
  const onChange = (v: number) => {
    if (block) {
      const el = editor.getBlockElement(block.id);
      if (el && el?.scrollHeight > el?.clientHeight) {
        editor.updateBlockValues(block.id, {
          letterSpacing: v,
          height: (el?.scrollHeight || block.height) + 2,
        } as Parameters<typeof editor.updateBlockValues>[1]);
      } else {
        editor.updateBlockValues(id, {
          letterSpacing: v,
        } as Parameters<typeof editor.updateBlockValues>[1]);
      }
    }
  };
  return (
    <ControllerRow
      label="Spacing"
      className={className}
      contentClassName="gap-3"
    >
      <NumberInput
        min={-5}
        max={200}
        value={block?.letterSpacing}
        onChange={onChange}
      />
      <input
        type="range"
        className="h-1 w-full cursor-pointer"
        value={block?.letterSpacing}
        max={50}
        min={0}
        onChange={(e) => {
          onChange(parseInt(e.target.value, 10));
        }}
      />
    </ControllerRow>
  );
}

export default LetterSpacingControl;
