import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useCompanyConfig } from '@/context/CompanyConfigContext';
import { HomePage } from '@/pages/HomePage';
import { ProductsPage } from '@/pages/ProductsPage';
import { ProductDetailPage } from '@/pages/ProductDetailPage';
import { ServicesPage } from '@/pages/ServicesPage';
import { AboutPage } from '@/pages/AboutPage';
import { ContactPage } from '@/pages/ContactPage';
import { GalleryPage } from '@/pages/GalleryPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

/**
 * Rotas da aplicação. Cada rota só é registrada se a página correspondente
 * estiver ativa em `companyConfig.pages` — é assim que um plano "básico"
 * (sem catálogo) simplesmente não expõe /produtos, por exemplo.
 *
 * A troca de rota é envolvida em `AnimatePresence` + uma `motion.div` com
 * `key={pathname}`: ao mudar de página, o React desmonta o bloco anterior
 * (que anima a saída) e monta o novo (que anima a entrada) — uma transição
 * de página real, não apenas um "corte seco".
 */
export function AppRoutes() {
  const config = useCompanyConfig();
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      >
        <Routes location={location}>
          <Route path="/" element={<HomePage />} />

          {config.pages.products && config.features.showCatalog && (
            <>
              <Route path="/produtos" element={<ProductsPage />} />
              <Route path="/produtos/:slug" element={<ProductDetailPage />} />
            </>
          )}

          {config.pages.services && config.features.showServices && (
            <Route path="/servicos" element={<ServicesPage />} />
          )}

          {config.pages.gallery && config.features.showGallery && (
            <Route path="/galeria" element={<GalleryPage />} />
          )}

          {config.pages.about && config.features.showAbout && <Route path="/sobre" element={<AboutPage />} />}

          {config.pages.contact && <Route path="/contato" element={<ContactPage />} />}

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}
