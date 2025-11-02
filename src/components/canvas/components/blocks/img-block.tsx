import * as React from "react";
import type { HTMLAttributes } from "react";
import type { IEditorBlockImage } from "@/lib/schema";
import type { EditorContextType } from "../../use-editor";
import CommonBlock from "./common-block";

const ImageBlock = React.forwardRef<
  HTMLDivElement,
  {
    block: IEditorBlockImage;
    editor: EditorContextType;
  } & HTMLAttributes<HTMLDivElement>
>(({ block, editor, ...props }, ref) => {
  return (
    <CommonBlock ref={ref} editor={editor} block={block} {...props}>
      <img
        src={block.url}
        alt=""
        className="h-full w-full"
        style={{
          objectFit: "contain",
        }}
      />
    </CommonBlock>
  );
});

ImageBlock.displayName = "ImageBlock";

export default ImageBlock;
