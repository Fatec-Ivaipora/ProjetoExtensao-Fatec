import type { VercelRequest, VercelResponse } from '@vercel/node'
import { randomUUID } from 'node:crypto'
import { isSection } from '../../../shared/sections.js'
import { requireAdmin } from '../../_lib/auth.js'
import { getAdminDb } from '../../_lib/firebaseAdmin.js'
import { withErrorHandling } from '../../_lib/handler.js'
import { HttpError } from '../../_lib/httpError.js'
import { rateLimit } from '../../_lib/rateLimit.js'

export default withErrorHandling(async (req: VercelRequest, res: VercelResponse) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    throw new HttpError(405, 'Método não permitido.')
  }

  await rateLimit(req, 'posts-write', { limit: 30, windowSeconds: 300 })
  await requireAdmin(req)

  const section = String(req.query.section || '')
  if (!isSection(section)) {
    throw new HttpError(404, 'Seção desconhecida.')
  }

  const title = String(req.body?.title || '').trim()
  if (!title) {
    throw new HttpError(400, 'O título é obrigatório.')
  }

  const post = {
    id: randomUUID(),
    title,
    date:
      String(req.body?.date || '').trim() ||
      new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }),
    excerpt: String(req.body?.excerpt || '').trim() || null,
    fileUrl: req.body?.fileUrl ? String(req.body.fileUrl) : null,
    createdAt: new Date().toISOString(),
  }

  await getAdminDb().collection(section).doc(post.id).set(post)
  res.status(201).json(post)
})
