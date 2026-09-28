export const ADMIN_SESSION_COOKIE = 'crystal_admin_session'
export const ADMIN_SESSION_MAX_AGE = 60 * 60 * 24 * 7

type SessionPayload = {
  username: string
  exp: number
}

const encoder = new TextEncoder()

function bytesToBase64Url(bytes: Uint8Array) {
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}

function base64UrlToBytes(value: string) {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/')
  const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4)
  const binary = atob(padded)
  return Uint8Array.from(binary, (char) => char.charCodeAt(0))
}

async function getSigningKey(secret: string) {
  return crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  )
}

export async function createAdminSessionToken(
  username: string,
  secret: string
) {
  const payload: SessionPayload = {
    username,
    exp: Math.floor(Date.now() / 1000) + ADMIN_SESSION_MAX_AGE,
  }

  const payloadPart = bytesToBase64Url(
    encoder.encode(JSON.stringify(payload))
  )
  const key = await getSigningKey(secret)
  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(payloadPart)
  )

  return `${payloadPart}.${bytesToBase64Url(new Uint8Array(signature))}`
}

export async function verifyAdminSessionToken(
  token: string | undefined,
  expectedUsername: string,
  secret: string
) {
  if (!token) return false

  const [payloadPart, signaturePart] = token.split('.')
  if (!payloadPart || !signaturePart) return false

  try {
    const key = await getSigningKey(secret)
    const validSignature = await crypto.subtle.verify(
      'HMAC',
      key,
      base64UrlToBytes(signaturePart),
      encoder.encode(payloadPart)
    )

    if (!validSignature) return false

    const payload = JSON.parse(
      new TextDecoder().decode(base64UrlToBytes(payloadPart))
    ) as SessionPayload

    return (
      payload.username === expectedUsername &&
      Number.isFinite(payload.exp) &&
      payload.exp > Math.floor(Date.now() / 1000)
    )
  } catch {
    return false
  }
}
