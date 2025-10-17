import { IEditorBlocks } from "@/components/canvas/editor-types";
import { EditorContextType } from "@/components/canvas/use-editor";
import { NumberInput } from "@/components/ui/input";
import ControllerRow from "./controller-row";

function OpacityControl({
  editor,
  id,
  block,
}: {
  editor: EditorContextType;
  id: string;
  block: IEditorBlocks | undefined;
}) {
  return (
    <ControllerRow label="Opacity">
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
        value={block?.opacity}
        max={100}
        min={0}
        onChange={(e) => {
          if (block) {
            editor.updateBlockValues(id, {
              opacity: parseInt(e.target.value, 10),
            });
          }
        }}
      />
    </ControllerRow>
  );
}

export default OpacityControl;
