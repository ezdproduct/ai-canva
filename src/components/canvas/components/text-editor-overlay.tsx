import React, { useLayoutEffect, useRef } from "react";
import { IEditorBlockText } from "@/lib/schema";

interface TextEditorOverlayProps {
    editingText: {
        id: string;
        value: string;
        clientX: number;
        clientY: number;
        width: number;
        height: number;
        scale: number;
    };
    block: IEditorBlockText;
    onChange: (value: string) => void;
    onCommit: () => void;
    onCancel: () => void;
}

export function TextEditorOverlay({
    editingText,
    block,
    onChange,
    onCommit,
    onCancel,
}: TextEditorOverlayProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Auto-resize logic
    useLayoutEffect(() => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        // Reset height to allow shrinking
        textarea.style.height = "auto";
        const newHeight = textarea.scrollHeight;

        textarea.style.height = `${newHeight}px`;
    }, [editingText.value, editingText.scale, block.fontSize, block.lineHeight]);

    const fontSize = block.fontSize * editingText.scale;
    // Konva's lineHeight is a multiplier of fontSize, but in our schema block.lineHeight seems to be in px.
    // In TextNode we used: lineHeight={block.lineHeight / block.fontSize}.
    // So block.lineHeight is the absolute line height in px.
    const lineHeight = block.lineHeight * editingText.scale;
    const letterSpacing = (block.letterSpacing ?? 0) * editingText.scale;

    return (
        <textarea
            ref={textareaRef}
            style={{
                position: "fixed",
                left: editingText.clientX,
                top: editingText.clientY,
                width: editingText.width,
                // height is handled by auto-resize
                transformOrigin: "left top",
                zIndex: 30,
                fontSize: `${fontSize}px`,
                lineHeight: `${lineHeight}px`,
                fontFamily: block.font.family,
                fontWeight: block.font.weight,
                fontStyle: block.font.weight === "400" ? "normal" : "bold",
                color: block.color,
                textAlign: block.textAlign,
                letterSpacing: `${letterSpacing}px`,
                background: "transparent",
                border: "none",
                outline: "none",
                padding: "0px",
                margin: "0px",
                resize: "none",
                overflow: "hidden",
                whiteSpace: "pre-wrap",
            }}
            value={editingText.value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onCommit}
            onKeyDown={(e) => {
                if (e.key === "Escape") {
                    onCancel();
                }
                if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    onCommit();
                }
            }}
            autoFocus
        />
    );
}
