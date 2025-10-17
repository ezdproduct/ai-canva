import { IEditorBlockText } from "@/components/canvas/editor-types";
import { EditorContextType } from "@/components/canvas/use-editor";
import { NumberInput } from "@/components/ui/input";
import ControllerRow from "../controller-row";

function FontSizeControl({
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
      const lineHeightRatio = block.lineHeight / block.fontSize;
      const newLineHeight = Math.round(lineHeightRatio * v);
      if (el && el?.scrollHeight > el?.clientHeight) {
        editor.updateBlockValues(block.id, {
          fontSize: v,
          height: (el?.scrollHeight || block.height) + 2,
          lineHeight: newLineHeight,
        });
      } else {
        editor.updateBlockValues(id, {
          fontSize: v,
          lineHeight: newLineHeight,
        });
      }
    }
  };
  return (
    <ControllerRow label="Size">
      <NumberInput
        min={0}
        max={500}
        value={block?.fontSize}
        onChange={onChange}
      />
      <input
        type="range"
        value={block?.fontSize}
        max={100}
        min={5}
        onChange={(e) => {
          onChange(parseInt(e.target.value, 10));
        }}
      />
    </ControllerRow>
  );
}

export default FontSizeControl;
