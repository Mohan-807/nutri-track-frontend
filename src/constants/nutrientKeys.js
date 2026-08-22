// Single source of truth for iterating nutrients consistently across Today/History/Add Food.
// `key` matches a logged-entry nutrient field; `targetKey` matches the profile target field
// it should be compared against (target field names differ slightly for the ceiling nutrients).
// `icon` is a string name resolved via utils/iconMap.js (keeps this file framework-agnostic).
export const NUTRIENT_META = {
  calories: {
    key: 'calories',
    targetKey: 'calories',
    label: 'Calories',
    unit: 'kcal',
    color: 'accent',
    direction: 'target',
    icon: 'Flame',
  },
  proteinG: {
    key: 'proteinG',
    targetKey: 'proteinG',
    label: 'Protein',
    unit: 'g',
    color: 'blue',
    direction: 'target',
    icon: 'Beef',
  },
  carbsG: {
    key: 'carbsG',
    targetKey: 'carbsG',
    label: 'Carbs',
    unit: 'g',
    color: 'amber',
    direction: 'target',
    icon: 'Wheat',
  },
  fatG: {
    key: 'fatG',
    targetKey: 'fatG',
    label: 'Fat',
    unit: 'g',
    color: 'rose',
    direction: 'target',
    icon: 'Droplet',
  },
  fiberG: {
    key: 'fiberG',
    targetKey: 'fiberG',
    label: 'Fiber',
    unit: 'g',
    color: 'violet',
    direction: 'min', // reaching/exceeding the target is good
    icon: 'Leaf',
  },
  sugarG: {
    key: 'sugarG',
    targetKey: 'sugarMaxG',
    label: 'Sugar',
    unit: 'g',
    color: 'pink',
    direction: 'max', // staying under the target is good
    icon: 'Candy',
  },
  sodiumMg: {
    key: 'sodiumMg',
    targetKey: 'sodiumMaxMg',
    label: 'Sodium',
    unit: 'mg',
    color: 'slate',
    direction: 'max',
    icon: 'FlaskConical',
  },
}

export const MACRO_KEYS = ['proteinG', 'carbsG', 'fatG']
export const MICRO_KEYS = ['fiberG', 'sugarG', 'sodiumMg']

// Tailwind class lookups per nutrient color, kept here (not in the Tailwind theme) since
// light/dark need different shade steps per nutrient. `gradient` powers the icon badges;
// `glow` is a matching tinted shadow used behind those badges for a soft premium lift.
export const NUTRIENT_COLOR_CLASSES = {
  accent: {
    bar: 'bg-linear-to-r from-accent-400 to-accent-600 dark:from-accent-400 dark:to-accent-500',
    text: 'text-accent-600 dark:text-accent-400',
    gradient: 'from-accent-400 to-accent-600 dark:from-accent-400 dark:to-accent-500',
    glow: 'shadow-lg shadow-accent-500/30',
  },
  blue: {
    bar: 'bg-linear-to-r from-blue-400 to-blue-600 dark:from-blue-400 dark:to-blue-500',
    text: 'text-blue-600 dark:text-blue-400',
    gradient: 'from-blue-400 to-blue-600 dark:from-blue-400 dark:to-blue-500',
    glow: 'shadow-lg shadow-blue-500/30',
  },
  amber: {
    bar: 'bg-linear-to-r from-amber-400 to-amber-600 dark:from-amber-400 dark:to-amber-500',
    text: 'text-amber-600 dark:text-amber-400',
    gradient: 'from-amber-400 to-amber-600 dark:from-amber-400 dark:to-amber-500',
    glow: 'shadow-lg shadow-amber-500/30',
  },
  rose: {
    bar: 'bg-linear-to-r from-rose-400 to-rose-600 dark:from-rose-400 dark:to-rose-500',
    text: 'text-rose-600 dark:text-rose-400',
    gradient: 'from-rose-400 to-rose-600 dark:from-rose-400 dark:to-rose-500',
    glow: 'shadow-lg shadow-rose-500/30',
  },
  violet: {
    bar: 'bg-linear-to-r from-violet-400 to-violet-600 dark:from-violet-400 dark:to-violet-500',
    text: 'text-violet-600 dark:text-violet-400',
    gradient: 'from-violet-400 to-violet-600 dark:from-violet-400 dark:to-violet-500',
    glow: 'shadow-lg shadow-violet-500/30',
  },
  pink: {
    bar: 'bg-linear-to-r from-pink-400 to-pink-600 dark:from-pink-400 dark:to-pink-500',
    text: 'text-pink-600 dark:text-pink-400',
    gradient: 'from-pink-400 to-pink-600 dark:from-pink-400 dark:to-pink-500',
    glow: 'shadow-lg shadow-pink-500/30',
  },
  slate: {
    bar: 'bg-linear-to-r from-slate-400 to-slate-600 dark:from-slate-500 dark:to-slate-400',
    text: 'text-slate-600 dark:text-slate-400',
    gradient: 'from-slate-400 to-slate-600 dark:from-slate-500 dark:to-slate-400',
    glow: 'shadow-lg shadow-slate-500/20',
  },
}
