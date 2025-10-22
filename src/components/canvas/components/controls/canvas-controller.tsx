import { NumberInput } from "@/components/ui/input";
import type { EditorContextType } from "../../use-editor";
import ControllerBox from "./components/controller-box";
import ColorControl from "./components/color-control";
import ControllerRow from "./components/controller-row";

interface CanvasControllerProps {
  editor: EditorContextType;
  className?: string;
}

function CanvasController({ editor, className }: CanvasControllerProps) {
  return (
    <ControllerBox title="Canvas" className={className}>
      <ControllerRow label="Size" contentClassName="gap-3">
        <NumberInput
          leftChild={<span className="text-xs text-muted-foreground">W</span>}
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
          leftChild={<span className="text-xs text-muted-foreground">H</span>}
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
        className="justify-between"
      />
    </ControllerBox>
  );
}

export default CanvasController;
