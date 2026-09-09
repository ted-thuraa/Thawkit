/**
 * Layer Updates Hook
 *
 * Manages real-time synchronization of layer changes
 */

import { useCallback, useEffect, useMemo, useRef } from "react";

import { findAddedLayerIds } from "@/lib/layer-utils";
import { debounce } from "lodash";
import { Layer } from "@/types/editor/layerSchema";
import { usePagesStore } from "@/stores/editor/usePagesStore";

export interface LayerUpdate {
  layer_id: string;
  user_id: string;
  changes: Partial<Layer>;
  timestamp: number;
}

// Helper function to find layer in draft
function findLayerInDraft(layers: Layer[], layerId: string): Layer | null {
  for (const layer of layers) {
    if (layer.id === layerId) return layer;
    if (layer.children) {
      const found = findLayerInDraft(layer.children, layerId);
      if (found) return found;
    }
  }
  return null;
}

export interface UseLayerUpdatesReturn {
  LayerUpdate: (layerId: string, changes: Partial<Layer>) => void;
  LayerAdd: (
    pageId: string,
    parentLayerId: string | null,
    layerName: string,
    newLayer: Layer,
  ) => void;
  LayerDelete: (pageId: string, layerId: string) => void;
  LayerMove: (
    pageId: string,
    layerId: string,
    targetParentId: string | null,
    targetIndex: number,
  ) => void;
  isReceivingUpdates: boolean;
  lastUpdateTime: number | null;
}

export function useLayerUpdates(pageId: string | null): UseLayerUpdatesReturn {
  const channelRef = useRef<any>(null);
  const isReceivingUpdates = useRef(false);
  const lastUpdateTime = useRef<number | null>(null);
  const updateQueue = useRef<LayerUpdate[]>([]);
  const pageIdRef = useRef<string | null>(pageId);

  // Update pageIdRef whenever pageId changes
  useEffect(() => {
    pageIdRef.current = pageId;
  }, [pageId]);

  const handleIncomingUpdate = useCallback((update: LayerUpdate) => {
    // eslint-disable-next-line react-hooks/exhaustive-deps -- processUpdateQueue is a ref, adding would cause infinite loop
  }, []);

  const handleIncomingLayerAdd = useCallback((payload: any) => {}, [pageId]);

  const handleIncomingLayerDelete = useCallback((payload: any) => {}, [pageId]);

  const handleIncomingLayerMove = useCallback((payload: any) => {}, [pageId]);

  const processUpdateQueue = useCallback(() => {}, []); // No dependencies since we use refs

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (channelRef.current) {
        channelRef.current.unsubscribe();
      }
    };
  }, []);

  // Stable return reference: broadcast callbacks are already memoized via
  // useCallback, and `isReceivingUpdates` / `lastUpdateTime` are refs that
  // mutate silently — no consumer reads them. Returning a stable object
  // prevents downstream `React.memo` cascades through Canvas → LayerRenderer
  // → LayerContextMenu when the host component re-renders for unrelated reasons.
  return useMemo(
    () => ({
      isReceivingUpdates: isReceivingUpdates.current,
      lastUpdateTime: lastUpdateTime.current,
    }),
    [],
  );
}
