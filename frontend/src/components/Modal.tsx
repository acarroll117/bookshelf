import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

type CloseFn = (overrideCb?: () => void) => void;

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

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const close = useCallback<CloseFn>(
    (overrideCb) => {
      setVisible(false);
      setTimeout(overrideCb ?? onClose, 200);
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
