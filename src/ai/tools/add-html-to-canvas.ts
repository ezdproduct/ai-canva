import type { UIMessage, UIMessageStreamWriter } from "ai";
import { tool } from "ai";
import { z } from "zod";
import { templateSchema, htmlBlockSchemaWithoutId } from "@/lib/schema";
import { generateId } from "@/lib/id-generator";
import type { SelectionBounds } from "@/lib/types";

import type { DataPart } from "../messages/data-parts";
import description from "./add-html-to-canvas.md";

type Params = {
  writer: UIMessageStreamWriter<UIMessage<never, DataPart>>;
  // selectionBounds is available in the AI context for positioning logic (see tool description)
  selectionBounds?: SelectionBounds;
};

// Helper function to add ID and validate
const createBlockWithId = (block: unknown) => {
  const validatedBlock = htmlBlockSchemaWithoutId.parse(block);
  const blockWithId = {
    ...validatedBlock,
    id: generateId(),
  };
  return templateSchema.shape.blocks.element.parse(blockWithId);
};

export const addHTMLToCanvas = ({ writer }: Params) =>
  tool({
    description,
    inputSchema: htmlBlockSchemaWithoutId.extend({
      updateBlockId: z
        .string()
        .optional()
        .describe(
          "ID of existing loading block to update. If not provided, a new block will be created."
        ),
    }),
    execute: async (block, { toolCallId }) => {
      const blockInput = block as z.infer<typeof htmlBlockSchemaWithoutId> & {
        updateBlockId?: string;
      };
      const updateBlockId = blockInput.updateBlockId;

      // If updating, use the existing ID; otherwise create new block with new ID
      const blockWithId = updateBlockId
        ? {
            ...createBlockWithId(block),
            id: updateBlockId, // Preserve the existing block ID
          }
        : createBlockWithId(block);

      writer.write({
        id: toolCallId,
        type: "data-add-html-to-canvas",
        data: {
          // @ts-expect-error - This is a valid data part
          "add-html-to-canvas": {
            block: blockWithId,
            status: "done" as const,
            updateBlockId,
          },
        },
      });

      if (updateBlockId) {
        return `Successfully updated HTML block "${block.label}" (ID: ${updateBlockId}) with generated HTML.`;
      }
      return `Successfully added HTML block "${block.label}" with ID ${blockWithId.id} to the canvas.`;
    },
  });
