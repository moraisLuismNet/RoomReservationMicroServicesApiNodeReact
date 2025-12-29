import React from "react";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: "danger" | "info";
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  variant = "danger",
}) => {
  if (!isOpen) return null;

  const confirmButtonClass =
    variant === "danger"
      ? "bg-red-600 hover:bg-red-700 focus:ring-red-500"
      : "bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onCancel}
      ></div>
      <div className="relative w-full max-w-md mx-auto transform transition-all">
        <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
          <div className="px-6 py-8 sm:px-10">
            <div className="mb-6">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${
                  variant === "danger" ? "bg-red-50" : "bg-indigo-50"
                }`}
              >
                {variant === "danger" ? (
                  <svg
                    className="w-6 h-6 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-6 h-6 text-indigo-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                )}
              </div>
              <h3 className="text-2xl font-extrabold text-gray-900 mb-2">
                {title}
              </h3>
              <p className="text-gray-500 leading-relaxed">{message}</p>
            </div>
            <div className="flex flex-col sm:flex-row-reverse gap-3">
              <button
                type="button"
                className={`w-full sm:w-auto px-6 py-3 rounded-xl text-white text-sm font-bold shadow-sm transition-all transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 ${confirmButtonClass}`}
                onClick={onConfirm}
              >
                {confirmLabel}
              </button>
              <button
                type="button"
                className="w-full sm:w-auto px-6 py-3 rounded-xl text-gray-700 bg-gray-50 hover:bg-gray-100 text-sm font-bold transition-all transform active:scale-95 focus:outline-none border border-gray-200"
                onClick={onCancel}
              >
                {cancelLabel}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
