function AttachmentUploader({ files, onChange }) {
  const onFileChange = (event) => {
    const selected = Array.from(event.target.files || [])
    const next = [...files, ...selected].slice(0, 3)
    onChange(next)
  }

  return (
    <div data-testid="attachment-uploader" className="space-y-2 rounded border border-dashed border-slate-300 p-4">
      <label className="block text-sm font-medium">Attachments</label>
      {files.length < 3 && (
        <label data-testid="add-attachment-btn" className="inline-block cursor-pointer rounded bg-slate-200 px-3 py-1 text-sm">
          Add image
          <input className="hidden" type="file" accept="image/png,image/jpeg" multiple onChange={onFileChange} />
        </label>
      )}
      <div className="flex gap-2 text-xs text-slate-600">
        {files.map((file) => <span key={file.name}>{file.name}</span>)}
      </div>
    </div>
  )
}

export default AttachmentUploader
