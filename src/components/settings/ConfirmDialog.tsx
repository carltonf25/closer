'use client';

import { X, AlertTriangle } from 'lucide-react';

type Props = {
  title: string;
  message: string;
  confirmLabel: string;
  confirmVariant?: 'primary' | 'danger' | 'warning';
  onConfirm: () => void;
  onCancel: () => void;
};

export const ConfirmDialog = ({
  title,
  message,
  confirmLabel,
  confirmVariant = 'primary',
  onConfirm,
  onCancel,
}: Props) => {
  const getConfirmButtonClass = () => {
    switch (confirmVariant) {
      case 'danger':
        return 'bg-red-600 hover:bg-red-700 text-white';
      case 'warning':
        return 'bg-yellow-600 hover:bg-yellow-700 text-white';
      default:
        return 'bg-blue-600 hover:bg-blue-700 text-white';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            {confirmVariant === 'danger' || confirmVariant === 'warning' ? (
              <AlertTriangle className="h-6 w-6 text-yellow-600 mr-2" />
            ) : null}
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="text-sm text-gray-600 mb-6">{message}</p>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`flex-1 px-4 py-2 rounded-lg font-medium ${getConfirmButtonClass()}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
