import {
  IEditorBlockText,
  ITextDecoration,
} from "@/components/canvas/editor-types";
import { EditorContextType } from "@/components/canvas/use-editor";
import ControllerRow from "../controller-row";

function TextDecorationControl({
  editor,
  id,
  block,
}: {
  editor: EditorContextType;
  id: string;
  block: IEditorBlockText | undefined;
}) {
  return (
    <ControllerRow label="Decoration">
      <select
        name="textDecoration"
        id="textDecoration"
        value={block?.textDecoration || "inherit"}
        onChange={(e) => {
          if (block) {
            editor.updateBlockValues(id, {
              textDecoration: e.target.value as ITextDecoration,
            });
          }
        }}
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
