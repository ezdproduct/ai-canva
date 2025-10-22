// import React from 'react';
import type { IEditorBlocks } from "../../editor-types";
import type { EditorContextType } from "../../use-editor";
import BorderControl from "./components/border-control";
import ControllerBox from "./components/controller-box";
import ColorControl from "./components/color-control";
import RadiusControl from "./components/radius-control";
import ShadowControl from "./components/shadow-control";
import FlipControl from "./components/flip-control";
import OpacityControl from "./components/opacity-control";

interface LayerControllerProps {
  editor: EditorContextType;
  id: string;
  block: IEditorBlocks | undefined;
  className?: string;
}

function LayerController({ editor, id, block, className }: LayerControllerProps) {
  return (
    <ControllerBox title="Layer" className={className}>
      <ColorControl
        name="Fill"
        value={block?.background}
        onChange={(e) => {
          editor.updateBlockValues(id, {
            background: e,
          });
        }}
        className="justify-between"
      />
      <BorderControl editor={editor} id={id} block={block} />
      <ShadowControl editor={editor} id={id} block={block} />
      <RadiusControl editor={editor} id={id} block={block} />
      <OpacityControl editor={editor} id={id} block={block} />
      <FlipControl editor={editor} id={id} block={block} />
    </ControllerBox>
  );
}

export default LayerController;
