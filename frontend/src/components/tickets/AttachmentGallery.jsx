function toAbsolute(url) {
  if (!url) return ''
  if (url.startsWith('http')) return url
  return `http://localhost:8081${url}`
}

function AttachmentGallery({ attachments = [] }) {
  if (!attachments.length) {
    return <p className="text-sm text-slate-500">No attachments uploaded.</p>
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {attachments.map((url) => (
        <a key={url} href={toAbsolute(url)} target="_blank" rel="noreferrer" className="block overflow-hidden rounded-lg border border-slate-200">
          <img src={toAbsolute(url)} alt="Ticket attachment" className="h-28 w-full object-cover" />
        </a>
      ))}
    </div>
  )
}

export default AttachmentGallery
