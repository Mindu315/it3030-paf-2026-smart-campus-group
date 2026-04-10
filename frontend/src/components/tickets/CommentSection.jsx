import { useEffect, useState } from 'react'
import { addComment, getComments } from '../../services/ticketService'

function CommentSection({ ticketId }) {
  const [comments, setComments] = useState([])
  const [content, setContent] = useState('')

  const loadComments = async () => {
    try {
      const res = await getComments(ticketId)
      setComments(res.data)
    } catch {
      setComments([])
    }
  }

  useEffect(() => {
    loadComments()
  }, [ticketId])

  const submit = async () => {
    if (!content.trim()) return
    await addComment(ticketId, { content })
    setContent('')
    loadComments()
  }

  return (
    <section className="mt-6">
      <h3 className="mb-2 text-lg font-semibold">Comments</h3>
      <div className="space-y-2">
        {comments.map((comment) => (
          <article key={comment.id} className="rounded border border-slate-200 p-2 text-sm">
            <div className="font-medium">{comment.authorEmail}</div>
            <div>{comment.content}</div>
          </article>
        ))}
      </div>
      <textarea
        className="mt-3 w-full rounded border p-2"
        placeholder="Add a comment"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button className="mt-2 rounded bg-slate-800 px-3 py-1 text-white" onClick={submit}>Submit Comment</button>
    </section>
  )
}

export default CommentSection
