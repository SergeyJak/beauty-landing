'use client'

import Image, { type ImageProps } from 'next/image'

type OptimizedImageProps = Omit<ImageProps, 'alt'> & {
  alt: string
}

export default function OptimizedImage({
  className = '',
  sizes = '(max-width: 768px) 100vw, 50vw',
  ...props
}: OptimizedImageProps) {
  return (
    <Image
      className={className}
      sizes={sizes}
      {...props}
    />
  )
}
