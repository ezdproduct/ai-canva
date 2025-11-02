import { z } from "zod";

// ============================================================================
// ENUMS
// ============================================================================

// Border types
export const borderTypeSchema = z.enum([
  "solid",
  "dotted",
  "dashed",
  "double",
  "groove",
  "ridge",
  "inset",
  "outset",
]);

// Text align
export const textAlignSchema = z.enum(["center", "left", "right", "justify"]);

// Text transform
export const textTransformSchema = z.enum([
  "inherit",
  "capitalize",
  "uppercase",
  "lowercase",
]);

// Text decoration
export const textDecorationSchema = z.enum([
  "inherit",
  "overline",
  "line-through",
  "underline",
]);

// Editor size
export const editorSizeSchema = z.object({
  width: z.number(),
  height: z.number(),
});

// ============================================================================
// SUB-SCHEMAS
// ============================================================================

// Rotate schema
const rotateSchema = z
  .object({
    type: z.enum(["2d", "3d"]),
    value: z.number().optional(),
    valueX: z.number().optional(),
    valueY: z.number().optional(),
    valueZ: z.number().optional(),
  })
  .optional();

// Border width schema
const borderWidthSchema = z
  .object({
    type: z.enum(["all", "single"]).optional(),
    left: z.number().optional(),
    right: z.number().optional(),
    top: z.number().optional(),
    bottom: z.number().optional(),
  })
  .optional();

// Border schema
export const borderSchema = z
  .object({
    width: borderWidthSchema,
    type: borderTypeSchema.optional(),
    color: z.string().optional(),
  })
  .optional();

// Radius schema
export const radiusSchema = z
  .object({
    type: z.enum(["all", "single"]).optional(),
    tl: z.number().optional(),
    tr: z.number().optional(),
    br: z.number().optional(),
    bl: z.number().optional(),
  })
  .optional();

// Shadow schema
export const shadowSchema = z
  .object({
    type: z.enum(["box", "realistic"]).optional(),
    position: z.enum(["outside", "inside"]).optional(),
    color: z.string().optional(),
    x: z.number().optional(),
    y: z.number().optional(),
    blur: z.number().optional(),
    spread: z.number().optional(),
  })
  .optional();

// Flip schema
export const flipSchema = z
  .object({
    verticle: z.boolean().optional(),
    horizontal: z.boolean().optional(),
  })
  .optional();

// Font schema
export const fontSchema = z.object({
  family: z.string(),
  weight: z.string(),
});

// ============================================================================
// BLOCK SCHEMAS
// ============================================================================

// Common block schema (base properties)
const commonBlockSchema = z.object({
  id: z.string(),
  type: z.enum(["text", "frame", "image", "shape"]),
  label: z.string(),
  x: z.number(),
  y: z.number(),
  width: z.number(),
  height: z.number(),
  rotate: rotateSchema,
  visible: z.boolean(),
  border: borderSchema,
  radius: radiusSchema,
  shadow: shadowSchema,
  background: z.string().optional(),
  flip: flipSchema,
  opacity: z.number(),
  locked: z.boolean().optional(),
});

// Text block schema
const textBlockSchema = commonBlockSchema.extend({
  type: z.literal("text"),
  text: z.string(),
  color: z.string(),
  fontSize: z.number(),
  lineHeight: z.number(),
  letterSpacing: z.number(),
  textAlign: textAlignSchema,
  font: fontSchema,
  textTransform: textTransformSchema.optional(),
  textDecoration: textDecorationSchema.optional(),
});

// Frame block schema
const frameBlockSchema = commonBlockSchema.extend({
  type: z.literal("frame"),
});

// Image block schema
const imageBlockSchema = commonBlockSchema.extend({
  type: z.literal("image"),
  url: z.string(),
  fit: z.string().optional(),
  position: z.string().optional(),
});

// Block union schema
export const blockSchema = z.discriminatedUnion("type", [
  textBlockSchema,
  frameBlockSchema,
  imageBlockSchema,
]);

// ============================================================================
// BLOCK SCHEMAS WITHOUT ID (for AI generation)
// ============================================================================

// Common block schema without ID (for AI generation - ID is always generated in execute)
const commonBlockSchemaWithoutId = commonBlockSchema.omit({ id: true });

// Text block schema without ID
export const textBlockSchemaWithoutId = commonBlockSchemaWithoutId.extend({
  type: z.literal("text"),
  text: z.string(),
  color: z.string(),
  fontSize: z.number(),
  lineHeight: z.number(),
  letterSpacing: z.number(),
  textAlign: textAlignSchema,
  font: fontSchema,
  textTransform: textTransformSchema.optional(),
  textDecoration: textDecorationSchema.optional(),
});

// Frame block schema without ID
export const frameBlockSchemaWithoutId = commonBlockSchemaWithoutId.extend({
  type: z.literal("frame"),
});

// Image block schema without ID
export const imageBlockSchemaWithoutId = commonBlockSchemaWithoutId.extend({
  type: z.literal("image"),
  url: z.string(),
  fit: z.string().optional(),
  position: z.string().optional(),
});

// Block schema without ID (for AI generation - ID will be added in execute)
// Using z.union instead of z.discriminatedUnion for better AI SDK compatibility
export const blockWithoutIdSchema = z.union([
  textBlockSchemaWithoutId,
  frameBlockSchemaWithoutId,
  imageBlockSchemaWithoutId,
]);

// ============================================================================
// TEMPLATE SCHEMA
// ============================================================================

// Template schema
export const templateSchema = z.object({
  size: editorSizeSchema,
  background: z.string().optional(),
  blocks: z.array(blockSchema),
});

// ============================================================================
// CANVAS STATE SCHEMA
// ============================================================================

// Canvas state schema
export const canvasStateSchema = z.object({
  size: editorSizeSchema,
  zoom: z.number(),
  background: z.string().optional(),
  mode: z.enum(["move", "select"]),
  isTextEditing: z.boolean(),
});

// ============================================================================
// TYPE EXPORTS (using z.infer)
// ============================================================================

// Enum types
export type IEditorBlockType = z.infer<typeof blockSchema>["type"];
export type IBorderType = z.infer<typeof borderTypeSchema>;
export type ITextAlign = z.infer<typeof textAlignSchema>;
export type ITextTransform = z.infer<typeof textTransformSchema>;
export type ITextDecoration = z.infer<typeof textDecorationSchema>;
export type IEditorSize = z.infer<typeof editorSizeSchema>;

// Block types
export type IEditorBlock = z.infer<typeof blockSchema>;
export type IEditorBlocks = z.infer<typeof blockSchema>;
export type IEditorBlockText = z.infer<typeof textBlockSchema>;
export type IEditorBlockFrame = z.infer<typeof frameBlockSchema>;
export type IEditorBlockImage = z.infer<typeof imageBlockSchema>;

// Template and canvas state types
export type Template = z.infer<typeof templateSchema>;
export type TemplateSchema = z.infer<typeof templateSchema>;
export type ICanvasState = z.infer<typeof canvasStateSchema>;
