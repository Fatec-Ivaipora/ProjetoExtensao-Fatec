import type { VercelRequest } from '@vercel/node'
import { getAdminAuth } from './firebaseAdmin'
import { HttpError } from './httpError'

/**
 * Confere o ID token do Firebase Auth enviado no header Authorization e exige
 * que seja exatamente a conta de admin (ADMIN_UID) — como não existe cadastro
 * público neste app, isso fecha o buraco de alguém criar uma conta própria
 * direto pela API pública do Firebase Auth e tentar escrever mesmo assim.
 */
export async function requireAdmin(req: VercelRequest): Promise<string> {
  const header = req.headers.authorization || ''
  const headerToken = header.startsWith('Bearer ') ? header.slice(7).trim() : ''
  // O handshake de upload do Vercel Blob (@vercel/blob/client `upload()`) nem
  // sempre repassa headers customizados até o handleUploadUrl — por isso
  // aceitamos o token também via querystring nessa rota específica.
  const queryToken = typeof req.query.token === 'string' ? req.query.token : ''
  const token = headerToken || queryToken
  if (!token) {
    throw new HttpError(401, 'Não autorizado. Faça login novamente.')
  }

  let uid: string
  try {
    uid = (await getAdminAuth().verifyIdToken(token)).uid
  } catch {
    throw new HttpError(401, 'Sessão inválida ou expirada. Faça login novamente.')
  }

  const adminUid = process.env.ADMIN_UID
  if (!adminUid || uid !== adminUid) {
    throw new HttpError(403, 'Conta sem permissão de administrador.')
  }

  return uid
}
