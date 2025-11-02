import type {
  IEditorBlockText,
  ITextTransform,
} from "@/lib/schema";
import type { EditorContextType } from "@/components/canvas/use-editor";
import ControllerRow from "../controller-row";

interface TextTransformControlProps {
  editor: EditorContextType;
  id: string;
  block: IEditorBlockText | undefined;
  className?: string;
}

function TextTransformControl({
  editor,
  id,
  block,
  className,
}: TextTransformControlProps) {
  return (
    <ControllerRow label="Transform" className={className} contentClassName="justify-between">
      <select
        name="textTransform"
        id="textTransform"
        value={block?.textTransform || "inherit"}
        onChange={(e) => {
          if (block) {
            editor.updateBlockValues(id, {
              textTransform: e.target.value as ITextTransform,
            } as Parameters<typeof editor.updateBlockValues>[1]);
          }
        }}
        className="h-8 w-full rounded-md border border-border bg-background px-2 text-xs"
      >
        <option value="inherit">Default</option>
        <option value="capitalize">Capitalize</option>
        <option value="uppercase">Uppercase</option>
        <option value="lowercase">Lowercase</option>
      </select>
    </ControllerRow>
  );
}

export default TextTransformControl;
