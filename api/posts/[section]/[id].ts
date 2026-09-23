import { del } from '@vercel/blob'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { isSection } from '../../../shared/sections'
import { requireAdmin } from '../../_lib/auth'
import { getAdminDb } from '../../_lib/firebaseAdmin'
import { withErrorHandling } from '../../_lib/handler'
import { HttpError } from '../../_lib/httpError'
import { rateLimit } from '../../_lib/rateLimit'

export default withErrorHandling(async (req: VercelRequest, res: VercelResponse) => {
  const section = String(req.query.section || '')
  const id = String(req.query.id || '')
  if (!isSection(section)) {
    throw new HttpError(404, 'Seção desconhecida.')
  }
  if (req.method !== 'PUT' && req.method !== 'DELETE') {
    res.setHeader('Allow', 'PUT, DELETE')
    throw new HttpError(405, 'Método não permitido.')
  }

  await rateLimit(req, 'posts-write', { limit: 30, windowSeconds: 300 })
  await requireAdmin(req)

  const ref = getAdminDb().collection(section).doc(id)
  const snap = await ref.get()
  if (!snap.exists) {
    throw new HttpError(404, 'Publicação não encontrada.')
  }
  const current = snap.data() as { fileUrl?: string | null; createdAt?: string }

  if (req.method === 'DELETE') {
    await ref.delete()
    if (current.fileUrl) await del(current.fileUrl).catch(() => {})
    res.status(200).json({ ok: true })
    return
  }

  // PUT
  const title = String(req.body?.title || '').trim()
  if (!title) {
    throw new HttpError(400, 'O título é obrigatório.')
  }

  const fileUrlProvided = Object.prototype.hasOwnProperty.call(req.body ?? {}, 'fileUrl')
  const newFileUrl = fileUrlProvided
    ? req.body.fileUrl
      ? String(req.body.fileUrl)
      : null
    : (current.fileUrl ?? null)

  if (fileUrlProvided && current.fileUrl && current.fileUrl !== newFileUrl) {
    await del(current.fileUrl).catch(() => {})
  }

  const updated = {
    title,
    date:
      String(req.body?.date || '').trim() ||
      new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }),
    excerpt: String(req.body?.excerpt || '').trim() || null,
    fileUrl: newFileUrl,
    updatedAt: new Date().toISOString(),
  }
  await ref.update(updated)
  res.status(200).json({ id, createdAt: current.createdAt, ...updated })
})
