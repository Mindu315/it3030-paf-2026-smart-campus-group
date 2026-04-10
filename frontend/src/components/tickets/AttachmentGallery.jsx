import api from "../../api/axiosConfig"

function toAbsolute(url) {
  if (!url) return ''
  if (url.startsWith('http')) return url

  try {
    const apiBaseUrl = api?.defaults?.baseURL
    const origin = apiBaseUrl ? new URL(apiBaseUrl).origin : window.location.origin
    return url.startsWith('/') ? `${origin}${url}` : `${origin}/${url}`
  } catch {
    return url
  }
}

function isImageUrl(url) {
  const lower = String(url || '').toLowerCase()
  return ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'].some((ext) => lower.includes(ext))
}

function getFileName(url) {
  try {
    const absolute = toAbsolute(url)
    const pathname = new URL(absolute).pathname
    const last = pathname.split('/').filter(Boolean).pop()
    return last ? decodeURIComponent(last) : 'Attachment'
  } catch {
    return 'Attachment'
  }
}

function AttachmentGallery({ attachments = [] }) {
  if (!attachments.length) {
    return <p className="text-sm text-slate-500">No attachments uploaded.</p>
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {attachments.map((url) => (
        <a key={url} href={toAbsolute(url)} target="_blank" rel="noreferrer" className="block overflow-hidden rounded-lg border border-slate-200">
          {isImageUrl(url) ? (
            <img src={toAbsolute(url)} alt="Ticket attachment" className="h-28 w-full object-cover" />
          ) : (
            <div className="flex h-28 w-full items-center justify-center bg-slate-50 px-3 text-center text-xs font-semibold text-slate-700">
              {getFileName(url)}
            </div>
          )}
        </a>
      ))}
    </div>
  )
}

export default AttachmentGallery
