function RelatedContentSection({ block, items }: { block: any; items: any[] }) {
  const cols = Math.max(1, Math.min(6, block.columns ?? 4))
  return (
    <section className="my-10">
      {block.heading && <h2 className="text-2xl font-semibold">{block.heading}</h2>}
      {block.description && <p className="text-muted-foreground">{block.description}</p>}
      <div className={`mt-6 grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-${cols}`}>
        {items.map((p: any) => (
          <RelatedCard key={p.id} post={p} />
        ))}
      </div>
    </section>
  )
}
