import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { NavLink } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X, MessageCircle, Instagram, Facebook } from 'lucide-react';
import type { NavItem } from '@/types';
import { useCompanyConfig } from '@/context/CompanyConfigContext';
import { buildContactWhatsAppLink } from '@/lib/whatsapp';
import { useScrollLock } from '@/hooks/useScrollLock';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/cn';

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  navItems: NavItem[];
}

const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.12 } },
};

const itemVariants = {
  hidden: { opacity: 0, x: 24 },
  visible: { opacity: 1, x: 0 },
};

/** Drawer de navegação para telas pequenas — otimizado para toque. */
export function MobileMenu({ open, onClose, navItems }: MobileMenuProps) {
  const config = useCompanyConfig();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  useScrollLock(open);

  useEffect(() => {
    if (!open) return;
    closeButtonRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  const whatsappHref = buildContactWhatsAppLink(config.whatsapp, config.businessName);

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 340, damping: 36 }}
            className="absolute inset-y-0 right-0 flex w-[86%] max-w-sm flex-col bg-surface shadow-lift"
            role="dialog"
            aria-modal="true"
            aria-label="Menu de navegação"
          >
            <div className="flex items-center justify-between border-b border-black/5 px-5 py-4">
              <span className="font-display text-lg font-bold text-ink">{config.businessName}</span>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={onClose}
                className="rounded-full p-2 text-ink hover:bg-ink/5"
                aria-label="Fechar menu"
              >
                <X size={22} />
              </button>
            </div>

            <motion.nav
              initial="hidden"
              animate="visible"
              variants={listVariants}
              className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4"
              aria-label="Navegação principal"
            >
              {navItems.map((item) => (
                <motion.div key={item.href} variants={itemVariants}>
                  <NavLink
                    to={item.href}
                    end={item.href === '/'}
                    onClick={onClose}
                    className={({ isActive }) =>
                      cn(
                        'block rounded-xl px-4 py-3.5 text-base font-medium transition-colors',
                        isActive ? 'bg-ink/5 text-ink' : 'text-ink-soft hover:bg-ink/5 hover:text-ink',
                      )
                    }
                  >
                    {item.label}
                  </NavLink>
                </motion.div>
              ))}
            </motion.nav>

            <div className="space-y-3 border-t border-black/5 px-5 py-5">
              <Button href={whatsappHref} external variant="whatsapp" size="lg" fullWidth icon={<MessageCircle size={18} />}>
                Falar no WhatsApp
              </Button>
              {(config.social.instagram || config.social.facebook) && (
                <div className="flex items-center justify-center gap-4 pt-1">
                  {config.social.instagram && (
                    <a
                      href={config.social.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full p-2 text-ink-soft hover:bg-ink/5 hover:text-ink"
                      aria-label="Instagram"
                    >
                      <Instagram size={20} />
                    </a>
                  )}
                  {config.social.facebook && (
                    <a
                      href={config.social.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full p-2 text-ink-soft hover:bg-ink/5 hover:text-ink"
                      aria-label="Facebook"
                    >
                      <Facebook size={20} />
                    </a>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
