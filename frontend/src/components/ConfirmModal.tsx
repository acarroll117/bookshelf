import { useState } from "react";
import Modal, { useModalClose } from "./Modal";

interface Props {
  message: string;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
}

function ConfirmContent({ message, onConfirm }: Omit<Props, "onCancel">) {
  const close = useModalClose();
  const [confirming, setConfirming] = useState(false);

  async function handleConfirm() {
    setConfirming(true);
    try {
      await onConfirm();
      close();
    } catch {
      setConfirming(false);
    }
  }

  return (
    <div className="rounded-lg bg-white dark:bg-gray-800 p-6 shadow-xl">
      <p className="text-sm text-gray-700 dark:text-gray-300">{message}</p>
      <div className="mt-5 flex justify-end gap-2">
        <button
          onClick={() => close()}
          disabled={confirming}
          className="rounded px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={handleConfirm}
          disabled={confirming}
          className="rounded bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700 disabled:opacity-50"
        >
          {confirming ? "Deleting…" : "Delete"}
        </button>
      </div>
    </div>
  );
}

export default function ConfirmModal({ message, onConfirm, onCancel }: Props) {
  return (
    <Modal onClose={onCancel} maxWidth="max-w-sm">
      <ConfirmContent message={message} onConfirm={onConfirm} />
    </Modal>
  );
}
