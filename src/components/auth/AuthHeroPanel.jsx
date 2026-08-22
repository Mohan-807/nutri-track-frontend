import { Salad } from 'lucide-react'

// Desktop-only decorative panel shared by Signup/Login — a slow-drifting gradient plus two
// blurred color blobs for depth, instead of the flat single-color panel used before.
export function AuthHeroPanel({ title, description }) {
  return (
    <div className="animate-gradient-drift relative hidden flex-1 flex-col items-start justify-center overflow-hidden bg-linear-to-br from-accent-500 via-accent-600 to-accent-800 p-12 text-white lg:flex">
      <div aria-hidden="true" className="absolute -top-24 -left-24 size-72 rounded-full bg-white/10 blur-3xl" />
      <div aria-hidden="true" className="absolute -right-16 -bottom-32 size-96 rounded-full bg-accent-300/25 blur-3xl" />
      <span className="relative mb-6 flex size-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
        <Salad className="size-6" />
      </span>
      <h2 className="relative text-3xl font-semibold leading-tight text-balance">{title}</h2>
      <p className="relative mt-4 max-w-sm text-accent-50/90">{description}</p>
    </div>
  )
}
