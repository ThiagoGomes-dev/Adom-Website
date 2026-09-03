import { useState, type FormEvent } from 'react';
import { Mail, Phone, MessageCircle, Send } from 'lucide-react';
import { useCompanyConfig } from '@/context/CompanyConfigContext';
import { generateWhatsAppLink } from '@/lib/whatsapp';
import { SEO } from '@/components/layout/SEO';
import { Section, SectionHeading } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { Location } from '@/components/sections/Location';

export function ContactPage() {
  const config = useCompanyConfig();
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const text = [
      `Olá! Meu nome é ${name || '(não informado)'}.`,
      '',
      message || 'Gostaria de mais informações.',
    ].join('\n');
    const link = generateWhatsAppLink(config.whatsapp, text);
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <SEO title="Contato" description={`Fale com a ${config.businessName} pelo WhatsApp, e-mail ou telefone.`} />

      <Section>
        <SectionHeading eyebrow="Fale com a gente" title="Contato" description="Prefira o canal que for mais rápido para você." />

        <div className="mx-auto mt-12 grid max-w-4xl gap-6 sm:grid-cols-3">
          <a
            href={generateWhatsAppLink(config.whatsapp, `Olá, ${config.businessName}! Vim pelo site.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-2 rounded-2xl border border-black/5 bg-surface p-6 text-center shadow-soft transition-shadow hover:shadow-card"
          >
            <span className="rounded-full bg-whatsapp/10 p-3 text-whatsapp">
              <MessageCircle size={22} />
            </span>
            <span className="text-sm font-semibold text-ink">WhatsApp</span>
            <span className="text-xs text-ink-soft">{config.whatsappDisplay ?? config.whatsapp}</span>
          </a>

          {config.phone && (
            <a
              href={`tel:${config.phone.replace(/\D/g, '')}`}
              className="flex flex-col items-center gap-2 rounded-2xl border border-black/5 bg-surface p-6 text-center shadow-soft transition-shadow hover:shadow-card"
            >
              <span className="rounded-full bg-accent/10 p-3 text-accent">
                <Phone size={22} />
              </span>
              <span className="text-sm font-semibold text-ink">Telefone</span>
              <span className="text-xs text-ink-soft">{config.phone}</span>
            </a>
          )}

          {config.email && (
            <a
              href={`mailto:${config.email}`}
              className="flex flex-col items-center gap-2 rounded-2xl border border-black/5 bg-surface p-6 text-center shadow-soft transition-shadow hover:shadow-card"
            >
              <span className="rounded-full bg-accent/10 p-3 text-accent">
                <Mail size={22} />
              </span>
              <span className="text-sm font-semibold text-ink">E-mail</span>
              <span className="text-xs text-ink-soft break-all">{config.email}</span>
            </a>
          )}
        </div>

        <form onSubmit={handleSubmit} className="mx-auto mt-14 max-w-xl rounded-2xl border border-black/5 bg-surface p-6 shadow-soft sm:p-8">
          <h3 className="font-display text-lg font-bold text-ink">Prefere escrever primeiro?</h3>
          <p className="mt-1 text-sm text-ink-soft">
            Preencha abaixo e enviaremos sua mensagem pronta direto para o nosso WhatsApp.
          </p>

          <div className="mt-6 space-y-4">
            <div>
              <label htmlFor="name" className="text-sm font-medium text-ink">
                Nome
              </label>
              <input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                placeholder="Seu nome"
                className="mt-1.5 w-full rounded-xl border border-black/10 px-4 py-3 text-sm text-ink placeholder:text-ink-soft/70 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
              />
            </div>
            <div>
              <label htmlFor="message" className="text-sm font-medium text-ink">
                Mensagem
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                placeholder="Como podemos ajudar?"
                className="mt-1.5 w-full resize-none rounded-xl border border-black/10 px-4 py-3 text-sm text-ink placeholder:text-ink-soft/70 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
              />
            </div>
            <Button type="submit" variant="whatsapp" size="lg" fullWidth icon={<Send size={16} />}>
              Enviar pelo WhatsApp
            </Button>
          </div>
        </form>
      </Section>

      <Location />
    </>
  );
}
