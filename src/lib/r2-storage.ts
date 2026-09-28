import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import sharp from 'sharp'

export const MAX_IMAGE_BYTES = 15 * 1024 * 1024

type OptimizedImage = {
  full: Buffer
  thumbnail: Buffer
  width: number
  height: number
}

function getR2Config() {
  const accountId = process.env.R2_ACCOUNT_ID
  const accessKeyId = process.env.R2_ACCESS_KEY_ID
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY
  const bucket = process.env.R2_BUCKET
  const publicBaseUrl = process.env.R2_PUBLIC_BASE_URL?.replace(/\/$/, '')

  if (!accountId || !accessKeyId || !secretAccessKey || !bucket || !publicBaseUrl) {
    throw new Error('R2 storage is not configured')
  }

  return { accountId, accessKeyId, secretAccessKey, bucket, publicBaseUrl }
}

function getClient() {
  const config = getR2Config()
  return new S3Client({
    region: 'auto',
    endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
  })
}

export async function optimizeImage(buffer: Buffer): Promise<OptimizedImage> {
  const fullResult = await sharp(buffer)
    .rotate()
    .resize({
      width: 2200,
      height: 2200,
      fit: 'inside',
      withoutEnlargement: true,
    })
    .webp({ quality: 82, effort: 4 })
    .toBuffer({ resolveWithObject: true })

  const thumbnail = await sharp(buffer)
    .rotate()
    .resize({
      width: 600,
      height: 600,
      fit: 'inside',
      withoutEnlargement: true,
    })
    .webp({ quality: 76, effort: 4 })
    .toBuffer()

  return {
    full: fullResult.data,
    thumbnail,
    width: fullResult.info.width,
    height: fullResult.info.height,
  }
}

export async function uploadOptimizedImage(
  folder: string,
  id: string,
  variant: 'before' | 'after',
  input: Buffer
) {
  const config = getR2Config()
  const client = getClient()
  const optimized = await optimizeImage(input)
  const key = `${folder}/${id}/${variant}.webp`
  const thumbKey = `${folder}/${id}/${variant}-thumb.webp`

  await Promise.all([
    client.send(
      new PutObjectCommand({
        Bucket: config.bucket,
        Key: key,
        Body: optimized.full,
        ContentType: 'image/webp',
        CacheControl: 'public, max-age=31536000, immutable',
      })
    ),
    client.send(
      new PutObjectCommand({
        Bucket: config.bucket,
        Key: thumbKey,
        Body: optimized.thumbnail,
        ContentType: 'image/webp',
        CacheControl: 'public, max-age=31536000, immutable',
      })
    ),
  ])

  return {
    key,
    thumbKey,
    url: `${config.publicBaseUrl}/${key}`,
    thumbnailUrl: `${config.publicBaseUrl}/${thumbKey}`,
    width: optimized.width,
    height: optimized.height,
    optimizedSize: optimized.full.length,
  }
}

export async function deleteR2Objects(keys: string[]) {
  if (!keys.length) return
  const config = getR2Config()
  const client = getClient()

  await Promise.all(
    keys.map((key) =>
      client.send(
        new DeleteObjectCommand({
          Bucket: config.bucket,
          Key: key,
        })
      )
    )
  )
}
