import type { IEditorBlocks } from "@/lib/schema";
import type { EditorContextType } from "@/components/canvas/use-editor";
import { NumberInput } from "@/components/ui/input";
import ControllerRow from "./controller-row";

interface OpacityControlProps {
  editor: EditorContextType;
  id: string;
  block: IEditorBlocks | undefined;
  className?: string;
}

function OpacityControl({ editor, id, block, className }: OpacityControlProps) {
  return (
    <ControllerRow label="Opacity" className={className} contentClassName="gap-3">
      <NumberInput
        min={0}
        max={100}
        value={block?.opacity}
        onChange={(e) => {
          if (block) {
            editor.updateBlockValues(id, {
              opacity: e,
            });
          }
        }}
      />
      <input
        type="range"
        className="h-1 w-full cursor-pointer"
        value={block?.opacity ?? 0}
        max={100}
        min={0}
        onChange={(event) => {
          if (block) {
            editor.updateBlockValues(id, {
              opacity: Number.parseInt(event.target.value, 10),
            });
          }
        }}
      />
    </ControllerRow>
  );
}

export default OpacityControl;
