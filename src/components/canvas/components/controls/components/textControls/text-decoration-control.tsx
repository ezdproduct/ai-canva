import type {
  IEditorBlockText,
  ITextDecoration,
} from "@/lib/schema";
import type { EditorContextType } from "@/components/canvas/use-editor";
import ControllerRow from "../controller-row";

interface TextDecorationControlProps {
  editor: EditorContextType;
  id: string;
  block: IEditorBlockText | undefined;
  className?: string;
}

function TextDecorationControl({
  editor,
  id,
  block,
  className,
}: TextDecorationControlProps) {
  return (
    <ControllerRow
      label="Decoration"
      className={className}
      contentClassName="justify-between"
    >
      <select
        name="textDecoration"
        id="textDecoration"
        value={block?.textDecoration || "inherit"}
        onChange={(e) => {
          if (block) {
            editor.updateBlockValues(id, {
              textDecoration: e.target.value as ITextDecoration,
            } as Parameters<typeof editor.updateBlockValues>[1]);
          }
        }}
        className="h-8 w-full rounded-md border border-border bg-background px-2 text-xs"
      >
        <option value="inherit">Default</option>
        <option value="overline">Overline</option>
        <option value="line-through">Line Through</option>
        <option value="underline">Underline</option>
      </select>
    </ControllerRow>
  );
}

export default TextDecorationControl;
