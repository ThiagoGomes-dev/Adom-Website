import { useEffect, useState } from 'react';
import { useDebounce } from './useDebounce';

interface CepResult {
  city: string | null;
  street: string | null;
  neighborhood: string | null;
  loading: boolean;
  notFound: boolean;
}

/** Busca o endereço correspondente a um CEP via ViaCEP (API pública, sem chave). */
export function useCepLookup(cep: string): CepResult {
  const digits = cep.replace(/\D/g, '');
  const debouncedDigits = useDebounce(digits, 500);
  const [city, setCity] = useState<string | null>(null);
  const [street, setStreet] = useState<string | null>(null);
  const [neighborhood, setNeighborhood] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (debouncedDigits.length !== 8) {
      setCity(null);
      setStreet(null);
      setNeighborhood(null);
      setNotFound(false);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setNotFound(false);

    fetch(`https://viacep.com.br/ws/${debouncedDigits}/json/`)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        if (data.erro) {
          setCity(null);
          setStreet(null);
          setNeighborhood(null);
          setNotFound(true);
        } else {
          setCity(data.localidade ?? null);
          setStreet(data.logradouro || null);
          setNeighborhood(data.bairro || null);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setCity(null);
          setStreet(null);
          setNeighborhood(null);
          setNotFound(true);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [debouncedDigits]);

  return { city, street, neighborhood, loading, notFound };
}

/** Formata dígitos de CEP no padrão "00000-000" conforme o usuário digita. */
export function formatCep(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

/** Compara nome de cidade ignorando acentuação/caixa (ex: "Campina Grande"). */
export function isSameCity(city: string | null, target: string): boolean {
  if (!city) return false;
  const norm = (s: string) =>
    s
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .trim();
  return norm(city) === norm(target);
}
