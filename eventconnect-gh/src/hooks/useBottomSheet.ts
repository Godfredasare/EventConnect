// ============================================================
// EventConnect GH – useBottomSheet
// ============================================================
import { useRef, useCallback } from 'react';
import { BottomSheetModal } from '@gorhom/bottom-sheet';

export function useBottomSheet() {
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const open = useCallback(() => {
    bottomSheetRef.current?.present();
  }, []);

  const close = useCallback(() => {
    bottomSheetRef.current?.dismiss();
  }, []);

  return { ref: bottomSheetRef, open, close };
}
