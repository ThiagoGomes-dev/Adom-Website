import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useCompanyConfig } from '@/context/CompanyConfigContext';
import { faq as demoFaq } from '@/data/demo/faq';
import { Section, SectionHeading } from '@/components/ui/Section';
import { Reveal } from '@/components/motion/reveal';
import { cn } from '@/lib/cn';

export function FAQ() {
  const config = useCompanyConfig();
  const [openId, setOpenId] = useState<string | null>(demoFaq[0]?.id ?? null);

  if (!config.features.showFAQ || !demoFaq.length) return null;

  return (
    <Section id="faq">
      <SectionHeading eyebrow="Dúvidas" title="Perguntas frequentes" align="center" />
      <Reveal effect="blur" className="mx-auto mt-10 max-w-3xl divide-y divide-black/5 rounded-2xl border border-black/5 bg-surface shadow-soft">
        {demoFaq.map((item) => {
          const open = openId === item.id;
          return (
            <div key={item.id}>
              <button
                type="button"
                onClick={() => setOpenId(open ? null : item.id)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-6 sm:py-5"
                aria-expanded={open}
              >
                <span className="text-sm font-semibold text-ink sm:text-base">{item.question}</span>
                <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.3 }} className="shrink-0 text-ink-soft">
                  <ChevronDown size={18} />
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {open && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <p className={cn('px-5 pb-5 text-sm leading-relaxed text-ink-soft sm:px-6')}>{item.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </Reveal>
    </Section>
  );
}
