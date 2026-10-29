export function responsiveImageSet(source: string) {
  const image = new URL(source)
  return [480, 768, 1200, 1800, 2400]
    .map((width) => {
      const variant = new URL(image)
      variant.searchParams.set('w', String(width))
      return `${variant.href} ${width}w`
    })
    .join(', ')
}
