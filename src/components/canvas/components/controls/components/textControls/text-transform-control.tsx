import {
  IEditorBlockText,
  ITextTransform,
} from "@/components/canvas/editor-types";
import { EditorContextType } from "@/components/canvas/use-editor";
import ControllerRow from "../controller-row";

function TextTransformControl({
  editor,
  id,
  block,
}: {
  editor: EditorContextType;
  id: string;
  block: IEditorBlockText | undefined;
}) {
  return (
    <ControllerRow label="Transform">
      <select
        name="textTransform"
        id="textTransform"
        value={block?.textTransform || "inherit"}
        onChange={(e) => {
          if (block) {
            editor.updateBlockValues(id, {
              textTransform: e.target.value as ITextTransform,
            });
          }
        }}
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
