/** Run only on private source files. See docs/client-testimonials.md. */
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const configPath = process.argv[2]
if (!configPath) throw new Error('Usage: node scripts/prepare-review-images.mjs /private/path/review-crops.json')
const config = JSON.parse(await readFile(configPath, 'utf8'))
const records = JSON.parse(await readFile('src/content/testimonials.json', 'utf8'))
const manifestPath = 'src/content/testimonial-images.json'
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'))
const out = path.resolve('public/reviews')
await mkdir(out, { recursive: true })
for (const entry of config) {
  if (!records.some((review) => review.id === entry.id)) throw new Error(`Unknown review: ${entry.id}`)
  if (entry.privacyReviewed !== true) throw new Error(`Privacy review is required: ${entry.id}`)
  const input = path.resolve(path.dirname(configPath), entry.input)
  if (input.startsWith(path.resolve('public') + path.sep)) throw new Error('Source screenshots must stay outside public/')
  const crop = entry.crop
  if (!crop || !['left','top','width','height'].every((key) => Number.isInteger(crop[key]) && crop[key] >= (key === 'width' || key === 'height' ? 1 : 0))) {
    throw new Error(`An explicit message-only crop is required: ${entry.id}`)
  }
  // Masks are relative to the cropped image. Solid overlays cannot be reversed.
  const overlays = (entry.redactions || []).map((rect) => {
    if (!['left','top','width','height'].every((key) => Number.isInteger(rect[key]) && rect[key] >= (key === 'width' || key === 'height' ? 1 : 0)) ||
        rect.left + rect.width > crop.width || rect.top + rect.height > crop.height) throw new Error(`Invalid redaction: ${entry.id}`)
    return { input: { create: { width: rect.width, height: rect.height, channels: 4, background: '#e8e5df' } }, left: rect.left, top: rect.top }
  })
  const cropped = await sharp(input).rotate().extract(crop).toBuffer()
  // Flatten masks at source resolution before resizing; composite coordinates must not move.
  const flattened = await sharp(cropped).composite(overlays).toBuffer()
  const result = await sharp(flattened).resize({ width: 1100, withoutEnlargement: true }).webp({ quality: 88 }).toBuffer({ resolveWithObject: true })
  const filename = `${entry.id}.webp`
  await writeFile(path.join(out, filename), result.data)
  manifest[entry.id] = { src: `/reviews/${filename}`, width: result.info.width, height: result.info.height }
}
await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n')
console.log(`Prepared ${config.length} review images. Inspect each output visually before committing.`)
