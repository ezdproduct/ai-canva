import type { UIMessage, UIMessageStreamWriter } from "ai";
import { tool } from "ai";
import { z } from "zod";
import { generateId } from "@/lib/id-generator";
import { htmlBlockSchemaWithoutId, templateSchema } from "@/lib/schema";
import { LOADING_HTML } from "@/components/canvas/utils/loading-html";

import type { DataPart } from "../messages/data-parts";
import description from "./generate-html-block.md";

type Params = {
  writer: UIMessageStreamWriter<UIMessage<never, DataPart>>;
  selectionBounds?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
};

// Helper to create a loading HTML block
const createLoadingBlock = (selectionBounds?: {
  x: number;
  y: number;
  width: number;
  height: number;
}) => {
  // Calculate position: right of selection or center
  const x = selectionBounds
    ? selectionBounds.x + selectionBounds.width + 30
    : 440; // Center: (1280 - 400) / 2
  const y = selectionBounds ? selectionBounds.y : 210; // Center: (720 - 300) / 2

  const block = {
    type: "html" as const,
    label: "Generating HTML...",
    x,
    y,
    width: 400,
    height: 300,
    rotation: 0,
    scaleX: 1,
    scaleY: 1,
    visible: true,
    opacity: 100,
    html: LOADING_HTML,
    background: "#ffffff",
    border: {
      color: "#d1d5db",
      width: 1,
    },
    radius: { tl: 16, tr: 16, br: 16, bl: 16 },
  };

  const validatedBlock = htmlBlockSchemaWithoutId.parse(block);
  const blockWithId = {
    ...validatedBlock,
    id: generateId(),
  };
  return templateSchema.shape.blocks.element.parse(blockWithId);
};

export const generateHTML = ({ writer, selectionBounds }: Params) =>
  tool({
    description,
    inputSchema: z.object({}).strict(), // No input - AI analyzes image automatically
    execute: async (_, { toolCallId }) => {
      // Create a loading HTML block immediately
      const loadingBlock = createLoadingBlock(selectionBounds);

      writer.write({
        id: toolCallId,
        type: "data-add-html-to-canvas",
        data: {
          // @ts-expect-error - This is a valid data part
          "add-html-to-canvas": {
            block: loadingBlock,
            status: "loading" as const,
          },
        },
      });

      return `Created loading placeholder for HTML block. Analyzing image and generating HTML/CSS/JS code. Use the addHTMLToCanvas tool with block ID ${loadingBlock.id} to update it with the generated HTML.`;
    },
  });
