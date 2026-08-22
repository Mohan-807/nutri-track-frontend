import { useEffect, useRef, useState } from 'react'
import { animate } from 'framer-motion'

// Animates a displayed integer from its previous value to `value` whenever it changes —
// used for the hero calorie numbers so the dashboard feels alive rather than static.
export function useCountUp(value, { duration = 0.8 } = {}) {
  const [display, setDisplay] = useState(value)
  const previousValue = useRef(value)

  useEffect(() => {
    const controls = animate(previousValue.current, value, {
      duration,
      ease: 'easeOut',
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    })
    previousValue.current = value
    return () => controls.stop()
  }, [value, duration])

  return display
}
