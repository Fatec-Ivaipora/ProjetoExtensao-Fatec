import { cert, getApps, initializeApp, type App } from 'firebase-admin/app'
import { getAuth, type Auth } from 'firebase-admin/auth'
import { getFirestore, type Firestore } from 'firebase-admin/firestore'

let app: App | undefined

function getAdminApp(): App {
  if (app) return app
  if (getApps().length > 0) {
    app = getApps()[0]
    return app
  }

  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n')

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error('Credenciais do Firebase Admin não configuradas (variáveis FIREBASE_ADMIN_*).')
  }

  app = initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) })
  return app
}

export function getAdminAuth(): Auth {
  return getAuth(getAdminApp())
}

export function getAdminDb(): Firestore {
  return getFirestore(getAdminApp())
}
