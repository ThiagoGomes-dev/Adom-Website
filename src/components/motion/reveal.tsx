import type { ReactNode } from 'react';
import { motion, type Variants } from 'framer-motion';

/**
 * Primitivas de animação por scroll. O objetivo é que cada seção da página
 * tenha uma "assinatura" de movimento diferente (sobe, desliza da lateral,
 * revela por clip-path, aumenta de escala...) em vez do mesmo fade-up
 * repetido em todo lugar — é isso que evita a cara de "template genérico".
 */

export type RevealEffect = 'up' | 'down' | 'left' | 'right' | 'scale' | 'clip' | 'blur' | 'fade';

export const EASE_EXPO = [0.16, 1, 0.3, 1] as const;

export const revealVariants: Record<RevealEffect, Variants> = {
  up: { hidden: { opacity: 0, y: 56 }, visible: { opacity: 1, y: 0 } },
  down: { hidden: { opacity: 0, y: -40 }, visible: { opacity: 1, y: 0 } },
  left: { hidden: { opacity: 0, x: -64 }, visible: { opacity: 1, x: 0 } },
  right: { hidden: { opacity: 0, x: 64 }, visible: { opacity: 1, x: 0 } },
  scale: { hidden: { opacity: 0, scale: 0.86 }, visible: { opacity: 1, scale: 1 } },
  clip: {
    hidden: { clipPath: 'inset(0 0 100% 0)', opacity: 1 },
    visible: { clipPath: 'inset(0 0 0% 0)', opacity: 1 },
  },
  blur: { hidden: { opacity: 0, filter: 'blur(14px)' }, visible: { opacity: 1, filter: 'blur(0px)' } },
  fade: { hidden: { opacity: 0 }, visible: { opacity: 1 } },
};

interface RevealProps {
  children: ReactNode;
  effect?: RevealEffect;
  delay?: number;
  duration?: number;
  className?: string;
  amount?: number;
  as?: 'div' | 'span';
}

/** Revela o conteúdo quando ele entra na viewport, uma única vez. */
export function Reveal({ children, effect = 'up', delay = 0, duration = 0.75, className, amount = 0.25, as = 'div' }: RevealProps) {
  const Component = motion[as];
  return (
    <Component
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      variants={revealVariants[effect]}
      transition={{ duration, delay, ease: EASE_EXPO }}
    >
      {children}
    </Component>
  );
}

interface StaggerProps {
  children: ReactNode;
  className?: string;
  amount?: number;
  staggerDelay?: number;
}

/** Container que dispara a animação escalonada dos `StaggerItem` filhos ao entrar na tela. */
export function Stagger({ children, className, amount = 0.15, staggerDelay = 0.09 }: StaggerProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: staggerDelay, delayChildren: 0.04 } } }}
    >
      {children}
    </motion.div>
  );
}

interface StaggerItemProps {
  children: ReactNode;
  effect?: RevealEffect;
  className?: string;
  duration?: number;
}

/** Item individual de um `<Stagger>` — herda o estado hidden/visible do pai. */
export function StaggerItem({ children, effect = 'up', className, duration = 0.6 }: StaggerItemProps) {
  return (
    <motion.div className={className} variants={revealVariants[effect]} transition={{ duration, ease: EASE_EXPO }}>
      {children}
    </motion.div>
  );
}
