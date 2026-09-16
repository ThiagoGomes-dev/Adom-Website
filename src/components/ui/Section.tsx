import type { ReactNode } from 'react';
import { Container } from './Container';
import { Reveal } from '@/components/motion/reveal';
import { cn } from '@/lib/cn';

interface SectionProps {
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  id?: string;
  /** Alterna o fundo para diferenciar seções empilhadas visualmente. */
  tone?: 'surface' | 'alt';
}

/** Wrapper padrão de seção: espaçamento vertical consistente + container. */
export function Section({ children, className, containerClassName, id, tone = 'surface' }: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        'scroll-mt-20 py-7 sm:py-10 lg:py-14',
        tone === 'alt' ? 'bg-surface-alt' : 'bg-surface',
        className,
      )}
    >
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  className?: string;
}

/** Cabeçalho padrão (selo + título + descrição) reutilizado por todas as seções. */
export function SectionHeading({ eyebrow, title, description, align = 'center', className }: SectionHeadingProps) {
  return (
    <div className={cn('max-w-2xl', align === 'center' ? 'mx-auto text-center' : 'text-left', className)}>
      {eyebrow && (
        <Reveal effect="up" duration={0.5}>
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-accent">{eyebrow}</span>
        </Reveal>
      )}
      <Reveal effect="up" duration={0.6} delay={eyebrow ? 0.08 : 0}>
        <h2 className="mt-3 text-balance font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          {title}
        </h2>
      </Reveal>
      {description && (
        <Reveal effect="up" duration={0.6} delay={eyebrow ? 0.16 : 0.08}>
          <p className="mt-4 text-balance text-base leading-relaxed text-ink-soft sm:text-lg">{description}</p>
        </Reveal>
      )}
    </div>
  );
}
