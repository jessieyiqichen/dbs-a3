"use client";

import { useEffect } from "react";
import { Button } from "./Button";

export const TOAST_MS = 8000;

interface ToastProps {
  message: string | null;
  onUndo?: () => void;
  onClose: () => void;
}

/** A short confirmation at the bottom of the screen, with an optional Undo. */
export function Toast({ message, onUndo, onClose }: ToastProps) {
  useEffect(() => {
    if (!message) return;
    const timer = window.setTimeout(onClose, TOAST_MS);
    return () => window.clearTimeout(timer);
  }, [message, onClose]);

  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-4 flex justify-center px-4">
      {message && (
        <div className="pointer-events-auto flex w-full max-w-md items-center justify-between gap-3 rounded-2xl bg-ink px-4 py-2 font-bold text-surface shadow-lg">
          <span>{message}</span>
          {onUndo && (
            <Button variant="ghost" className="text-surface decoration-surface hover:decoration-reward" onClick={onUndo}>
              Undo
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
