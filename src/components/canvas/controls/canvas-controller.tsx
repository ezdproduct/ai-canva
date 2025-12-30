import { useState } from "react";
import ControllerBox from "./components/controller-box";
import ColorControl from "./components/color-control";
import ControllerRow from "./components/controller-row";
import { useEditorStore } from "@/components/canvas/use-editor";
import { useShallow } from "zustand/react/shallow";
import { Button } from "@/components/ui/button";
import { MoveDiagonal2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

function CanvasController({ className }: { className?: string }) {
  const [size, setCanvasBackground, background, setIsSizePickerOpen] =
    useEditorStore(
      useShallow((state) => [
        state.canvas.size,
        state.setCanvasBackground,
        state.canvas.background,
        state.setIsSizePickerOpen,
      ])
    );

  const [isWarningOpen, setIsWarningOpen] = useState(false);

  return (
    <>
      <ControllerBox title="Canvas" className={className}>
        <ControllerRow label="Size" contentClassName="gap-2 items-center">
          <div className="flex items-center gap-2 text-sm font-medium w-full">
            <div className="flex items-center gap-1.5 px-2 h-7 bg-muted rounded-md text-muted-foreground flex-1 justify-center border border-border">
              <span>{size.width}</span>
              <span className="text-[10px] opacity-70">x</span>
              <span>{size.height}</span>
              <span className="text-[10px] ml-0.5 opacity-70">px</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 shrink-0 rounded-md border border-border bg-muted hover:border-primary text-foreground/80 hover:text-foreground"
              onClick={() => setIsWarningOpen(true)}
              title="Change Size"
            >
              <MoveDiagonal2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </ControllerRow>
        <ColorControl
          name="Fill"
          value={background}
          onChange={(e) => {
            setCanvasBackground(e);
          }}
          className="justify-between"
        />
      </ControllerBox>

      <Dialog open={isWarningOpen} onOpenChange={setIsWarningOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Canvas Size?</DialogTitle>
            <DialogDescription>
              Changing the canvas size may affect the layout of elements. Are you
              sure you want to proceed?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsWarningOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setIsSizePickerOpen(true);
                setIsWarningOpen(false);
              }}
            >
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default CanvasController;
