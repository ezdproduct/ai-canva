// import React from 'react';
import { IEditorBlockText } from "../../editor-types";
import { EditorContextType } from "../../use-editor";
import ColorControl from "./components/color-control";
import ControllerBox from "./components/controller-box";
import ContentControl from "./components/textControls/content-control";
import FontControl from "./components/textControls/font-picker";
import FontSizeControl from "./components/textControls/font-size-control";
import LetterSpacingControl from "./components/textControls/letter-spacing-control";
import LineHeightControl from "./components/textControls/line-height-control";
import TextAlignControl from "./components/textControls/text-align-control";
import TextDecorationControl from "./components/textControls/text-decoration-control";
import TextTransformControl from "./components/textControls/text-transform-control";

function TextController({
  editor,
  id,
  block,
}: {
  editor: EditorContextType;
  id: string;
  block: IEditorBlockText | undefined;
}) {
  return (
    <ControllerBox label="Text">
      <ContentControl editor={editor} id={id} block={block} />
      <FontControl editor={editor} id={id} block={block} />
      <FontSizeControl editor={editor} id={id} block={block} />
      <LineHeightControl editor={editor} id={id} block={block} />
      <LetterSpacingControl editor={editor} id={id} block={block} />
      <ColorControl
        name="Color"
        disableGradient
        value={block?.color}
        onChange={(e) => {
          editor.updateBlockValues(id, {
            color: e,
          });
        }}
      />
      <TextAlignControl editor={editor} id={id} block={block} />
      <TextTransformControl editor={editor} id={id} block={block} />
      <TextDecorationControl editor={editor} id={id} block={block} />
    </ControllerBox>
  );
}

export default TextController;
