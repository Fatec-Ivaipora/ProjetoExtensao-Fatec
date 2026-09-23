import type { VercelRequest } from '@vercel/node'
import { getAdminDb } from './firebaseAdmin'
import { HttpError } from './httpError'

function clientIp(req: VercelRequest): string {
  const forwarded = req.headers['x-forwarded-for']
  const raw = Array.isArray(forwarded) ? forwarded[0] : forwarded?.split(',')[0]
  return (raw || req.socket?.remoteAddress || 'unknown').trim()
}

/**
 * Limite fixo por janela de tempo, contado por IP + rota, guardado na coleção
 * interna `rateLimits` do Firestore (sem acesso do client — ver firestore.rules).
 * Roda antes de requireAdmin: barra flood mesmo de quem não tem token nenhum.
 */
export async function rateLimit(
  req: VercelRequest,
  bucket: string,
  { limit, windowSeconds }: { limit: number; windowSeconds: number },
): Promise<void> {
  const ip = clientIp(req)
  const windowStart = Math.floor(Date.now() / (windowSeconds * 1000))
  const docId = `${bucket}_${ip}_${windowStart}`.replace(/[/\s]/g, '_')
  const ref = getAdminDb().collection('rateLimits').doc(docId)

  const exceeded = await getAdminDb().runTransaction(async (tx) => {
    const snap = await tx.get(ref)
    const count = (snap.data()?.count as number | undefined) ?? 0
    if (count >= limit) return true
    tx.set(ref, { count: count + 1, windowStart, updatedAt: Date.now() }, { merge: true })
    return false
  })

  if (exceeded) {
    throw new HttpError(429, 'Muitas requisições em pouco tempo. Tente novamente em instantes.')
  }
}
