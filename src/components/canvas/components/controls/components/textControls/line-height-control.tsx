import { IEditorBlockText } from "@/components/canvas/editor-types";
import { EditorContextType } from "@/components/canvas/use-editor";
import { NumberInput } from "@/components/ui/input";
import ControllerRow from "../controller-row";

function LineHeightControl({
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
    <ControllerRow label="Line">
      <NumberInput
        min={0}
        max={500}
        value={block?.lineHeight}
        onChange={onChange}
      />
      <input
        type="range"
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
