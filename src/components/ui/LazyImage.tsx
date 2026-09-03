import { useState, type ImgHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

interface LazyImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  /** Proporção usada para reservar espaço e evitar layout shift (CLS). */
  aspect?: 'square' | 'portrait' | 'landscape' | 'wide';
  containerClassName?: string;
}

const aspectClass: Record<NonNullable<LazyImageProps['aspect']>, string> = {
  square: 'aspect-square',
  portrait: 'aspect-[3/4]',
  landscape: 'aspect-[4/3]',
  wide: 'aspect-[16/9]',
};

/** Imagem com lazy loading nativo, placeholder de carregamento e fallback de erro. */
export function LazyImage({
  src,
  alt,
  aspect = 'square',
  className,
  containerClassName,
  loading = 'lazy',
  decoding = 'async',
  ...rest
}: LazyImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  return (
    <div className={cn('relative overflow-hidden bg-surface-alt', aspectClass[aspect], containerClassName)}>
      {!loaded && !errored && <div className="absolute inset-0 animate-pulse bg-ink/5" aria-hidden="true" />}
      {errored ? (
        <div className="absolute inset-0 flex items-center justify-center text-xs text-ink-soft">
          Imagem indisponível
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading={loading}
          decoding={decoding}
          onLoad={() => setLoaded(true)}
          onError={() => setErrored(true)}
          className={cn(
            'h-full w-full object-cover transition-opacity duration-500',
            loaded ? 'opacity-100' : 'opacity-0',
            className,
          )}
          {...rest}
        />
      )}
    </div>
  );
}
