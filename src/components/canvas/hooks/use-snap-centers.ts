import { useState, useCallback } from "react";
import type Konva from "konva";

interface SnapGuide {
    points: number[];
    orientation: "V" | "H";
}

const SNAP_THRESHOLD = 5;

export function useSnapCenters(
    stageRef: React.RefObject<Konva.Stage | null>,
    canvasSize: { width: number; height: number }
) {
    const [guides, setGuides] = useState<SnapGuide[]>([]);

    const handleDragMove = useCallback(
        (e: Konva.KonvaEventObject<DragEvent>) => {
            const node = e.target;
            const stage = stageRef.current;
            if (!stage) return;

            // Clear previous guides
            setGuides([]);

            // Get node center in absolute coordinates?
            // Node position is usually relative to its parent (Layer or Group).
            // If direct child of Layer, x/y are relative to Layer (which might be scaled/panned by Stage).
            // However, we are usually interested in "Document Coordinates" (Canvas Logical Size).
            // The canvas conceptual center is width/2, height/2.

            // Node properties:
            const box = node.getClientRect({ skipTransform: false }); // absolute bounding box in window pixels?
            // No, getClientRect is relative to stage container div usually?
            // Actually `node.getClientRect({ relativeTo: stage.getLayer() })` might be better if we want logical coords?
            // Let's assume nodes are direct children of a main Layer or Group that represents the Canvas area.
            // In EditorCanvas, nodes seem to be direct children of <Layer> inside <Stage>.
            // The stage might have zoom/pan.

            // Let's keep it simple: We want to snap to the logical canvas center.
            // Logical canvas size is `canvasSize`.
            const centerX = canvasSize.width / 2;
            const centerY = canvasSize.height / 2;

            // Node current position (top-left usually or centered if offset)
            // We need the visual center of the node.
            // node.x() and node.y() are the anchor points.
            // If blocks are standard, x/y is top-left.
            // We need width/height * scale.

            const absPos = node.getAbsolutePosition();
            // We need to convert absolute position back to "Canvas Logical Space" if the stage is zoomed/panned?
            // Wait, if we are modifying node.x() / node.y() directly in the drag handler, 
            // Konva handles the view transform. passing {x, y} to dragEnd.

            // We should check `node.position()` which is relative to parent.
            // If parent is the main Layer (scale=1 usually? no, zoom is on stage usually).

            // Let's assume standard behavior:
            // node.x() is the coordinate in the layer.
            // The layer might be transformed? Usually Stage is transformed for Zoom/Pan or a Group.
            // In EditorCanvas, we use `useCanvasZoomPan` which likely transforms the Stage or a Content Layer.

            // Let's look at EditorCanvas:
            // Nodes are children of `Layer` or `Stage`. 
            // Actually `ZoomHandler` seems to wrap the content?
            // Let's verify `EditorCanvas` structure in next step if this fails.
            // Assuming `node.x()` allows us to place it relative to canvas 0,0.

            const rotation = node.rotation();
            // Simplified center calculation (ignoring rotation complex bounding box for now, assuming axis aligned or simple center)
            // Ideally getClientRect() relative to parent is safest.
            const rect = node.getClientRect({ relativeTo: node.getParent()! });

            const nodeCenterX = rect.x + rect.width / 2;
            const nodeCenterY = rect.y + rect.height / 2;

            const newGuides: SnapGuide[] = [];

            // Snap X
            if (Math.abs(nodeCenterX - centerX) < SNAP_THRESHOLD) {
                // We want to move the node so its center is exactly at centerX.
                // Current Center = rect.x + rect.width/2
                // Desired Center = centerX
                // Offset needed = centerX - Current Center
                // We apply this offset to the node's position.

                const diff = centerX - nodeCenterX;
                node.x(node.x() + diff);

                newGuides.push({
                    orientation: "V",
                    points: [centerX, 0, centerX, canvasSize.height],
                });
            }

            // Snap Y
            if (Math.abs(nodeCenterY - centerY) < SNAP_THRESHOLD) {
                const diff = centerY - nodeCenterY;
                node.y(node.y() + diff);

                newGuides.push({
                    orientation: "H",
                    points: [0, centerY, canvasSize.width, centerY],
                });
            }

            setGuides(newGuides);
        },
        [canvasSize, stageRef]
    );

    const handleDragEnd = useCallback(() => {
        setGuides([]);
    }, []);

    return { guides, handleDragMove, handleDragEnd };
}
