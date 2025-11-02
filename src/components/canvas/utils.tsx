import { BoxIcon, ImageIcon, TextIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import type {
  IEditorBlocks,
  IEditorBlockText,
  IEditorBlockType,
} from "@/lib/schema";
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

const loadedFontWeights = new Map<string, Set<string>>();

const ensureFontStyleElement = () => {
  if (typeof document === "undefined") {
    return null;
  }
  const existing = document.getElementById(
    "dynamic-font-loader"
  ) as HTMLStyleElement | null;
  if (existing) {
    return existing;
  }
  const style = document.createElement("style");
  style.id = "dynamic-font-loader";
  document.head.appendChild(style);
  return style;
};

export const loadFont = async (fontKey: string, weights: string[]) => {
  if (!weights.length || typeof document === "undefined") {
    return;
  }

  const uniqueRequestedWeights = Array.from(new Set(weights));
  const cachedWeights =
    loadedFontWeights.get(fontKey) ?? new Set<string>();
  const weightsToLoad = uniqueRequestedWeights.filter(
    (weight) => !cachedWeights.has(weight)
  );

  if (!weightsToLoad.length) {
    return;
  }

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

    for (const weight of weightsToLoad) {
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

    if (!loadPromises.length) {
      return;
    }

    await Promise.all(loadPromises);
    await document.fonts.ready;

    const styleElement = ensureFontStyleElement();
    if (styleElement && cssRules.length) {
      styleElement.textContent = [
        styleElement.textContent ?? "",
        cssRules.join("\n"),
      ]
        .filter(Boolean)
        .join("\n");
    }

    const updatedWeights = cachedWeights;
    weightsToLoad.forEach((weight) => updatedWeights.add(weight));
    loadedFontWeights.set(fontKey, updatedWeights);
  } catch {
    // Handle error
  }
};

export const loadFonts = async (blocks: IEditorBlocks[]) => {
  const textBlocks = blocks.filter(
    (block) => block.type === "text"
  ) as IEditorBlockText[];

  const fontWeightMap = new Map<string, Set<string>>();

  textBlocks.forEach((block) => {
    const weightSet =
      fontWeightMap.get(block.font.family) ?? new Set<string>();
    weightSet.add(block.font.weight);
    fontWeightMap.set(block.font.family, weightSet);
  });

  for (const [font, weights] of fontWeightMap.entries()) {
    await loadFont(font, Array.from(weights));
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
