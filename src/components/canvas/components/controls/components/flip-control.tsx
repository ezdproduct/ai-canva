import { IEditorBlocks } from "@/components/canvas/editor-types";
import { EditorContextType } from "@/components/canvas/use-editor";
import { PiFlipHorizontalFill, PiFlipVerticalFill } from "react-icons/pi";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import ControllerRow from "./controller-row";

function FlipControl({
  editor,
  id,
  block,
}: {
  editor: EditorContextType;
  id: string;
  block: IEditorBlocks | undefined;
}) {
  return (
    <ControllerRow label="Flip">
      <div className="flex gap-2 w-full">
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
      </div>
    </ControllerRow>
  );
}

export default FlipControl;
