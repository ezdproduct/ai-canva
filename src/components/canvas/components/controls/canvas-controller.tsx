import { NumberInput } from "@/components/ui/input";
import { EditorContextType } from "../../use-editor";
import ControllerBox from "./components/controller-box";
import ColorControl from "./components/color-control";
import ControllerRow from "./components/controller-row";

function CanvasController({ editor }: { editor: EditorContextType }) {
  return (
    <ControllerBox label="Canvas">
      <ControllerRow label="Size">
        <NumberInput
          leftChild={<p className="text-xs text-foreground/40">W</p>}
          value={editor.canvasState.size.width}
          onChange={(e) => {
            if (!Number.isNaN(e)) {
              editor.setCanvasState({
                ...editor.canvasState,
                size: {
                  ...editor.canvasState.size,
                  width: e,
                },
              });
            }
          }}
          min={2}
        />
        <NumberInput
          leftChild={<p className="text-xs text-foreground/40">H</p>}
          value={editor.canvasState.size.height}
          onChange={(e) => {
            if (!Number.isNaN(e)) {
              editor.setCanvasState({
                ...editor.canvasState,
                size: {
                  ...editor.canvasState.size,
                  height: e,
                },
              });
            }
          }}
          min={2}
        />
      </ControllerRow>
      <ColorControl
        name="Fill"
        value={editor.canvasState?.background}
        onChange={(e) => {
          editor.setCanvasState({
            ...editor.canvasState,
            background: e,
          });
        }}
      />
    </ControllerBox>
  );
}

export default CanvasController;
