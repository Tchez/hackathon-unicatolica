interface ScreenPlaceholderProps {
  title: string
}

/** Tela vazia: as specs 002 a 006 substituem pelo conteúdo real. */
export function ScreenPlaceholder({ title }: ScreenPlaceholderProps) {
  return (
    <section className="px-4 py-6">
      <h1 className="text-xl font-semibold">{title}</h1>
      <p className="mt-2 text-muted">Em construção</p>
    </section>
  )
}
