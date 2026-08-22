import { useState } from 'react'
import { Sheet } from '../ui/Sheet'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'

const EMPTY_FORM = {
  name: '',
  servingLabel: '',
  calories: '',
  proteinG: '',
  carbsG: '',
  fatG: '',
  fiberG: '',
  sugarG: '',
  sodiumMg: '',
}

// Manual equivalent of what a future AI would do automatically: create a new food record with
// its own nutrients, hand it back to the caller (AddFoodPage), which drops straight into the
// existing quantity/add-to-log flow — same as picking any row from the table.
export function AddCustomFoodDialog({ isOpen, onClose, onCreate }) {
  const [form, setForm] = useState(EMPTY_FORM)

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function handleClose() {
    setForm(EMPTY_FORM)
    onClose()
  }

  function handleSubmit(event) {
    event.preventDefault()
    onCreate(form)
    setForm(EMPTY_FORM)
  }

  const canSubmit = form.name.trim() && form.servingLabel.trim() && form.calories !== ''

  return (
    <Sheet isOpen={isOpen} onClose={handleClose} title="Add a new food">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Food name"
          placeholder="e.g. Homemade granola"
          value={form.name}
          onChange={(event) => update('name', event.target.value)}
          autoFocus
        />
        <Input
          label="Serving"
          placeholder="e.g. 1 cup (150g)"
          value={form.servingLabel}
          onChange={(event) => update('servingLabel', event.target.value)}
        />
        <Input
          label="Calories"
          type="number"
          inputMode="decimal"
          placeholder="e.g. 220"
          value={form.calories}
          onChange={(event) => update('calories', event.target.value)}
        />

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
            Nutrients (optional — defaults to 0)
          </p>
          <div className="grid grid-cols-3 gap-3">
            <Input label="Protein (g)" type="number" inputMode="decimal" value={form.proteinG} onChange={(e) => update('proteinG', e.target.value)} />
            <Input label="Carbs (g)" type="number" inputMode="decimal" value={form.carbsG} onChange={(e) => update('carbsG', e.target.value)} />
            <Input label="Fat (g)" type="number" inputMode="decimal" value={form.fatG} onChange={(e) => update('fatG', e.target.value)} />
            <Input label="Fiber (g)" type="number" inputMode="decimal" value={form.fiberG} onChange={(e) => update('fiberG', e.target.value)} />
            <Input label="Sugar (g)" type="number" inputMode="decimal" value={form.sugarG} onChange={(e) => update('sugarG', e.target.value)} />
            <Input label="Sodium (mg)" type="number" inputMode="decimal" value={form.sodiumMg} onChange={(e) => update('sodiumMg', e.target.value)} />
          </div>
        </div>

        <Button type="submit" fullWidth size="lg" disabled={!canSubmit}>
          Add food
        </Button>
      </form>
    </Sheet>
  )
}
