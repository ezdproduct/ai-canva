/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import { v4 as uuid } from "uuid";
import { toPng } from "html-to-image";
import {
  ICanvasState,
  IEditorBlock,
  IEditorBlockFrame,
  IEditorBlockImage,
  IEditorBlocks,
  IEditorBlockText,
  Template,
} from "./editor-types.d";
import { loadFonts } from "./utils";

export default function useEditor(defaultTemplate?: Template) {
  const [canvasState, setCanvasState] = React.useState<ICanvasState>({
    size: defaultTemplate?.size || { width: 1280, height: 720 },
    zoom: 1,
    background: defaultTemplate?.background || "#ffffff",
    mode: "select",
    isTextEditing: false,
  });
  const [blocks, setBlocks] = React.useState<IEditorBlocks[]>(
    defaultTemplate?.blocks || []
  );
  const [selectedBlocks, setSelectedBlocks] = React.useState<
    Array<SVGElement | HTMLElement>
  >([]);
  const [newAddedBlock, setNewAddedBlock] = React.useState<string | null>(null);
  const canvasRef = React.useRef<HTMLDivElement>(null);
  const isUndoRedo = React.useRef(false);
  const isInitialRender = React.useRef(true);
  const [history, setHistory] = React.useState({
    undo: [] as Template[],
    redo: [] as Template[],
  });

  // calculate center position
  const calculatePosition = (width: number, height: number) => {
    const { size } = canvasState;
    return {
      x: Math.round(size.width / 2 - width / 2),
      y: Math.round(size.height / 2 - height / 2),
    };
  };

  // change editor mode
  const changeMode = React.useCallback((mode: ICanvasState["mode"]) => {
    if (mode === "move") {
      setSelectedBlocks([]);
    }
    setCanvasState((prevState) => ({ ...prevState, mode }));
  }, []);

  // on ad block
  const onAddBlock = React.useCallback(() => {
    setCanvasState((prevState) => ({ ...prevState, mode: "select" }));
  }, []);

  const duplicateBlock = React.useCallback((prevId: string) => {
    const id = uuid();
    setBlocks((prevBlocks) => {
      const block = prevBlocks.find((e) => e.id === prevId);
      const index = prevBlocks.findIndex((e) => e.id === prevId);
      if (block && index !== -1) {
        const newBlock = { ...block };
        newBlock.id = id;
        newBlock.label = `Frame ${prevBlocks.length + 1}`;
        newBlock.y += 10;
        newBlock.x += 10;
        return [
          ...prevBlocks.slice(0, index + 1),
          newBlock,
          ...prevBlocks.slice(index + 1),
        ];
      }
      return [...prevBlocks];
    });
    setNewAddedBlock(id);
    onAddBlock();
  }, []);

  const deleteBlock = React.useCallback((id: string) => {
    setBlocks((prevBlocks) => {
      return prevBlocks.filter((e) => e.id !== id);
    });
    setNewAddedBlock(id);
    onAddBlock();
  }, []);

  const showHideBlock = React.useCallback((id: string) => {
    setSelectedBlocks([]);
    setBlocks((prevBlocks) =>
      prevBlocks.map((item) =>
        item.id === id ? { ...item, visible: !item.visible } : item
      )
    );
  }, []);

  const updateBlockValues = React.useCallback(
    (id: string, values: Partial<IEditorBlock>) => {
      setBlocks((prevBlocks) =>
        prevBlocks.map((item) =>
          id === item.id ? { ...item, ...values } : item
        )
      );
    },
    []
  );

  const blockDefaultCommonFields = () => {
    const id = uuid();
    return {
      id,
      locked: false,
      rotate: {
        type: "2d",
        value: 0,
        valueX: 0,
        valueY: 0,
        valueZ: 0,
      },
      visible: true,
      opacity: 100,
      radius: {
        type: "all",
        tl: 0,
        tr: 0,
        br: 0,
        bl: 0,
      },
    };
  };

  // Add a text block to the canvas
  const addTextBlock = React.useCallback(() => {
    const defaultSettings = blockDefaultCommonFields();
    setBlocks((prevBlocks) => [
      ...prevBlocks,
      {
        ...defaultSettings,
        label: `Text ${prevBlocks.length + 1}`,
        type: "text",
        ...calculatePosition(250, 26),
        width: 250,
        height: 26,
        text: "Some text here...",
        color: "#000000",
        fontSize: 16,
        letterSpacing: 0,
        lineHeight: 24,
        textAlign: "center",
        font: {
          family: "Poppins",
          weight: "400",
        },
      } as IEditorBlockText,
    ]);
    setNewAddedBlock(defaultSettings.id);
    onAddBlock();
  }, []);

  // Add a frame block to the canvas
  const addFrameBlock = React.useCallback(() => {
    const defaultSettings = blockDefaultCommonFields();
    setBlocks((prevBlocks) => [
      ...prevBlocks,
      {
        ...defaultSettings,
        label: `Frame ${prevBlocks.length + 1}`,
        type: "frame",
        ...calculatePosition(200, 200),
        width: 200,
        height: 200,
        border: {
          width: {
            type: "all",
            top: 1,
          },
          color: "#000000",
          type: "solid",
        },
      } as IEditorBlockFrame,
    ]);
    setNewAddedBlock(defaultSettings.id);
    onAddBlock();
  }, []);

  // Add a image block to the canvas
  const addImageBlock = React.useCallback(
    ({
      url,
      width,
      height,
    }: {
      url: string;
      width: number;
      height: number;
    }) => {
      const defaultSettings = blockDefaultCommonFields();
      setBlocks((prevBlocks) => [
        ...prevBlocks,
        {
          ...defaultSettings,
          label: `Image ${prevBlocks.length + 1}`,
          type: "image",
          ...calculatePosition(width * 0.4, height * 0.4),
          width: Math.round(width * 0.4),
          height: Math.round(height * 0.4),
          url,
          fit: "contain",
          position: "center",
        } as IEditorBlockImage,
      ]);
      setNewAddedBlock(defaultSettings.id);
      onAddBlock();
    },
    []
  );

  const bringForwardBlock = (id: string) => {
    const index = blocks.findIndex((e) => e.id === id);
    if (index !== -1 && index < blocks.length - 1) {
      const newLayers = [...blocks];
      [newLayers[index], newLayers[index + 1]] = [
        newLayers[index + 1],
        newLayers[index],
      ];
      setBlocks(newLayers);
    }
  };

  const bringToTopBlock = (id: string) => {
    const index = blocks.findIndex((e) => e.id === id);
    if (index !== -1 && index < blocks.length - 1) {
      const newLayers = [...blocks];
      const [layer] = newLayers.splice(index, 1);
      newLayers.push(layer);
      setBlocks(newLayers);
    }
  };

  const bringBackwardBlock = (id: string) => {
    const index = blocks.findIndex((e) => e.id === id);
    if (index !== -1 && index > 0) {
      const newLayers = [...blocks];
      [newLayers[index], newLayers[index - 1]] = [
        newLayers[index - 1],
        newLayers[index],
      ];
      setBlocks(newLayers);
    }
  };

  const bringToBackBlock = (id: string) => {
    const index = blocks.findIndex((e) => e.id === id);
    if (index !== -1 && index > 0) {
      const newLayers = [...blocks];
      const [layer] = newLayers.splice(index, 1);
      newLayers.unshift(layer);
      setBlocks(newLayers);
    }
  };

  const downloadImage = async () => {
    if (canvasRef.current) {
      await loadFonts(blocks);
      toPng(canvasRef.current, {
        cacheBust: true,
        width: canvasState.size.width,
        height: canvasState.size.height,
      }).then((dataUrl) => {
        const link = document.createElement("a");
        link.download = "canvas.png";
        link.href = dataUrl;
        link.click();
      });
    }
  };

  const handleUndo = () => {
    setSelectedBlocks([]);
    setHistory((prevHistory) => {
      if (prevHistory.undo.length === 0) return prevHistory;
      const [currentEntry, undoEntry, ...remainingUndo] = prevHistory.undo;
      isUndoRedo.current = true;

      // Restore the previous state
      setBlocks(undoEntry.blocks);
      setCanvasState((prevState: ICanvasState) => ({
        ...prevState,
        size: undoEntry.size,
        background: undoEntry.background,
      }));

      // Add current state to redo
      return {
        undo: [undoEntry, ...remainingUndo],
        redo: [
          {
            blocks: currentEntry.blocks,
            size: currentEntry.size,
            background: currentEntry.background,
          },
          ...prevHistory.redo,
        ],
      };
    });
  };

  const handleRedo = () => {
    setSelectedBlocks([]);
    setHistory((prevHistory) => {
      if (prevHistory.redo.length === 0) return prevHistory;
      const [redoEntry, ...remainingRedo] = prevHistory.redo;
      isUndoRedo.current = true;

      // Restore the next state
      setBlocks(redoEntry.blocks);
      setCanvasState((prevState: ICanvasState) => ({
        ...prevState,
        size: redoEntry.size,
        background: redoEntry.background,
      }));

      // Add current state to undo
      return {
        undo: [
          {
            blocks: redoEntry.blocks,
            size: redoEntry.size,
            background: redoEntry.background,
          },
          ...prevHistory.undo,
        ],
        redo: remainingRedo,
      };
    });
  };

  const exportToJson = () => {
    const json = JSON.stringify({
      blocks,
      size: canvasState.size,
      background: canvasState.background,
    });

    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "canvas.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Set the new added block selected
  React.useEffect(() => {
    if (newAddedBlock) {
      setSelectedBlocks([document.querySelector(`.block-${newAddedBlock}`)!]);
      setNewAddedBlock(null);
    }
  }, [newAddedBlock]);

  // Delete on backspace press
  React.useEffect(() => {
    const handleKeyUp = (event: KeyboardEvent) => {
      const focusedElement = document.activeElement as any;
      const isEditable =
        ["INPUT", "TEXTAREA"].includes(focusedElement?.tagName) ||
        focusedElement.hasAttribute("contentEditable");
      if (event.key === "Backspace" && selectedBlocks.length && !isEditable) {
        const ids = selectedBlocks.map((e) => e?.id || "");
        setSelectedBlocks([]);
        setBlocks((prevBlocks) =>
          prevBlocks.filter((e) => !ids.includes(e.id))
        );
        const hoveredElm = document.querySelector(".hovered") as any;
        hoveredElm.style.display = "none";
      }
    };

    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [selectedBlocks.length]);

  React.useEffect(() => {
    loadFonts(blocks);
  }, []);

  React.useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }

    if (isUndoRedo.current) {
      isUndoRedo.current = false;
      return;
    }
    setHistory((prevHistory) => ({
      undo: [
        {
          blocks,
          size: canvasState.size,
          background: canvasState.background,
        },
        ...prevHistory.undo,
      ],
      redo: [],
    }));
  }, [blocks, canvasState]);

  return {
    blocks,
    selectedBlocks,
    setSelectedBlocks,
    canvasState,
    setCanvasState,
    duplicateBlock,
    deleteBlock,
    showHideBlock,
    addTextBlock,
    addImageBlock,
    addFrameBlock,
    changeMode,
    updateBlockValues,
    bringForwardBlock,
    bringToTopBlock,
    bringBackwardBlock,
    bringToBackBlock,
    canvasRef,
    history,
    handleUndo,
    handleRedo,
    downloadImage,
    exportToJson,
  };
}

export type EditorContextType = ReturnType<typeof useEditor>;
