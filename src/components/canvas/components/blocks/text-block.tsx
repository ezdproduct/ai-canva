/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-danger */
import { useRef } from "react";
import type { IEditorBlockText } from "../../editor-types";
import type { EditorContextType } from "../../use-editor";
import CommonBlock from "./common-block";

function TextBlock({
  block,
  editor,
}: {
  block: IEditorBlockText;
  editor: EditorContextType;
}) {
  const ref = useRef<HTMLInputElement | null>(null);
  return (
    <CommonBlock
      styles={{
        wordWrap: "break-word",
        color: block.color,
        fontFamily: `${block.font.family}, san-serif`,
        fontWeight: block.font.weight,
        fontSize: `${block.fontSize}px`,
        lineHeight: `${block.lineHeight}px`,
        letterSpacing: `${block.letterSpacing}px`,
        textAlign: block.textAlign,
        ...(block?.textTransform
          ? {
              textTransform: block.textTransform,
            }
          : {}),
        ...(block?.textDecoration
          ? {
              textDecoration: block.textDecoration,
            }
          : {}),
      }}
      editor={editor}
      customRef={ref}
      contentEditable={false}
      onDoubleClick={() => {
        if (
          !ref.current?.getAttribute("contentEditable") ||
          ref.current?.getAttribute("contentEditable") === "false"
        ) {
          ref.current?.setAttribute("contentEditable", "true");
          editor.setCanvasState({
            ...editor.canvasState,
            isTextEditing: true,
          });
          ref.current?.focus();
          const range = document.createRange();
          range.selectNodeContents(ref?.current as any);
          range.collapse(false);

          const selection = window.getSelection();
          selection?.removeAllRanges();
          selection?.addRange(range);
        }
      }}
      onBlur={() => {
        ref.current?.setAttribute("contentEditable", "false");
        editor.setCanvasState({
          ...editor.canvasState,
          isTextEditing: false,
        });
        editor.updateBlockValues(block.id, {
          text: ref.current?.innerHTML,
        });
      }}
      onInput={() => {
        const el = ref?.current as any;
        if (el?.scrollHeight > el?.clientHeight) {
          editor.updateBlockValues(block.id, {
            height: (el?.scrollHeight || block.height) + 2,
          });
        }
      }}
      dangerouslySetInnerHTML={{ __html: block.text }}
      block={block}
      onPaste={(e) => {
        e.preventDefault();
        const text = e.clipboardData.getData("text/plain");
        document.execCommand("insertText", false, text);
      }}
    />
  );
}

export default TextBlock;
