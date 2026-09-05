import { CompanyConfigProvider } from '@/context/CompanyConfigContext';
import { CatalogProvider } from '@/context/CatalogContext';
import { CartProvider } from '@/context/CartContext';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { WhatsAppFloatingButton } from '@/components/layout/WhatsAppFloatingButton';
import { ScrollToTop } from '@/components/layout/ScrollToTop';
import { AppRoutes } from '@/routes/AppRoutes';

export default function App() {
  return (
    <CompanyConfigProvider>
      <CatalogProvider>
        <CartProvider>
          <ScrollToTop />
          <div className="flex min-h-dvh flex-col">
            <Header />
            <main className="flex-1">
              <AppRoutes />
            </main>
            <Footer />
          </div>
          <WhatsAppFloatingButton />
        </CartProvider>
      </CatalogProvider>
    </CompanyConfigProvider>
  );
}
