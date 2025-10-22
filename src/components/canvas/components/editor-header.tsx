import * as React from "react";
import { CursorArrowIcon, HandIcon } from "@radix-ui/react-icons";
import { FiDownload } from "react-icons/fi";
import { GrUndo, GrRedo } from "react-icons/gr";
import ButtonsGroup from "@/components/ui/buttons-group";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import type { EditorContextType } from "../use-editor";
import { BlockIcon } from "../utils";
import { cn } from "@/lib/utils";

interface EditorHeaderProps {
  editor: EditorContextType;
  className?: string;
}

function EditorHeader({ editor, className }: EditorHeaderProps) {
  const imageInputRef = React.useRef<HTMLInputElement>(null);
  return (
    <div
      className={
        cn(
          "relative z-20 flex h-[60px] items-center justify-between border-b border-border bg-background px-4",
          className
        )
      }
    >
      <div className="flex items-center gap-4">
        <ButtonsGroup
          buttons={[
            {
              children: <CursorArrowIcon />,
              onClick: () => editor.changeMode("select"),
              isActive: editor.canvasState.mode === "select",
              label: "Select",
            },
            {
              children: <HandIcon />,
              onClick: () => editor.changeMode("move"),
              isActive: editor.canvasState.mode === "move",
              label: "Move",
            },
          ]}
        />
        <ButtonsGroup
          buttons={[
            {
              children: BlockIcon("text"),
              onClick: () => editor.addTextBlock(),
              label: "Add Text",
            },
            {
              children: BlockIcon("image"),
              onClick: () => {
                if (imageInputRef.current) {
                  imageInputRef.current.click();
                }
              },
              label: "Add Image",
            },
            {
              children: BlockIcon("frame"),
              onClick: () => editor.addFrameBlock(),
              label: "Add Frame",
            },
          ]}
        />
      </div>
      <div className="flex items-center gap-4">
        <ButtonsGroup
          buttons={[
            {
              children: <GrUndo />,
              onClick: editor.handleUndo,
              label: "Undo",
              disabled: editor.history.undo.length < 2,
            },
            {
              children: <GrRedo />,
              onClick: editor.handleRedo,
              label: "Redo",
              disabled: editor.history.redo.length === 0,
            },
          ]}
        />
      </div>
      <div className="flex items-center gap-4">
        <ModeToggle />
        <Button className="gap-2 rounded-lg h-8" onClick={editor.downloadImage}>
          <FiDownload /> Export
        </Button>
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
                editor.addImageBlock({
                  url: img.src,
                  width: img.width,
                  height: img.height,
                });
              };
            };
            reader.readAsDataURL(file);
            // reset input value
            e.target.value = "";
          }
        }}
      />
    </div>
  );
}

export default EditorHeader;
