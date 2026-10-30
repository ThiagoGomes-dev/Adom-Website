import { cn } from '@/lib/cn';

/** Cartão "fantasma" no formato do ProductCard, mostrado enquanto o catálogo carrega. */
export function ProductCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn('flex h-full animate-pulse flex-col overflow-hidden rounded-2xl border border-black/5 bg-surface shadow-soft', className)}
    >
      <div className="aspect-square bg-ink/10" />
      <div className="flex flex-col gap-2 p-4 sm:p-5">
        <div className="h-4 w-3/4 rounded bg-ink/10" />
        <div className="h-3 w-1/2 rounded bg-ink/10" />
        <div className="mt-2 h-5 w-1/3 rounded bg-ink/10" />
      </div>
    </div>
  );
}

/** Grade de cartões fantasmas, com aviso para leitores de tela. */
export function ProductGridSkeleton({ count, className }: { count: number; className: string }) {
  return (
    <div role="status" aria-label="Carregando produtos" className={className}>
      {Array.from({ length: count }, (_, i) => (
        <ProductCardSkeleton key={i} className={i >= 4 ? 'hidden md:flex' : undefined} />
      ))}
    </div>
  );
}
