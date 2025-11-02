import * as React from "react";
import type { HTMLAttributes } from "react";
import type { IEditorBlockFrame } from "@/lib/schema";
import type { EditorContextType } from "../../use-editor";
import CommonBlock from "./common-block";

const FrameBlock = React.forwardRef<
  HTMLDivElement,
  {
    block: IEditorBlockFrame;
    editor: EditorContextType;
  } & HTMLAttributes<HTMLDivElement>
>(({ editor, block, ...props }, ref) => {
  return <CommonBlock ref={ref} block={block} editor={editor} {...props} />;
});

FrameBlock.displayName = "FrameBlock";

export default FrameBlock;
