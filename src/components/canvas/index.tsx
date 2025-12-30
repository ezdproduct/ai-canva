"use client";

import * as React from "react";
import EditorLeftSide from "./views/editor-left-side";
import EditorRightSide from "./views/editor-right-side";
import EditorCanvas from "./views/editor-canvas";
import EditorBottomToolbar from "./views/editor-bottom-toolbar";
import { initializeEditorStore, useEditorStore } from "./use-editor";
import { SizePickerDialog } from "./size-picker-dialog";
import type { Template } from "@/lib/schema";

interface CanvasProps {
  template?: Template;
}

function Canvas({ template }: CanvasProps) {
  React.useLayoutEffect(() => {
    initializeEditorStore(template);
  }, [template]);

  const canvasSize = useEditorStore((state) => state.canvas.size);
  const isSizePickerOpen = useEditorStore((state) => state.canvas.isSizePickerOpen);
  const updateCanvasSize = useEditorStore((state) => state.updateCanvasSize);
  const setIsSizePickerOpen = useEditorStore((state) => state.setIsSizePickerOpen);

  return (
    <div className="editor-canvas-wrapper h-screen bg-slate-100 dark:bg-slate-900 relative">
      <div className="flex h-screen">
        <EditorLeftSide />
        <EditorCanvas />
        <EditorRightSide />
      </div>
      <EditorBottomToolbar />

      <SizePickerDialog
        open={(canvasSize.width === 0 || canvasSize.height === 0) || isSizePickerOpen}
        onSelectSize={(width, height) => {
          updateCanvasSize({ width, height });
          setIsSizePickerOpen(false);
        }}
        onClose={() => {
          if (canvasSize.width === 0 || canvasSize.height === 0) {
            updateCanvasSize({ width: 1920, height: 1080 });
          }
          setIsSizePickerOpen(false);
        }}
      />
    </div>
  );
}

export default Canvas;
