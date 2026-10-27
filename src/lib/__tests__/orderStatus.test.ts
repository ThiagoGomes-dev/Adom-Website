import { describe, expect, it } from 'vitest';
import type { PublicOrder } from '../api';
import { buildTimeline, stageCopy } from '../orderStatus';
import { parseLastOrder } from '../lastOrder';

function order(patch: Partial<PublicOrder> = {}): PublicOrder {
  return {
    id: '7f3a2c1d-0000-4000-8000-000000000001',
    code: '7F3A2C1D',
    stage: 'pending',
    deliveryMethod: 'delivery',
    customerFirstName: 'Maria',
    items: [],
    subtotal: 200,
    shippingCost: 25,
    total: 225,
    trackingCode: null,
    createdAt: '2026-10-27T10:00:00Z',
    confirmedAt: null,
    readyAt: null,
    shippedAt: null,
    cancelledAt: null,
    ...patch,
  };
}

describe('buildTimeline', () => {
  it('entrega: feito, pago, enviado', () => {
    const steps = buildTimeline(order({ stage: 'toShip', confirmedAt: 'x' }));
    expect(steps.map((s) => s.label)).toEqual(['Pedido feito', 'Pagamento confirmado', 'Enviado']);
    expect(steps.map((s) => s.done)).toEqual([true, true, false]);
  });

  it('retirada: inclui pronto para retirada e retirado', () => {
    const steps = buildTimeline(order({ deliveryMethod: 'pickup', stage: 'ready', confirmedAt: 'x', readyAt: 'y' }));
    expect(steps.map((s) => s.label)).toEqual(['Pedido feito', 'Pagamento confirmado', 'Pronto para retirada', 'Retirado']);
    expect(steps.map((s) => s.done)).toEqual([true, true, true, false]);
  });

  it('cancelado mostra só o que aconteceu', () => {
    const steps = buildTimeline(order({ stage: 'cancelled', cancelledAt: 'z' }));
    expect(steps.map((s) => s.label)).toEqual(['Pedido feito', 'Pedido não concluído']);
  });
});

describe('stageCopy', () => {
  it('enviado com rastreio aponta para o código', () => {
    expect(stageCopy(order({ stage: 'shipped', trackingCode: 'AA1BR' })).message).toContain('código de rastreio abaixo');
  });

  it('retirado na loja', () => {
    expect(stageCopy(order({ stage: 'shipped', deliveryMethod: 'pickup' })).title).toBe('Pedido retirado');
  });
});

describe('parseLastOrder', () => {
  it('ignora valor inválido', () => {
    expect(parseLastOrder(null)).toBeNull();
    expect(parseLastOrder('{')).toBeNull();
    expect(parseLastOrder('{"id":1}')).toBeNull();
  });

  it('lê o pedido salvo', () => {
    expect(parseLastOrder('{"id":"abc","items":[],"createdAt":"t"}')).toEqual({ id: 'abc', items: [], createdAt: 't' });
  });
});
