import type { IEditorBlockFrame } from "../../editor-types";
import { EditorContextType } from "../../use-editor";
import CommonBlock from "./common-block";

function FrameBlock({
  editor,
  block,
}: {
  block: IEditorBlockFrame;
  editor: EditorContextType;
}) {
  return <CommonBlock block={block} editor={editor} />;
}

export default FrameBlock;
