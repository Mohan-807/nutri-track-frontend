import { ChevronLeft } from 'lucide-react'
import { Button } from '../ui/Button'
import { ProgressBar } from '../ui/ProgressBar'

// Full-screen takeover (no BottomNav/Sidebar) used by the 4-step onboarding wizard.
export function StepperWizardShell({
  currentStep,
  totalSteps,
  onNext,
  onBack,
  nextLabel = 'Next',
  nextDisabled = false,
  nextLoading = false,
  children,
}) {
  return (
    <div className="flex min-h-dvh flex-col">
      <div className="px-4 pt-safe pt-4 md:px-6">
        <div className="mx-auto flex w-full max-w-lg items-center gap-3">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={onBack}
              className="flex size-9 shrink-0 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              <ChevronLeft className="size-5" />
            </button>
          ) : (
            <div className="size-9 shrink-0" />
          )}
          <ProgressBar value={currentStep} max={totalSteps} size="sm" className="flex-1" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 md:px-6">
        <div className="mx-auto w-full max-w-lg">{children}</div>
      </div>

      <div className="sticky bottom-0 border-t border-slate-200 bg-white/95 px-4 py-4 pb-safe backdrop-blur-sm md:px-6 dark:border-slate-700 dark:bg-slate-900/95">
        <div className="mx-auto w-full max-w-lg">
          <Button fullWidth size="lg" onClick={onNext} disabled={nextDisabled} loading={nextLoading}>
            {nextLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}
