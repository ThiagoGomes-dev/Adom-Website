import { motion } from 'framer-motion';
import { useCompanyConfig } from '@/context/CompanyConfigContext';
import { Container } from '@/components/ui/Container';
import { EASE_EXPO } from '@/components/motion/reveal';
import { cn } from '@/lib/cn';

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};

const word = {
  hidden: { opacity: 0.1, y: 14, filter: 'blur(3px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.6, ease: EASE_EXPO } },
};

/** Compara a palavra (sem pontuação) com o nome da marca, para destacá-la. */
function isBrandWord(rawWord: string, businessName: string) {
  const clean = rawWord.replace(/[^\p{L}\p{N}]/gu, '').toLowerCase();
  return clean === businessName.toLowerCase();
}

/** Frase de destaque em tipografia grande — quebra o ritmo entre seções de conteúdo denso. */
export function HighlightQuote() {
  const config = useCompanyConfig();
  if (!config.highlightQuote) return null;

  const words = config.highlightQuote.split(' ');

  return (
    <section className="relative isolate overflow-hidden bg-ink py-24 sm:py-32">
      {/* Nome da marca gigante e esmaecido ao fundo, para dar profundidade editorial */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 -translate-y-1/2 select-none text-center font-display text-[22vw] font-extrabold leading-none tracking-tight text-white/[0.04] sm:text-[16vw]"
      >
        {config.businessName}
      </span>

      <Container className="max-w-4xl text-center">
        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={container}
          className="text-balance font-display text-3xl font-bold leading-snug tracking-tight text-white sm:text-4xl lg:text-5xl"
        >
          {words.map((w, i) => {
            const brand = isBrandWord(w, config.businessName);
            return (
              <motion.span
                key={i}
                variants={word}
                className={cn(
                  'mr-[0.3em] inline-block',
                  brand &&
                    'bg-[image:linear-gradient(110deg,rgb(var(--color-accent))_20%,#f6ecd9_45%,rgb(var(--color-accent))_70%)] bg-[length:250%_100%] bg-clip-text text-transparent animate-shine',
                )}
              >
                {w}
              </motion.span>
            );
          })}
        </motion.p>
        <motion.span
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3, ease: EASE_EXPO }}
          className="mx-auto mt-8 block h-1 w-16 origin-center rounded-full bg-accent"
        />
      </Container>
    </section>
  );
}
