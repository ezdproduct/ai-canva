"use client";

import * as React from "react";
import { CursorArrowIcon, HandIcon } from "@radix-ui/react-icons";
import {
  Loader2,
  Pencil,
  Redo,
  Undo,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import CustomTooltip from "@/components/ui/tooltip";
import { useEditorStore } from "../use-editor";
import { BlockIcon } from "../utils";
import { useShallow } from "zustand/react/shallow";
import { Separator } from "@/components/ui/separator";

function EditorBottomToolbar() {
  const imageInputRef = React.useRef<HTMLInputElement>(null);
  const [mode, setMode] = useEditorStore(
    useShallow((state) => [state.canvas.mode, state.setMode])
  );
  const setPendingImageData = useEditorStore(
    (state) => state.setPendingImageData
  );
  const [handleUndo, handleRedo, undoCount, redoCount] = useEditorStore(
    useShallow((state) => [
      state.handleUndo,
      state.handleRedo,
      state.history.undo.length,
      state.history.redo.length,
    ])
  );

  return (
    <>
      <div className="fixed bottom-3 left-1/2 z-50 -translate-x-1/2">
        <div className="border border-border/50 bg-background/95 backdrop-blur shadow-xl rounded-[1.25rem] p-2 flex gap-1 items-center">
          <CustomTooltip content="Select" hotkey="V">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMode("select")}
              className={cn(mode === "select" && "bg-muted")}
            >
              <CursorArrowIcon />
            </Button>
          </CustomTooltip>
          <CustomTooltip content="Move" hotkey="Space">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMode("move")}
              className={cn(mode === "move" && "bg-muted")}
            >
              <HandIcon />
            </Button>
          </CustomTooltip>
          <CustomTooltip content="Add Text" hotkey="T">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMode("text")}
              className={cn(mode === "text" && "bg-muted")}
            >
              {BlockIcon("text")}
            </Button>
          </CustomTooltip>
          <CustomTooltip content="Add Image">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                if (imageInputRef.current) {
                  imageInputRef.current.click();
                }
              }}
              className={cn(mode === "image" && "bg-muted")}
            >
              {BlockIcon("image")}
            </Button>
          </CustomTooltip>
          <CustomTooltip content="Add Frame" hotkey="F">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMode("frame")}
              className={cn(mode === "frame" && "bg-muted")}
            >
              {BlockIcon("frame")}
            </Button>
          </CustomTooltip>
          <CustomTooltip content="Add Arrow" hotkey="A">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMode("arrow")}
              className={cn(mode === "arrow" && "bg-muted")}
            >
              {BlockIcon("arrow")}
            </Button>
          </CustomTooltip>
          <CustomTooltip content="Draw" hotkey="D">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMode("draw")}
              className={cn(mode === "draw" && "bg-muted")}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </CustomTooltip>
          <Separator orientation="vertical" className="h-7! my-auto" />
          <CustomTooltip content="Undo" hotkey="⌘Z">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleUndo}
              disabled={undoCount === 0}
            >
              <Undo />
            </Button>
          </CustomTooltip>
          <CustomTooltip content="Redo" hotkey="⌘⇧Z">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRedo}
              disabled={redoCount === 0}
            >
              <Redo />
            </Button>
          </CustomTooltip>
        </div>
      </div>
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={imageInputRef}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = () => {
              const img = new Image();
              img.src = reader.result as string;
              img.onload = () => {
                setPendingImageData({
                  url: img.src,
                  width: img.width,
                  height: img.height,
                });
                setMode("image");
              };
            };
            reader.readAsDataURL(file);
            // reset input value
            e.target.value = "";
          }
        }}
      />
    </>
  );
}

export default EditorBottomToolbar;
