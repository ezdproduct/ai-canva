import type { IEditorBlockImage } from "../../editor-types";
import type { EditorContextType } from "../../use-editor";
import CommonBlock from "./common-block";

function ImageBlock({
  block,
  editor,
}: {
  block: IEditorBlockImage;
  editor: EditorContextType;
}) {
  return (
    <CommonBlock editor={editor} block={block}>
      <img
        src={block.url}
        alt=""
        className="w-full h-full"
        style={{
          objectFit: "contain",
        }}
      />
    </CommonBlock>
  );
}

export default ImageBlock;
