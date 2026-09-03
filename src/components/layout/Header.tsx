import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCompanyConfig } from '@/context/CompanyConfigContext';
import { buildNavItems } from '@/config/navigation';
import { Container } from '@/components/ui/Container';
import { CartButton } from '@/components/cart/CartButton';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { MobileMenu } from './MobileMenu';
import { cn } from '@/lib/cn';

export function Header() {
  const config = useCompanyConfig();
  const navItems = buildNavItems(config);
  const [mobileOpen, setMobileOpen] = useState(false);
  const showCart = config.features.showCatalog && config.pages.products;

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="sticky top-0 z-40 w-full border-b border-white/10 bg-black"
    >
      <Container className="flex h-16 items-center justify-between gap-4 sm:h-20">
        <Link to="/" className="flex items-center gap-2.5 shrink-0" aria-label={`${config.businessName} — início`}>
          <motion.span whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="inline-flex items-center">
            {config.logo ? (
              <>
                {config.logoIcon && (
                  <img src={config.logoIcon} alt={config.businessName} className="h-7 w-auto sm:hidden" />
                )}
                <img
                  src={config.logo}
                  alt={config.businessName}
                  className={cn('h-8 w-auto sm:h-9', config.logoIcon && 'hidden sm:block')}
                />
              </>
            ) : (
              <span className="font-display text-lg font-bold uppercase tracking-[0.15em] text-white sm:text-xl">
                {config.businessName}
              </span>
            )}
          </motion.span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Navegação principal">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.href === '/'}
              className={({ isActive }) =>
                cn(
                  'text-xs font-semibold uppercase tracking-[0.18em] transition-colors',
                  isActive ? 'text-white' : 'text-white/55 hover:text-white',
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          {showCart && (
            <Link
              to="/produtos"
              aria-label="Buscar produtos"
              className="hidden rounded-full p-2.5 text-white/70 transition-colors hover:bg-white/10 hover:text-white sm:inline-flex"
            >
              <Search size={18} />
            </Link>
          )}

          {showCart && <CartButton className="text-white hover:bg-white/10" />}

          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="ml-1 inline-flex items-center justify-center rounded-full p-2.5 text-white hover:bg-white/10 lg:hidden"
            aria-label="Abrir menu"
            aria-expanded={mobileOpen}
          >
            <Menu size={22} />
          </button>
        </div>
      </Container>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} navItems={navItems} />
      {showCart && <CartDrawer />}
    </motion.header>
  );
}
