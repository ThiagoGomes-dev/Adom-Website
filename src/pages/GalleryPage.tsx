import { SEO } from '@/components/layout/SEO';
import { Gallery } from '@/components/sections/Gallery';
import { CTASection } from '@/components/sections/CTASection';

export function GalleryPage() {
  return (
    <>
      <SEO title="Galeria" description="Confira fotos de ambientes e produtos." />
      <Gallery />
      <CTASection />
    </>
  );
}
