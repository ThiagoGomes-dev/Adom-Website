import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'whatsapp';
type Size = 'sm' | 'md' | 'lg';

const base =
  'inline-flex items-center justify-center gap-2 font-semibold uppercase tracking-[0.08em] transition-all duration-200 rounded-brand select-none active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none';

const variants: Record<Variant, string> = {
  primary: 'bg-brand text-white hover:bg-brand-dark shadow-soft hover:shadow-card',
  secondary: 'bg-surface-alt text-ink hover:bg-ink/10 border border-black/5',
  outline: 'border-2 border-brand text-brand hover:bg-brand hover:text-white',
  ghost: 'text-ink hover:bg-ink/5',
  whatsapp: 'bg-whatsapp text-white hover:bg-whatsapp-dark shadow-soft hover:shadow-card',
};

const sizes: Record<Size, string> = {
  sm: 'text-sm px-3.5 py-2',
  md: 'text-sm px-5 py-3',
  lg: 'text-base px-6 py-3.5',
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  className?: string;
  children: ReactNode;
  'aria-label'?: string;
}

interface AsButton extends CommonProps {
  href?: undefined;
  to?: undefined;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  disabled?: boolean;
}

interface AsAnchor extends CommonProps {
  href: string;
  to?: undefined;
  external?: boolean;
}

interface AsLink extends CommonProps {
  to: string;
  href?: undefined;
  onClick?: () => void;
}

type ButtonProps = AsButton | AsAnchor | AsLink;

/**
 * Botão único usado em toda a aplicação (CTA do hero, WhatsApp, formulários).
 * Renderiza como <button>, <a> externo ou <Link> interno dependendo das props.
 */
export function Button(props: ButtonProps) {
  const {
    variant = 'primary',
    size = 'md',
    icon,
    iconPosition = 'left',
    fullWidth,
    className,
    children,
    'aria-label': ariaLabel,
  } = props;

  const classes = cn(base, variants[variant], sizes[size], fullWidth && 'w-full', className);

  const content = (
    <>
      {icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
    </>
  );

  if ('to' in props && props.to) {
    const { onClick } = props as AsLink;
    return (
      <Link to={props.to} onClick={onClick} className={classes} aria-label={ariaLabel}>
        {content}
      </Link>
    );
  }

  if ('href' in props && props.href) {
    const { href, external } = props as AsAnchor;
    return (
      <a
        href={href}
        className={classes}
        aria-label={ariaLabel}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
      >
        {content}
      </a>
    );
  }

  const { type = 'button', onClick, disabled } = props as AsButton;
  return (
    <button type={type} onClick={onClick} disabled={disabled} aria-label={ariaLabel} className={classes}>
      {content}
    </button>
  );
}
