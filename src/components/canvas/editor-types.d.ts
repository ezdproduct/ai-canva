type IEditorSize = {
  width: number;
  height: number;
};

export type ICanvasState = {
  size: IEditorSize;
  zoom: number;
  background?: string;
  mode: "move" | "select";
  isTextEditing: boolean;
};

export type IEditorBlockType = "text" | "frame" | "image" | "shape";

export type IBorderType =
  | "solid"
  | "dotted"
  | "dashed"
  | "double"
  | "groove"
  | "ridge"
  | "inset"
  | "outset";

export type ITextAlign = "center" | "left" | "right" | "justify";

export type ITextTransform =
  | "inherit"
  | "capitalize"
  | "uppercase"
  | "lowercase";

export type ITextDecoration =
  | "inherit"
  | "overline"
  | "line-through"
  | "underline";

type IEditorBlockCommon = {
  id: string;
  type: IEditorBlockType;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotate?: {
    type: "2d" | "3d";
    value?: number;
    valueX?: number;
    valueY?: number;
    valueZ?: number;
  };
  visible: boolean;
  border?: {
    width?: {
      type?: "all" | "single";
      left?: number;
      right?: number;
      top?: number;
      bottom?: number;
    };
    type?: IBorderType;
    color?: string;
  };
  radius?: {
    type?: "all" | "single";
    tl?: number;
    tr?: number;
    br?: number;
    bl?: number;
  };
  shadow?: {
    type?: "box" | "realistic";
    position?: "outside" | "inside";
    color?: string;
    x?: number;
    y?: number;
    blur?: number;
    spread?: number;
  };
  background?: string;
  flip?: {
    verticle?: boolean;
    horizontal?: boolean;
  };
  opacity: number;
};

type IEditorBlockText = IEditorBlockCommon & {
  text: string;
  color: string;
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
  textAlign: ITextAlign;
  font: {
    family: string;
    weight: string;
  };
  textTransform?: ITextTransform;
  textDecoration?: ITextDecoration;
};

type IEditorBlockFrame = IEditorBlockCommon;

type IEditorBlockImage = IEditorBlockCommon & {
  url: string;
};

type IEditorBlockShape = IEditorBlockCommon & {
  hasFill: boolean;
  hasStroke: boolean;
  fill?: string;
  stroke?: string;
};

export type IEditorBlock = IEditorBlockText & IEditorBlockFrame;
export type IEditorBlocks = IEditorBlockText | IEditorBlockFrame;

export type Template = {
  size: IEditorSize;
  background?: string;
  blocks: IEditorBlocks[];
};
