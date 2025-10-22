import { TbInfoTriangleFilled } from "react-icons/tb";
import EditorHeader from "./components/editor-header";
import EditorLeftSide from "./components/editor-left-side";
import EditorRightSide from "./components/editor-right-side";
import EditorCanvas from "./components/editor-canvas";
import type { EditorContextType } from "./use-editor";
import { useIsMobile } from "./utils";

interface CanvasProps {
  editor: EditorContextType;
}

function Canvas({ editor }: CanvasProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-2 bg-amber-100/50 p-4 text-center dark:bg-yellow-950/10">
        <TbInfoTriangleFilled className="size-10 text-yellow-600 dark:text-yellow-400" />
        <h1 className="text-xl font-semibold">Use desktop browser</h1>
        <p className="text-md text-foreground/60">
          The designer works best on a desktop browser.
        </p>
      </div>
    );
  }

  return (
    <div className="editor-canvas-wrapper h-screen">
      <EditorHeader editor={editor} />
      <div className="flex h-[calc(100vh-60px)]">
        <EditorLeftSide editor={editor} />
        <EditorCanvas editor={editor} />
        <EditorRightSide editor={editor} />
      </div>
    </div>
  );
}

export default Canvas;
