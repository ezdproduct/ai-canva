import type { IEditorBlocks } from "@/components/canvas/editor-types";
import type { EditorContextType } from "@/components/canvas/use-editor";
import { PiFlipHorizontalFill, PiFlipVerticalFill } from "react-icons/pi";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import ControllerRow from "./controller-row";

interface FlipControlProps {
  editor: EditorContextType;
  id: string;
  block: IEditorBlocks | undefined;
  className?: string;
}

function FlipControl({ editor, id, block, className }: FlipControlProps) {
  return (
    <ControllerRow label="Flip" className={className} contentClassName="gap-2">
      <Button
        variant="outline"
        size="icon"
        className={cn("h-7 w-7", {
          "bg-border hover:bg-border": block?.flip?.horizontal,
        })}
        onClick={() => {
          editor.updateBlockValues(id, {
            flip: {
              ...block?.flip,
              horizontal: !block?.flip?.horizontal,
            },
          });
        }}
      >
        <PiFlipHorizontalFill />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className={cn("h-7 w-7", {
          "bg-border hover:bg-border": block?.flip?.verticle,
        })}
        onClick={() => {
          editor.updateBlockValues(id, {
            flip: {
              ...block?.flip,
              verticle: !block?.flip?.verticle,
            },
          });
        }}
      >
        <PiFlipVerticalFill />
      </Button>
    </ControllerRow>
  );
}

export default FlipControl;
