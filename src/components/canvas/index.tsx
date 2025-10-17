import { TbInfoTriangleFilled } from "react-icons/tb";
import EditorHeader from "./components/editor-header";
import EditorLeftSide from "./components/editor-left-side";
import EditorRightSide from "./components/editor-right-side";
import EditorCanvas from "./components/editor-canvas";
import { EditorContextType } from "./use-editor";
import { useIsMobile } from "./utils";

function Canvas({ editor }: { editor: EditorContextType }) {
  const isMobile = useIsMobile();
  return (
    <>
      {isMobile ? (
        <div className="flex flex-col items-center justify-center h-screen gap-2 text-center p-4 bg-amber-100/50 dark:bg-yellow-950/10">
          <TbInfoTriangleFilled className="size-10 text-yellow-600 dark:text-yellow-400" />
          <h1 className="text-xl font-semibold">Use desktop browser</h1>
          <p className="text-foreground/60 text-md">
            The designer works best on a desktop browser.
          </p>
        </div>
      ) : (
        <div className="h-screen editor-canvas-wrapper">
          <EditorHeader editor={editor} />
          <div className="flex h-[calc(100vh-60px)]">
            <EditorLeftSide editor={editor} />
            <EditorCanvas editor={editor} />
            <EditorRightSide editor={editor} />
          </div>
        </div>
      )}
    </>
  );
}

export default Canvas;
