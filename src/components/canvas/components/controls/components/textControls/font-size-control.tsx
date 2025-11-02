import type { IEditorBlockText } from "@/lib/schema";
import type { EditorContextType } from "@/components/canvas/use-editor";
import { NumberInput } from "@/components/ui/input";
import ControllerRow from "../controller-row";

interface FontSizeControlProps {
  editor: EditorContextType;
  id: string;
  block: IEditorBlockText | undefined;
  className?: string;
}

function FontSizeControl({
  editor,
  id,
  block,
  className,
}: FontSizeControlProps) {
  const onChange = (v: number) => {
    if (block) {
      const el = editor.getBlockElement(block.id);
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
    <ControllerRow label="Size" className={className} contentClassName="gap-3">
      <NumberInput
        min={0}
        max={500}
        value={block?.fontSize}
        onChange={onChange}
      />
      <input
        type="range"
        className="h-1 w-full cursor-pointer"
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
