import { useState } from 'react'
import { Input } from '../ui/Input'
import { RadioCardGroup } from '../ui/RadioCardGroup'
import { Button } from '../ui/Button'
import { GENDERS } from '../../constants/genders'
import { ACTIVITY_LEVELS } from '../../constants/activityLevels'
import { GOALS } from '../../constants/goals'
import { resolveIcon } from '../../utils/iconMap'

const GOAL_OPTIONS = GOALS.map((goal) => ({ ...goal, icon: resolveIcon(goal.icon) }))

// Reuses the exact same Input/RadioCardGroup fields as onboarding — editing is just onboarding
// pre-filled with the existing profile.
export function ProfileForm({ profile, onSave, saving }) {
  const [form, setForm] = useState({
    heightCm: profile.heightCm,
    weightKg: profile.weightKg,
    age: profile.age,
    gender: profile.gender,
    activityLevel: profile.activityLevel,
    goal: profile.goal,
  })

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    onSave({
      heightCm: Number(form.heightCm),
      weightKg: Number(form.weightKg),
      age: Number(form.age),
      gender: form.gender,
      activityLevel: form.activityLevel,
      goal: form.goal,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <Input label="Height (cm)" type="number" value={form.heightCm} onChange={(event) => update('heightCm', event.target.value)} />
        <Input label="Weight (kg)" type="number" value={form.weightKg} onChange={(event) => update('weightKg', event.target.value)} />
      </div>

      <Input label="Age" type="number" value={form.age} onChange={(event) => update('age', event.target.value)} />

      <div>
        <p className="mb-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">Gender</p>
        <RadioCardGroup options={GENDERS} value={form.gender} onChange={(value) => update('gender', value)} columns={3} />
      </div>

      <div>
        <p className="mb-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">Activity level</p>
        <RadioCardGroup
          options={ACTIVITY_LEVELS}
          value={form.activityLevel}
          onChange={(value) => update('activityLevel', value)}
          columns={1}
        />
      </div>

      <div>
        <p className="mb-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">Goal</p>
        <RadioCardGroup options={GOAL_OPTIONS} value={form.goal} onChange={(value) => update('goal', value)} columns={1} />
      </div>

      <Button type="submit" fullWidth size="lg" loading={saving}>
        Save changes
      </Button>
    </form>
  )
}
