import { useEffect, type ReactNode } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2, Clock, XCircle } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { SEO } from '@/components/layout/SEO';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

/**
 * Páginas de retorno do Checkout Pro (Mercado Pago `back_urls`). Com o
 * número do pedido na URL (`?order=`), mandam direto pra página "Meu pedido",
 * que mostra o status real lido do painel. As telas fixas abaixo ficam só
 * como fallback pra um retorno sem o número. A confirmação de verdade
 * (baixar estoque definitivo / devolver em caso de recusa) acontece no
 * webhook, não aqui.
 */
function useOrderRedirect() {
  const [params] = useSearchParams();
  const orderId = params.get('order');
  return orderId ? <Navigate to={`/pedido/${encodeURIComponent(orderId)}`} replace /> : null;
}

function OrderStatusPage({
  title,
  seoTitle,
  message,
  icon,
  tone,
}: {
  title: string;
  seoTitle: string;
  message: ReactNode;
  icon: ReactNode;
  tone: 'success' | 'pending' | 'failure';
}) {
  const toneClasses: Record<typeof tone, string> = {
    success: 'bg-emerald-100 text-emerald-600',
    pending: 'bg-amber-100 text-amber-600',
    failure: 'bg-red-100 text-red-600',
  };

  return (
    <>
      <SEO title={seoTitle} />
      <Container className="flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
        <span className={`flex h-16 w-16 items-center justify-center rounded-full ${toneClasses[tone]}`}>{icon}</span>
        <h1 className="mt-5 font-display text-2xl font-bold text-ink sm:text-3xl">{title}</h1>
        <p className="mt-3 max-w-md text-sm text-ink-soft sm:text-base">{message}</p>
        <div className="mt-8">
          <Button to="/produtos">Continuar comprando</Button>
        </div>
      </Container>
    </>
  );
}

export function OrderSuccessPage() {
  const redirect = useOrderRedirect();
  const { clear } = useCart();

  // O carrinho já é esvaziado ao finalizar (CartDrawer.tsx); aqui é só uma
  // garantia pra quem finalizou numa versão antiga do site.
  useEffect(() => {
    clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (redirect) return redirect;
  return (
    <OrderStatusPage
      tone="success"
      icon={<CheckCircle2 size={32} />}
      seoTitle="Pagamento aprovado"
      title="Pagamento aprovado!"
      message={
        <>
          Recebemos seu pagamento e já estamos preparando seu pedido para envio ou retirada.
        </>
      }
    />
  );
}

export function OrderPendingPage() {
  const redirect = useOrderRedirect();
  if (redirect) return redirect;
  return (
    <OrderStatusPage
      tone="pending"
      icon={<Clock size={32} />}
      seoTitle="Pagamento em análise"
      title="Pagamento em análise"
      message="Seu pagamento ainda está sendo processado (comum em boleto ou Pix que demora a cair). Assim que for aprovado, já separamos seu pedido — você não precisa fazer nada."
    />
  );
}

export function OrderFailurePage() {
  const redirect = useOrderRedirect();
  if (redirect) return redirect;
  return (
    <OrderStatusPage
      tone="failure"
      icon={<XCircle size={32} />}
      seoTitle="Pagamento não aprovado"
      title="Pagamento não aprovado"
      message="Não foi possível concluir o pagamento. As peças reservadas para esse pedido voltam para o estoque automaticamente — você pode montar o pedido de novo e tentar outra forma de pagamento."
    />
  );
}
