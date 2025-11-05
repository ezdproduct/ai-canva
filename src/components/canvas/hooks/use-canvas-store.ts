import { useMemo } from 'react';
import { useEditorStore, type EditorStore, selectOrderedBlocks } from '../use-editor';
import { shallow } from 'zustand/shallow';

type CanvasStoreSlice = {
  blocks: ReturnType<typeof selectOrderedBlocks>;
  selectedIds: EditorStore['selectedIds'];
  hoveredId: EditorStore['hoveredId'];
  mode: EditorStore['canvas']['mode'];
  isTextEditing: EditorStore['canvas']['isTextEditing'];
  zoom: EditorStore['canvas']['zoom'];
  stagePosition: EditorStore['canvas']['stagePosition'];
  containerSize: EditorStore['canvas']['containerSize'];
  size: EditorStore['canvas']['size'];
  background: EditorStore['canvas']['background'];
};

type CanvasStoreActions = Pick<
  EditorStore,
  | 'setSelectedIds'
  | 'setHoveredId'
  | 'setStage'
  | 'setStageZoom'
  | 'setStagePosition'
  | 'setCanvasContainerSize'
  | 'setIsTextEditing'
  | 'setMode'
  | 'addFrameBlock'
  | 'addTextBlock'
  | 'deleteSelectedBlocks'
  | 'setBlockPosition'
  | 'updateBlockValues'
>;

const selectCanvasSlice = (state: EditorStore): CanvasStoreSlice => ({
  blocks: selectOrderedBlocks(state),
  selectedIds: state.selectedIds,
  hoveredId: state.hoveredId,
  mode: state.canvas.mode,
  isTextEditing: state.canvas.isTextEditing,
  zoom: state.canvas.zoom,
  stagePosition: state.canvas.stagePosition,
  containerSize: state.canvas.containerSize,
  size: state.canvas.size,
  background: state.canvas.background,
});

const selectCanvasActions = (state: EditorStore): CanvasStoreActions => ({
  setSelectedIds: state.setSelectedIds,
  setHoveredId: state.setHoveredId,
  setStage: state.setStage,
  setStageZoom: state.setStageZoom,
  setStagePosition: state.setStagePosition,
  setCanvasContainerSize: state.setCanvasContainerSize,
  setIsTextEditing: state.setIsTextEditing,
  setMode: state.setMode,
  addFrameBlock: state.addFrameBlock,
  addTextBlock: state.addTextBlock,
  deleteSelectedBlocks: state.deleteSelectedBlocks,
  setBlockPosition: state.setBlockPosition,
  updateBlockValues: state.updateBlockValues,
});

export const useCanvasStore = () => {
  const state = useEditorStore(selectCanvasSlice, shallow);
  const actions = useEditorStore(selectCanvasActions, shallow);

  // shallow already handles referential stability; memo here to emphasize combined return
  return useMemo(
    () => ({
      ...state,
      ...actions,
    }),
    [state, actions]
  );
};
