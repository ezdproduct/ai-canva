import type { MoveableManagerInterface } from "react-moveable/declaration/types";
import { cn } from "@/lib/utils";

export const EditorDimensionViewable = {
  name: "dimensionViewable",
  props: [],
  events: [],
  render(moveable: MoveableManagerInterface<unknown, unknown>) {
    const rect = moveable.getRect();
    const isVisible = Boolean(
      // @ts-ignore - custom prop injected via Moveable props
      moveable.props.dimensionVisible
    );
    return (
      <div
        key="dimension-viewer"
        className={cn("moveable-dimension", { visible: isVisible })}
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
