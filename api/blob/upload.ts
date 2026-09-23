import { handleUpload, type HandleUploadBody } from '@vercel/blob/client'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { requireAdmin } from '../_lib/auth'
import { withErrorHandling } from '../_lib/handler'
import { HttpError } from '../_lib/httpError'
import { rateLimit } from '../_lib/rateLimit'

const ALLOWED_CONTENT_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]

/**
 * Gera o token de upload direto pro Vercel Blob (o arquivo vai do navegador
 * pro Blob sem passar pelo body desta function — importante pros PDFs de
 * até 25MB não esbarrarem no limite de payload das serverless functions).
 */
export default withErrorHandling(async (req: VercelRequest, res: VercelResponse) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    throw new HttpError(405, 'Método não permitido.')
  }

  await rateLimit(req, 'blob-upload', { limit: 30, windowSeconds: 300 })
  await requireAdmin(req)

  const body = req.body as HandleUploadBody

  const jsonResponse = await handleUpload({
    body,
    request: req,
    onBeforeGenerateToken: async () => ({
      allowedContentTypes: ALLOWED_CONTENT_TYPES,
      maximumSizeInBytes: 25 * 1024 * 1024,
      addRandomSuffix: true,
    }),
    // Não usamos o callback de conclusão: o client já recebe a URL final do
    // upload() e a manda pro Firestore via /api/posts. Esse callback também
    // não dispara em `vercel dev` local (exige um domínio público acessível).
    onUploadCompleted: async () => {},
  })

  res.status(200).json(jsonResponse)
})
