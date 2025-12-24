import { fabric } from "fabric";
import { useEvent } from "react-use";

interface UseHotKeysProps {
  canvas: fabric.Canvas | null;
  undo: () => void;
  redo: () => void;
  save: (skip?: boolean) => void;
  copy: () => void;
  paste: () => void;
}

export const useHotKeys = ({
  canvas,
  undo,
  redo,
  save,
  copy,
  paste,
}: UseHotKeysProps) => {
  useEvent("keydown", (event: KeyboardEvent) => {
    const isCtrlKey = event.ctrlKey || event.metaKey;
    const key = event.key.toLowerCase();

    const target = event.target as HTMLElement | null;
    const isInput = target && ["INPUT", "TEXTAREA"].includes(target.tagName);

    if (isInput) return;

    // Delete selected objects
    if (key === "backspace") {
      event.preventDefault();
      canvas?.remove(...canvas.getActiveObjects());
      canvas?.discardActiveObject();
      canvas?.renderAll();
    }

    if (!isCtrlKey) return;

    switch (key) {
      case "z":
        event.preventDefault();
        undo();
        break;

      case "y":
        event.preventDefault();
        redo();
        break;

      case "c":
        event.preventDefault();
        copy();
        break;

      case "v":
        event.preventDefault();
        paste();
        break;

      case "s":
        event.preventDefault();
        save(true);
        break;

      case "a": {
        event.preventDefault();
        canvas?.discardActiveObject();

        const allObjects =
          canvas?.getObjects().filter((obj) => obj.selectable) ?? [];

        if (allObjects.length && canvas) {
          canvas.setActiveObject(
            new fabric.ActiveSelection(allObjects, { canvas })
          );
          canvas.renderAll();
        }
        break;
      }
    }
  });
};
