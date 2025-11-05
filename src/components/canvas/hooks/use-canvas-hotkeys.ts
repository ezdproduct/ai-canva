import * as React from 'react';
import { editorStoreApi } from '../use-editor';

interface UseCanvasHotkeysOptions {
  setMode: (mode: 'move' | 'select') => void;
  addFrameBlock: () => void;
  addTextBlock: () => void;
  deleteSelectedBlocks: () => void;
}

const isEditableTarget = (target: EventTarget | null) => {
  if (!target || !(target instanceof HTMLElement)) {
    return false;
  }
  if (target.isContentEditable) {
    return true;
  }
  const tagName = target.tagName;
  if (tagName === 'INPUT' || tagName === 'TEXTAREA' || tagName === 'SELECT') {
    return true;
  }
  return Boolean(target.closest('input, textarea, select, [contenteditable="true"]'));
};

export const useCanvasHotkeys = ({ setMode, addFrameBlock, addTextBlock, deleteSelectedBlocks }: UseCanvasHotkeysOptions) => {
  const spacePressedRef = React.useRef(false);
  const spacePrevModeRef = React.useRef<'move' | 'select' | null>(null);

  React.useEffect(() => {
    const store = editorStoreApi;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented) {
        return;
      }

      const state = store.getState();

      if (event.code === 'Space') {
        if (event.metaKey || event.ctrlKey || event.altKey) {
          return;
        }
        if (isEditableTarget(event.target) || state.canvas.isTextEditing) {
          return;
        }
        event.preventDefault();
        if (!spacePressedRef.current) {
          spacePressedRef.current = true;
          spacePrevModeRef.current = state.canvas.mode;
          if (state.canvas.mode !== 'move') {
            setMode('move');
          }
        }
        return;
      }

      if (event.metaKey || event.ctrlKey || event.altKey) {
        return;
      }

      if (isEditableTarget(event.target) || state.canvas.isTextEditing) {
        return;
      }

      const key = event.key.toLowerCase();

      if (key === 'v') {
        setMode('select');
        event.preventDefault();
        return;
      }

      if (key === 'f') {
        addFrameBlock();
        event.preventDefault();
        return;
      }

      if (key === 't') {
        addTextBlock();
        event.preventDefault();
        return;
      }

      if (key === 'backspace' || key === 'delete') {
        if (state.selectedIds.length > 0) {
          event.preventDefault();
          deleteSelectedBlocks();
        }
      }
    };

    const resetSpaceMode = () => {
      if (!spacePressedRef.current) {
        return;
      }
      spacePressedRef.current = false;
      const previousMode = spacePrevModeRef.current;
      spacePrevModeRef.current = null;
      if (!previousMode) {
        return;
      }
      const currentMode = store.getState().canvas.mode;
      if (currentMode !== previousMode) {
        setMode(previousMode);
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.code === 'Space') {
        event.preventDefault();
        resetSpaceMode();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', resetSpaceMode);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', resetSpaceMode);
    };
  }, [addFrameBlock, addTextBlock, deleteSelectedBlocks, setMode]);
};
