import { describe, expect, it } from 'vitest';
import { generateWhatsAppLink } from '../whatsapp';

describe('generateWhatsAppLink', () => {
  it('limpa a máscara do telefone e codifica a mensagem', () => {
    expect(generateWhatsAppLink('+55 (83) 99999-8888', 'Olá, tudo bem?')).toBe(
      'https://wa.me/5583999998888?text=Ol%C3%A1%2C%20tudo%20bem%3F',
    );
  });

  it('sem mensagem não adiciona o parâmetro text', () => {
    expect(generateWhatsAppLink('5583999998888')).toBe('https://wa.me/5583999998888');
  });
});
