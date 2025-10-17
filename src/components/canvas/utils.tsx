import { BoxIcon, ImageIcon, TextIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import {
  IEditorBlocks,
  IEditorBlockText,
  IEditorBlockType,
} from "./editor-types";
import { fontsList } from "./components/controls/components/textControls/fonts";

export function BlockIcon(type: IEditorBlockType) {
  switch (type) {
    case "text":
      return <TextIcon />;
    case "frame":
      return <BoxIcon />;
    case "image":
      return <ImageIcon />;
    default:
      return <BoxIcon />;
  }
}

export const loadFont = async (fontKey: string, weights: string[]) => {
  try {
    const fontObject = await fontsList
      .find((font) => font.family === fontKey)
      ?.load();

    if (!fontObject) {
      throw new Error(`Font ${fontKey} not found`);
    }

    const fontInfo = fontObject.getInfo();
    if (!fontInfo) {
      throw new Error(`Font ${fontKey} not loaded`);
    }

    const cssRules: string[] = [];
    const loadPromises: Promise<void>[] = [];

    for (const weight of weights) {
      const fontFace = fontInfo.fonts?.normal?.[weight];
      if (!fontFace) {
        continue;
      }

      const fontUrl = fontFace?.latin;
      if (!fontUrl) {
        continue;
      }

      // Create and load font face
      const font = new FontFace(fontKey, `url(${fontUrl})`, {
        weight: weight.toString(),
        style: "normal",
      });

      const loadPromise = font.load().then((loadedFont) => {
        document.fonts.add(loadedFont);
      });

      loadPromises.push(loadPromise);
      cssRules.push(`
        @font-face {
          font-family: '${fontKey}';
          src: url('${fontUrl}');
          font-weight: ${weight};
          font-style: normal;
        }
      `);
    }

    // Wait for all fonts to load and add CSS
    await Promise.all(loadPromises);
    await document.fonts.ready;

    // Add CSS to document
    const fontCss = document.createElement("style");
    fontCss.innerHTML = cssRules.join("\n");
    document.head.appendChild(fontCss);
  } catch {
    // Handle error
  }
};

export const loadFonts = async (blocks: IEditorBlocks[]) => {
  const textBlocks = blocks.filter(
    (block) => block.type === "text"
  ) as IEditorBlockText[];
  const fonts = textBlocks.map((block) => ({
    font: block.font.family,
    weights: block.font.weight,
  }));

  const uniqueFonts = Array.from(new Set(fonts.map((font) => font.font))).map(
    (font) => ({
      font,
      weights: fonts
        .filter((f) => f.font === font)
        .map((f) => f.weights)
        .flat(),
    })
  );

  for (const { font, weights } of uniqueFonts) {
    await loadFont(font, weights);
  }
};

export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 900);
    };

    handleResize(); // Check on mount
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return isMobile;
};

export const calculateDefaultZoom = (
  canvasWidth: number,
  canvasHeight: number,
  container: HTMLDivElement
) => {
  const containerWidth = container.clientWidth - 50;
  const containerHeight = container.clientHeight - 50;

  if (
    containerWidth <= 0 ||
    containerHeight <= 0 ||
    canvasWidth < containerWidth ||
    canvasHeight < containerHeight
  ) {
    return 1;
  }

  const widthRatio = containerWidth / canvasWidth;
  const heightRatio = containerHeight / canvasHeight;

  // Calculate the minimum ratio to fit the canvas in the container
  const minRatio = Math.min(widthRatio, heightRatio);

  // Calculate the default zoom level
  const defaultZoom = Math.floor(minRatio * 100);

  return defaultZoom / 100;
};
