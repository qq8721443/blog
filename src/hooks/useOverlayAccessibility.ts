import { type RefObject, useEffect, useRef } from "react";

function getFocusableElements(container: HTMLElement) {
  return Array.from(
    container.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  ).filter(
    (element) =>
      !element.hasAttribute("disabled") &&
      element.dataset.focusGuard !== "true" &&
      element.getAttribute("aria-hidden") !== "true",
  );
}

type UseOverlayAccessibilityProps = {
  dialogRef: RefObject<HTMLDivElement | null>;
  initialFocusRef: RefObject<HTMLElement | null>;
  onClose: () => void;
  open: boolean;
};

export function useOverlayAccessibility({
  dialogRef,
  initialFocusRef,
  onClose,
  open,
}: UseOverlayAccessibilityProps) {
  const previousFocusedElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const inertTargets = Array.from(
      document.querySelectorAll<HTMLElement>("header, main, footer, .skipLink"),
    );
    const previousInertStates = inertTargets.map((element) =>
      element.hasAttribute("inert"),
    );

    document.body.style.overflow = "hidden";
    inertTargets.forEach((element) => {
      element.setAttribute("inert", "");
    });

    return () => {
      document.body.style.overflow = previousOverflow;
      inertTargets.forEach((element, index) => {
        if (previousInertStates[index]) {
          element.setAttribute("inert", "");
          return;
        }

        element.removeAttribute("inert");
      });
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    previousFocusedElementRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    initialFocusRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const dialog = dialogRef.current;

      if (!dialog) {
        return;
      }

      const focusableElements = getFocusableElements(dialog);

      if (focusableElements.length === 0) {
        event.preventDefault();
        return;
      }

      const activeElement =
        document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null;
      const currentIndex = activeElement
        ? focusableElements.indexOf(activeElement)
        : -1;
      const nextIndex = event.shiftKey
        ? currentIndex <= 0
          ? focusableElements.length - 1
          : currentIndex - 1
        : currentIndex === -1 || currentIndex === focusableElements.length - 1
          ? 0
          : currentIndex + 1;

      event.preventDefault();
      focusableElements[nextIndex]?.focus();
    };

    const handleFocusIn = (event: FocusEvent) => {
      const dialog = dialogRef.current;

      if (!dialog) {
        return;
      }

      const target = event.target instanceof HTMLElement ? event.target : null;

      if (target && dialog.contains(target)) {
        return;
      }

      const focusableElements = getFocusableElements(dialog);
      focusableElements[0]?.focus();
    };

    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("focusin", handleFocusIn);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("focusin", handleFocusIn);
      previousFocusedElementRef.current?.focus();
    };
  }, [dialogRef, initialFocusRef, onClose, open]);
}
