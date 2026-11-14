import { it, expect } from 'vitest'
import { mkdtemp, mkdir, readFile, writeFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import sharp from 'sharp'

it('flattens redactions before resizing and publishes only the cropped WebP', async () => {
  const dir = await mkdtemp(path.join(tmpdir(), 'review-image-test-'))
  try {
    await mkdir(path.join(dir, 'src/content'), { recursive: true })
    await writeFile(path.join(dir, 'src/content/testimonials.json'), JSON.stringify([{ id: 'review-01' }]))
    await writeFile(path.join(dir, 'src/content/testimonial-images.json'), '{}')
    await sharp({ create: { width: 1600, height: 400, channels: 3, background: '#ff0000' } }).jpeg().toFile(path.join(dir, 'input.jpg'))
    await writeFile(path.join(dir, 'config.json'), JSON.stringify([{
      id: 'review-01', input: 'input.jpg', privacyReviewed: true,
      crop: { left: 0, top: 0, width: 1600, height: 400 },
      redactions: [{ left: 1200, top: 100, width: 200, height: 100 }],
    }]))
    execFileSync(process.execPath, [path.resolve('scripts/prepare-review-images.mjs'), path.join(dir, 'config.json')], { cwd: dir })
    const imagePath = path.join(dir, 'public/reviews/review-01.webp')
    const metadata = await sharp(imagePath).metadata()
    expect(metadata.width).toBe(1100)
    expect(metadata.height).toBe(275)
    expect(metadata.exif).toBeUndefined()
    const pixel = await sharp(imagePath).extract({ left: 894, top: 103, width: 1, height: 1 }).removeAlpha().raw().toBuffer()
    for (const [index, expected] of [232, 229, 223].entries()) expect(Math.abs(pixel[index] - expected)).toBeLessThan(10)
    const manifest = JSON.parse(await readFile(path.join(dir, 'src/content/testimonial-images.json'), 'utf8'))
    expect(manifest['review-01']).toEqual({ src: '/reviews/review-01.webp', width: 1100, height: 275 })
  } finally { await rm(dir, { recursive: true, force: true }) }
})
