import type { VercelRequest, VercelResponse } from '@vercel/node'
import { HIGHLIGHT_KEYS } from '../shared/sections.js'
import { requireAdmin } from './_lib/auth.js'
import { getAdminDb } from './_lib/firebaseAdmin.js'
import { withErrorHandling } from './_lib/handler.js'
import { HttpError } from './_lib/httpError.js'
import { rateLimit } from './_lib/rateLimit.js'

const VALID_KEYS: readonly string[] = HIGHLIGHT_KEYS

export default withErrorHandling(async (req: VercelRequest, res: VercelResponse) => {
  if (req.method !== 'PUT') {
    res.setHeader('Allow', 'PUT')
    throw new HttpError(405, 'Método não permitido.')
  }

  await rateLimit(req, 'highlights-write', { limit: 20, windowSeconds: 300 })
  await requireAdmin(req)

  const keys = req.body?.keys
  if (!Array.isArray(keys) || keys.length !== 4) {
    throw new HttpError(400, 'Escolha exatamente 4 destaques.')
  }
  if (new Set(keys).size !== 4 || keys.some((k) => !VALID_KEYS.includes(k))) {
    throw new HttpError(400, 'Lista de destaques inválida.')
  }

  await getAdminDb().collection('settings').doc('highlights').set({ keys })
  res.status(200).json(keys)
})
