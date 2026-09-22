import { Link } from 'react-router-dom';
import { Instagram, Facebook, Phone, MapPin, Clock } from 'lucide-react';
import { useCompanyConfig } from '@/context/CompanyConfigContext';
import { buildNavItems } from '@/config/navigation';
import { Container } from '@/components/ui/Container';

export function Footer() {
  const config = useCompanyConfig();
  const navItems = buildNavItems(config);
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-black/5 bg-ink text-white">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4 lg:py-16">
        <div className="space-y-3 sm:col-span-2 lg:col-span-1">
          <span className="font-display text-xl font-bold">{config.businessName}</span>
          {config.tagline && <p className="text-sm text-white/60">{config.tagline}</p>}
          {(config.social.instagram || config.social.facebook) && (
            <div className="flex items-center gap-3 pt-2">
              {config.social.instagram && (
                <a
                  href={config.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-white/10 p-2.5 text-white transition-colors hover:bg-white/20"
                  aria-label="Instagram"
                >
                  <Instagram size={18} />
                </a>
              )}
              {config.social.facebook && (
                <a
                  href={config.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-white/10 p-2.5 text-white transition-colors hover:bg-white/20"
                  aria-label="Facebook"
                >
                  <Facebook size={18} />
                </a>
              )}
            </div>
          )}
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white/50">Navegação</h3>
          <ul className="mt-4 space-y-2.5">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link to={item.href} className="text-sm text-white/80 transition-colors hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white/50">Contato</h3>
          <ul className="mt-4 space-y-3">
            {config.phone && (
              <li className="flex items-start gap-2.5 text-sm text-white/80">
                <Phone size={16} className="mt-0.5 shrink-0 text-white/50" />
                <span>{config.phone}</span>
              </li>
            )}
            {config.features.showAddress && config.address && (
              <li className="flex items-start gap-2.5 text-sm text-white/80">
                <MapPin size={16} className="mt-0.5 shrink-0 text-white/50" />
                <span>
                  {config.address.street}
                  {config.address.neighborhood ? `, ${config.address.neighborhood}` : ''} — {config.address.city}/
                  {config.address.state}
                </span>
              </li>
            )}
          </ul>
        </div>

        {config.hours && config.hours.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/50">Horário</h3>
            <ul className="mt-4 space-y-2.5">
              {config.hours.map((h) => (
                <li key={h.day} className="flex items-start gap-2.5 text-sm text-white/80">
                  <Clock size={16} className="mt-0.5 shrink-0 text-white/50" />
                  <span>
                    {h.day}: {h.hours}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Container>

      <div className="border-t border-white/10 py-6">
        <Container className="flex flex-col items-center justify-between gap-2 text-xs text-white/50 sm:flex-row">
          <p>
            © {year} {config.businessName}. Todos os direitos reservados.
          </p>
          <p>Site desenvolvido com a plataforma de sites para pequenos negócios.</p>
        </Container>
      </div>
    </footer>
  );
}
