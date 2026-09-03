import {
  Truck,
  ShieldCheck,
  MessageCircle,
  CreditCard,
  Sofa,
  Armchair,
  Table,
  Wand,
  LibraryBig,
  Lamp,
  Flower2,
  SquareStack,
  Star,
  Clock,
  MapPin,
  Sparkles,
  BadgePercent,
  Shirt,
  PocketKnife,
  Watch,
  Footprints,
  ShoppingBag,
  Circle,
  type LucideProps,
} from 'lucide-react';

/**
 * Registro central de ícones disponíveis por nome (string) — usado em
 * `companyConfig.benefits`, categorias e outros dados serializáveis, para
 * que o conteúdo (JSON/TS) não precise importar componentes React.
 * Ao personalizar para um novo cliente, adicione o ícone aqui se precisar.
 */
const registry = {
  Truck,
  ShieldCheck,
  MessageCircle,
  CreditCard,
  Sofa,
  Armchair,
  Table,
  Wand,
  LibraryBig,
  Lamp,
  Flower2,
  SquareStack,
  Star,
  Clock,
  MapPin,
  Sparkles,
  BadgePercent,
  Shirt,
  PocketKnife,
  Watch,
  Footprints,
  ShoppingBag,
};

export type IconName = keyof typeof registry;

interface DynamicIconProps extends LucideProps {
  name: string;
}

export function DynamicIcon({ name, ...props }: DynamicIconProps) {
  const Icon = registry[name as IconName] ?? Circle;
  return <Icon {...props} />;
}
