"use client";

import * as React from "react";
import EditorHeader from "./views/editor-header";
import EditorLeftSide from "./views/editor-left-side";
import EditorRightSide from "./views/editor-right-side";
import EditorCanvas from "./views/editor-canvas";
import { initializeEditorStore } from "./use-editor";
import AIPrompt from "../ai-prompt";
import type { Template } from "@/lib/schema";

interface CanvasProps {
  template?: Template;
}

function Canvas({ template }: CanvasProps) {
  React.useLayoutEffect(() => {
    initializeEditorStore(template);
  }, [template]);

  return (
    <div className="editor-canvas-wrapper h-screen bg-slate-100 dark:bg-slate-900">
      <EditorHeader />
      <div className="flex h-screen">
        <EditorLeftSide />
        <EditorCanvas />
        <EditorRightSide />
      </div>
      <AIPrompt />
    </div>
  );
}

export default Canvas;
