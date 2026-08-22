// Data files (constants/goals.js, constants/nutrientKeys.js) store icon names as plain strings
// so they stay decoupled from React — components resolve those names to actual lucide-react
// components through this map.
import { TrendingDown, Equal, TrendingUp, Flame, Beef, Wheat, Droplet, Leaf, Candy, FlaskConical } from 'lucide-react'

const ICONS = {
  TrendingDown,
  Equal,
  TrendingUp,
  Flame,
  Beef,
  Wheat,
  Droplet,
  Leaf,
  Candy,
  FlaskConical,
}

export function resolveIcon(name) {
  return ICONS[name]
}
