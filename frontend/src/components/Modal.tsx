import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

type CloseFn = () => void;

const ModalContext = createContext<CloseFn>(() => {});

export function useModalClose() {
  return useContext(ModalContext);
}

interface Props {
  onClose: () => void;
  maxWidth?: string;
  children: ReactNode;
}

export default function Modal({ onClose, maxWidth = "max-w-md", children }: Props) {
  const [visible, setVisible] = useState(false);
  const cleanupRef = useRef<() => void>();

  useEffect(() => {
    const frameId = requestAnimationFrame(() => setVisible(true));
    return () => {
      cancelAnimationFrame(frameId);
      cleanupRef.current?.();
    };
  }, []);

  const close = useCallback<CloseFn>(
    () => {
      setVisible(false);
      const timeoutId = setTimeout(onClose, 200);
      cleanupRef.current = () => clearTimeout(timeoutId);
    },
    [onClose]
  );

  return (
    <ModalContext.Provider value={close}>
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-200 ${
          visible ? "bg-black/40" : "bg-black/0"
        }`}
      >
        <div
          role="dialog"
          aria-modal="true"
          className={`w-full ${maxWidth} transition-all duration-200 ${
            visible
              ? "opacity-100 scale-100 translate-y-0"
              : "opacity-0 scale-95 translate-y-4"
          }`}
        >
          {children}
        </div>
      </div>
    </ModalContext.Provider>
  );
}
