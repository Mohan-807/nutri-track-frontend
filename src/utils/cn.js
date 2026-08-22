// Tiny classnames joiner — avoids pulling in the `clsx`/`classnames` package for something this small.
export function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}
