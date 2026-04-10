function ConfirmDeleteModal({
  isOpen,
  resourceName,
  onConfirm,
  onCancel,
}) {
  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-slate-800">
            Confirm Deletion
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Are you sure you want to delete{' '}
            <span className="font-medium text-slate-800">
              {resourceName || 'this resource'}
            </span>
            ? This action cannot be undone.
          </p>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDeleteModal