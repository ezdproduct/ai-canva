import { MoveableManagerInterface } from "react-moveable/declaration/types";

export const EditorDimensionViewable = {
  name: "dimensionViewable",
  props: [],
  events: [],
  render(moveable: MoveableManagerInterface<unknown, unknown>) {
    const rect = moveable.getRect();
    return (
      <div
        key="dimension-viewer"
        className="moveable-dimension"
        style={{
          left: `${rect.width / 2}px`,
          top: `${rect.height + 20}px`,
          transform: `translate(-50%, 0) scale(var(--zoom))`,
          transformOrigin: "top",
        }}
      >
        {Math.round(rect.offsetWidth)} x {Math.round(rect.offsetHeight)}
      </div>
    );
  },
} as const;
