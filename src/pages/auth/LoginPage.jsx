import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, Salad } from 'lucide-react'
import { useAuthStore } from '../../stores/authStore'
import { useProfileStore } from '../../stores/profileStore'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { AuthHeroPanel } from '../../components/auth/AuthHeroPanel'

export function LoginPage() {
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)
  const status = useAuthStore((state) => state.status)
  const error = useAuthStore((state) => state.error)
  const clearError = useAuthStore((state) => state.clearError)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    clearError()

    const result = await login({ email, password })
    if (result.success) {
      const onboardingComplete = useProfileStore.getState().profilesByUser[result.user.id]?.onboardingCompleted
      navigate(onboardingComplete ? '/app/today' : '/onboarding', { replace: true })
    }
  }

  return (
    <div className="flex min-h-dvh flex-col lg:flex-row">
      <AuthHeroPanel
        title="Welcome back. Let's see today's progress."
        description="Your goals, your meals, your coach — right where you left them."
      />

      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="w-full max-w-sm"
        >
          <div className="mb-8 text-center lg:text-left">
            <span className="mb-4 inline-flex size-12 items-center justify-center rounded-2xl bg-linear-to-br from-accent-500 to-accent-700 text-white shadow-lg shadow-accent-500/30 lg:hidden">
              <Salad className="size-6" />
            </span>
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">Welcome back</h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Log in to continue tracking.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              leadingIcon={Mail}
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              autoComplete="email"
            />
            <Input
              label="Password"
              type="password"
              leadingIcon={Lock}
              placeholder="Your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              autoComplete="current-password"
            />

            {error && (
              <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-600 dark:bg-rose-500/10 dark:text-rose-400">
                {error}
              </p>
            )}

            <Button type="submit" fullWidth size="lg" loading={status === 'loading'}>
              Log in
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
            Don't have an account?{' '}
            <Link to="/signup" className="font-medium text-accent-600 hover:underline dark:text-accent-400">
              Sign up
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
