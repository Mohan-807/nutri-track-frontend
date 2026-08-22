import { Search } from 'lucide-react'
import { Input } from '../ui/Input'

// Plain live-filter box — the food table below re-filters on every keystroke, so there's no
// separate submit step (browsing your own local data doesn't need to simulate a network search).
export function FoodSearchForm({ value, onChange }) {
  return (
    <Input
      leadingIcon={Search}
      placeholder="Search foods…"
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  )
}
