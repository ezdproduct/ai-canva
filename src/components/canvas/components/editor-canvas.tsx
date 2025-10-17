/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import Selecto from "react-selecto";
import Moveable from "react-moveable";
import InfiniteViewer from "react-infinite-viewer";
import { cn } from "@/lib/utils";
import { EditorContextType } from "../use-editor";
import TextBlock from "./blocks/text-block";
import FrameBlock from "./blocks/frame-block";
import { EditorDimensionViewable } from "./block-extensions";
import ZoomHandler from "./zoomable";
import {
  IEditorBlockFrame,
  IEditorBlockImage,
  IEditorBlockText,
} from "../editor-types";
import ImageBlock from "./blocks/img-block";
import { calculateDefaultZoom } from "../utils";

function EditorCanvas({ editor }: { editor: EditorContextType }) {
  const canvasContainerRef = React.useRef<HTMLDivElement>(null);
  const infiniteViewerRef = React.useRef<InfiniteViewer>(null);
  const moveableRef = React.useRef<Moveable>(null);
  const selectoRef = React.useRef<Selecto>(null);
  React.useEffect(() => {
    infiniteViewerRef.current!.scrollCenter();
  }, []);

  React.useEffect(() => {
    const elms = document.querySelectorAll(".editor-canvas .editor-block");
    const sidebarElms = document.querySelectorAll(
      ".editor-left-side .sidebar-item"
    );

    const target = document.querySelector(".hovered") as any;
    elms.forEach((elm) => {
      if (!elm.classList.contains("hover-event-added")) {
        elm.classList.add("hover-event-added");
        elm.addEventListener("mouseenter", () => {
          if (
            !moveableRef.current?.isDragging() &&
            // @ts-ignore
            moveableRef.current?.refTargets?.[0]?.id !== elm.id &&
            !document.querySelector(".editor-canvas-scroll.move")
          ) {
            const style = window.getComputedStyle(elm);
            target.style.display = "block";
            target.style.width = style.width;
            target.style.height = style.height;
            target.style.transform = style.transform;
          }
        });
        elm.addEventListener("mouseleave", () => {
          target.style.display = null;
        });
      }
    });
    sidebarElms.forEach((elm) => {
      if (!elm.classList.contains("hover-event-added")) {
        elm.classList.add("hover-event-added");
        elm.addEventListener("mouseenter", () => {
          const blockId = elm.getAttribute("data-block-id");
          if (
            !moveableRef.current?.isDragging() &&
            // @ts-ignore
            moveableRef.current?.refTargets?.[0]?.id !== blockId &&
            !document.querySelector(".editor-canvas-scroll.move")
          ) {
            const block = document.querySelector(`.block-${blockId}`);
            if (block) {
              const style = window.getComputedStyle(block);
              target.style.display = "block";
              target.style.width = style.width;
              target.style.height = style.height;
              target.style.transform = style.transform;
            }
          }
        });
        elm.addEventListener("mouseleave", () => {
          target.style.display = null;
        });
      }
    });
  }, [editor.blocks.length]);

  React.useEffect(() => {
    if (editor?.selectedBlocks?.length === 1) {
      const block = editor.selectedBlocks?.[0];
      if (!block) {
        return;
      }
      const width = block.scrollWidth;
      const height = block.scrollHeight;
      const leftResizer = document.querySelector(
        ".moveable-w.moveable-resizable"
      ) as any;
      const rightResizer = document.querySelector(
        ".moveable-e.moveable-resizable"
      ) as any;
      const topResizer = document.querySelector(
        ".moveable-n.moveable-resizable"
      ) as any;
      const bottomResizer = document.querySelector(
        ".moveable-s.moveable-resizable"
      ) as any;

      if (height < 60 && leftResizer && rightResizer) {
        leftResizer.style.display = "none";
        rightResizer.style.display = "none";
      } else {
        leftResizer.style.display = null;
        rightResizer.style.display = null;
      }

      if (width < 60 && topResizer && bottomResizer) {
        topResizer.style.display = "none";
        bottomResizer.style.display = "none";
      } else {
        topResizer.style.display = null;
        bottomResizer.style.display = null;
      }
    }
  }, [editor.selectedBlocks]);

  React.useEffect(() => {
    const defaultZoom = calculateDefaultZoom(
      editor.canvasState.size.width,
      editor.canvasState.size.height,
      document.querySelector(".infinite-viewer-wrapper") as HTMLDivElement
    );
    infiniteViewerRef.current?.setZoom(defaultZoom);
    infiniteViewerRef.current?.scrollCenter();
    editor.setCanvasState({
      ...editor.canvasState,
      zoom: defaultZoom,
    });
  }, []);

  return (
    <div className="flex-1 w-full h-full relative">
      <InfiniteViewer
        ref={infiniteViewerRef}
        useMouseDrag={editor.canvasState.mode === "move"}
        useAutoZoom
        className={cn(
          `infinite-viewer w-full h-full bg-gray-50 editor-canvas-scroll ${editor.canvasState.mode}`,
          {
            "cursor-grab": editor.canvasState.mode === "move",
          }
        )}
        zoomRange={[0.3, 5]}
        zoom={editor.canvasState.zoom}
        onPinch={(e) => {
          editor.setCanvasState({ ...editor.canvasState, zoom: e.zoom });
        }}
      >
        <div
          ref={canvasContainerRef}
          style={{
            height: editor.canvasState.size.height,
            width: editor.canvasState.size.width,
          }}
          className="editor-canvas relative shadow-normal"
        >
          <div className="hovered" />
          <div
            ref={editor.canvasRef}
            className="relative w-full h-full overflow-hidden"
          >
            <div
              className="absolute top-0 left-0 w-full h-full"
              style={{
                background: editor.canvasState.background,
              }}
            />
            {editor.blocks
              .filter((e) => e.visible)
              .map((block) => {
                if (block.type === "text") {
                  return (
                    <TextBlock
                      key={block.id}
                      block={block as IEditorBlockText}
                      editor={editor}
                    />
                  );
                }
                if (block.type === "image") {
                  return (
                    <ImageBlock
                      key={block.id}
                      block={block as IEditorBlockImage}
                      editor={editor}
                    />
                  );
                }
                if (block.type === "frame") {
                  return (
                    <FrameBlock
                      key={block.id}
                      block={block as IEditorBlockFrame}
                      editor={editor}
                    />
                  );
                }
                return null;
              })}
          </div>
          <Moveable
            target={editor.selectedBlocks}
            ref={moveableRef}
            keepRatio={
              editor.selectedBlocks.length === 1 &&
              editor.selectedBlocks?.[0]?.classList?.contains(
                "editor-block-image"
              )
            }
            draggable={
              editor.canvasState.mode !== "move" &&
              !editor.canvasState.isTextEditing
            }
            ables={[EditorDimensionViewable]}
            props={{
              dimensionViewable: true,
            }}
            zoom={1 / editor.canvasState.zoom}
            rotationPosition="none"
            resizable={
              editor.selectedBlocks.length < 2 &&
              editor.canvasState.mode !== "move" &&
              !editor.canvasState.isTextEditing
            }
            rotatable={
              editor.selectedBlocks.length < 2 &&
              editor.canvasState.mode !== "move" &&
              !editor.canvasState.isTextEditing
            }
            origin={false}
            useResizeObserver
            useMutationObserver
            snappable={
              editor.canvasState.mode !== "move" &&
              !editor.canvasState.isTextEditing
            }
            snapContainer=".editor-canvas"
            snapDirections={{
              top: true,
              left: true,
              bottom: true,
              right: true,
              center: true,
              middle: true,
            }}
            elementSnapDirections={{
              middle: true,
              center: true,
              top: true,
              left: true,
              bottom: true,
              right: true,
            }}
            isDisplaySnapDigit={false}
            snapThreshold={5}
            elementGuidelines={[
              ".editor-canvas",
              ...editor.blocks.map(({ id }) => `.block-${id}`),
            ]}
            onDrag={(e) => {
              e.target.style.transform = e.transform;
            }}
            onDragStart={() => {
              const hoverTarget = document.querySelector(".hovered") as any;
              hoverTarget.style.display = null;
            }}
            onDragGroup={(e) => {
              e.events.forEach((ev) => {
                ev.target.style.transform = ev.transform;
              });
            }}
            onClickGroup={(e) => {
              selectoRef.current!.clickTarget(e.inputEvent, e.inputTarget);
            }}
            renderDirections={["nw", "n", "ne", "w", "e", "sw", "s", "se"]}
            onResize={(e) => {
              const { height } = e;
              const { width } = e;
              e.target.style.width = `${width}px`;
              e.target.style.height = `${height}px`;
              e.target.style.transform = e.drag.transform;

              const leftResizer = document.querySelector(
                ".moveable-w.moveable-resizable"
              ) as any;
              const rightResizer = document.querySelector(
                ".moveable-e.moveable-resizable"
              ) as any;
              const topResizer = document.querySelector(
                ".moveable-n.moveable-resizable"
              ) as any;
              const bottomResizer = document.querySelector(
                ".moveable-s.moveable-resizable"
              ) as any;

              if (height < 60 && leftResizer && rightResizer) {
                leftResizer.style.display = "none";
                rightResizer.style.display = "none";
              } else {
                leftResizer.style.display = null;
                rightResizer.style.display = null;
              }

              if (width < 60 && topResizer && bottomResizer) {
                topResizer.style.display = "none";
                bottomResizer.style.display = "none";
              } else {
                topResizer.style.display = null;
                bottomResizer.style.display = null;
              }
            }}
            onResizeStart={() => {
              // show size
              const sizeElm = document.querySelector(".moveable-dimension");
              sizeElm?.classList.add("visible");
            }}
            onDragEnd={(e) => {
              const target = e.target as HTMLElement;
              const { id } = target;
              const matrix = new DOMMatrixReadOnly(target.style.transform);
              editor.updateBlockValues(id, {
                x: Math.trunc(matrix.m41),
                y: Math.trunc(matrix.m42),
              });
            }}
            onResizeEnd={(e) => {
              // hide size
              const sizeElm = document.querySelector(".moveable-dimension");
              sizeElm?.classList.remove("visible");

              const target = e.target as HTMLElement;
              const { id } = target;
              const block = editor.blocks.find((b) => b.id === id);
              if (block) {
                block.width = parseFloat(target.style.width);
                block.height = parseFloat(target.style.height);
              }
              editor.updateBlockValues(id, {
                width: parseFloat(target.style.width),
                height: parseFloat(target.style.height),
              });
            }}
            // onDragGroupEnd={e => {
            //   e.events.forEach(ev => {
            //     const target = ev.target as HTMLElement;
            //     const { id } = target;
            //     const block = editor.blocks.find(b => b.id === id);
            //     if (block) {
            //       block.x = parseFloat(target.style.left);
            //       block.y = parseFloat(target.style.top);
            //     }
            //   });
            // }}
          />
        </div>
      </InfiniteViewer>
      {editor.canvasState.mode !== "move" && (
        <Selecto
          ref={selectoRef}
          dragContainer=".editor-canvas-scroll"
          selectableTargets={[".editor-block"]}
          selectByClick
          hitRate={0}
          ratio={0}
          selectFromInside={false}
          toggleContinueSelect={["shift"]}
          onDragStart={(e) => {
            const moveable = moveableRef.current!;
            const { target } = e.inputEvent;
            if (
              moveable.isMoveableElement(target) ||
              editor.selectedBlocks.some(
                (t) => t === target || t.contains(target)
              )
            ) {
              e.stop();
            }
          }}
          onSelect={(e) => {
            if (e.isDragStartEnd) {
              return;
            }
            editor.setSelectedBlocks(e.selected);
          }}
          onSelectEnd={(e) => {
            const moveable = moveableRef.current!;
            if (e.isDragStart) {
              e.inputEvent.preventDefault();

              moveable.waitToChangeTarget().then(() => {
                moveable.dragStart(e.inputEvent);
              });
            }
            editor.setSelectedBlocks(e.selected);
          }}
        />
      )}
      <ZoomHandler
        zoomIn={() => {
          const value = (infiniteViewerRef?.current?.getZoom() || 1) + 0.2;
          if (value > 2) {
            return;
          }
          infiniteViewerRef?.current?.setZoom(value);
          infiniteViewerRef.current!.scrollCenter();
          editor.setCanvasState({
            ...editor.canvasState,
            zoom: value,
          });
        }}
        zoomOut={() => {
          const value = (infiniteViewerRef?.current?.getZoom() || 1) - 0.2;
          if (value < 0.3) {
            return;
          }
          infiniteViewerRef?.current?.setZoom(value);
          infiniteViewerRef.current!.scrollCenter();
          editor.setCanvasState({
            ...editor.canvasState,
            zoom: value,
          });
        }}
        resetZoom={() => {
          infiniteViewerRef?.current?.setZoom(1);
          infiniteViewerRef.current!.scrollCenter();
          editor.setCanvasState({ ...editor.canvasState, zoom: 1 });
        }}
      />
    </div>
  );
}

export default EditorCanvas;
