import { IEditorBlockText } from "@/components/canvas/editor-types";
import { EditorContextType } from "@/components/canvas/use-editor";
import { NumberInput } from "@/components/ui/input";
import ControllerRow from "../controller-row";

function LetterSpacingControl({
  editor,
  id,
  block,
}: {
  editor: EditorContextType;
  id: string;
  block: IEditorBlockText | undefined;
}) {
  const onChange = (v: number) => {
    if (block) {
      const el = document.querySelector(`.block-${block.id}`) as Element;
      if (el && el?.scrollHeight > el?.clientHeight) {
        editor.updateBlockValues(block.id, {
          letterSpacing: v,
          height: (el?.scrollHeight || block.height) + 2,
        });
      } else {
        editor.updateBlockValues(id, {
          letterSpacing: v,
        });
      }
    }
  };
  return (
    <ControllerRow label="Spacing">
      <NumberInput
        min={-5}
        max={200}
        value={block?.letterSpacing}
        onChange={onChange}
      />
      <input
        type="range"
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
