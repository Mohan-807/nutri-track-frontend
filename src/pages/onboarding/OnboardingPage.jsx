import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { StepperWizardShell } from '../../components/onboarding/StepperWizardShell'
import { Input } from '../../components/ui/Input'
import { RadioCardGroup } from '../../components/ui/RadioCardGroup'
import { GENDERS } from '../../constants/genders'
import { ACTIVITY_LEVELS } from '../../constants/activityLevels'
import { GOALS } from '../../constants/goals'
import { resolveIcon } from '../../utils/iconMap'
import { ApiError } from '../../services/apiClient'
import { useAuthStore } from '../../stores/authStore'
import { useProfileStore } from '../../stores/profileStore'

const TOTAL_STEPS = 4
const GOAL_OPTIONS = GOALS.map((goal) => ({ ...goal, icon: resolveIcon(goal.icon) }))

export function OnboardingPage() {
  const navigate = useNavigate()
  const userId = useAuthStore((state) => state.currentUserId)
  const completeOnboarding = useProfileStore((state) => state.completeOnboarding)

  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ heightCm: '', weightKg: '', age: '', gender: '', activityLevel: '', goal: '' })
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const stepValid = {
    1: Number(form.heightCm) > 0 && Number(form.weightKg) > 0,
    2: Number(form.age) > 0 && Boolean(form.gender),
    3: Boolean(form.activityLevel),
    4: Boolean(form.goal),
  }[step]

  async function handleNext() {
    if (step < TOTAL_STEPS) {
      setStep((current) => current + 1)
      return
    }

    setSubmitError('')
    setSubmitting(true)
    try {
      await completeOnboarding(userId, {
        heightCm: Number(form.heightCm),
        weightKg: Number(form.weightKg),
        age: Number(form.age),
        gender: form.gender,
        activityLevel: form.activityLevel,
        goal: form.goal,
      })
      navigate('/app/today', { replace: true })
    } catch (error) {
      setSubmitError(error instanceof ApiError ? error.message : 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  function handleBack() {
    setStep((current) => Math.max(1, current - 1))
  }

  return (
    <StepperWizardShell
      currentStep={step}
      totalSteps={TOTAL_STEPS}
      onNext={handleNext}
      onBack={handleBack}
      nextDisabled={!stepValid || submitting}
      nextLoading={submitting}
      nextLabel={step === TOTAL_STEPS ? 'Get Started' : 'Next'}
    >
      {submitError && (
        <p className="mb-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-600 dark:bg-rose-500/10 dark:text-rose-400">
          {submitError}
        </p>
      )}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: 0.2 }}
        >
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50">Your height &amp; weight</h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  We use this to calculate your BMI and daily targets.
                </p>
              </div>
              <Input
                label="Height (cm)"
                type="number"
                inputMode="decimal"
                placeholder="e.g. 172"
                value={form.heightCm}
                onChange={(event) => update('heightCm', event.target.value)}
              />
              <Input
                label="Weight (kg)"
                type="number"
                inputMode="decimal"
                placeholder="e.g. 68"
                value={form.weightKg}
                onChange={(event) => update('weightKg', event.target.value)}
              />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50">A bit about you</h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Age and sex refine your calorie formula.</p>
              </div>
              <Input
                label="Age"
                type="number"
                inputMode="numeric"
                placeholder="e.g. 27"
                value={form.age}
                onChange={(event) => update('age', event.target.value)}
              />
              <div>
                <p className="mb-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">Gender</p>
                <RadioCardGroup options={GENDERS} value={form.gender} onChange={(value) => update('gender', value)} columns={3} />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50">How active are you?</h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">This sets your total daily energy needs.</p>
              </div>
              <RadioCardGroup
                options={ACTIVITY_LEVELS}
                value={form.activityLevel}
                onChange={(value) => update('activityLevel', value)}
                columns={1}
              />
            </div>
          )}

          {step === 4 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50">What's your goal?</h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">We'll tailor your calorie and macro targets to it.</p>
              </div>
              <RadioCardGroup options={GOAL_OPTIONS} value={form.goal} onChange={(value) => update('goal', value)} columns={1} />
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </StepperWizardShell>
  )
}
