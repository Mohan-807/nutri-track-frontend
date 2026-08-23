import ReactMarkdown from 'react-markdown'

// Assistant replies are natural-language markdown (the LLM writes "**65 kcal**", "### Logged
// Entry Details", bullet lists, etc. — see chat_prompts.py's SYSTEM_INSTRUCTION), so it needs
// real rendering, not a plain <p>. react-markdown renders to actual React elements (never
// dangerouslySetInnerHTML), so this stays safe against whatever text a model — or a user's own
// injected instructions — produces. User messages are intentionally NOT rendered through this:
// they're plain text exactly as typed, both because there's no reason to interpret markdown
// syntax someone typed as a chat message, and to keep the security boundary narrow (the LLM's
// own output is the only thing this component ever sees).
const COMPONENTS = {
  p: ({ children }) => <p className="whitespace-pre-wrap [&:not(:first-child)]:mt-2">{children}</p>,
  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  ul: ({ children }) => <ul className="mt-2 list-disc space-y-1 pl-5 first:mt-0">{children}</ul>,
  ol: ({ children }) => <ol className="mt-2 list-decimal space-y-1 pl-5 first:mt-0">{children}</ol>,
  li: ({ children }) => <li>{children}</li>,
  h1: ({ children }) => <p className="mt-2 text-base font-semibold first:mt-0">{children}</p>,
  h2: ({ children }) => <p className="mt-2 text-base font-semibold first:mt-0">{children}</p>,
  h3: ({ children }) => <p className="mt-2 text-sm font-semibold first:mt-0">{children}</p>,
  a: ({ children, href }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
      {children}
    </a>
  ),
  code: ({ children }) => (
    <code className="rounded bg-black/5 px-1 py-0.5 font-mono text-[0.85em] dark:bg-white/10">{children}</code>
  ),
  hr: () => <hr className="my-2 border-slate-200 dark:border-slate-700" />,
}

export function MarkdownContent({ content }) {
  return (
    <div className="text-sm leading-relaxed">
      <ReactMarkdown components={COMPONENTS}>{content}</ReactMarkdown>
    </div>
  )
}
