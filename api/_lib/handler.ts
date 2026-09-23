import type { VercelRequest, VercelResponse } from '@vercel/node'
import { HttpError } from './httpError.js'

/** Envolve um handler de rota: converte HttpError em resposta JSON e trata erros inesperados. */
export function withErrorHandling(
  fn: (req: VercelRequest, res: VercelResponse) => Promise<void>,
) {
  return async (req: VercelRequest, res: VercelResponse) => {
    try {
      await fn(req, res)
    } catch (err) {
      if (err instanceof HttpError) {
        res.status(err.status).json({ error: err.message })
        return
      }
      console.error(err)
      res.status(500).json({ error: 'Erro interno do servidor.' })
    }
  }
}
