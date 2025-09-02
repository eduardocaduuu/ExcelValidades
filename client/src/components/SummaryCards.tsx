import { Package, AlertTriangle, ShoppingCart, Warehouse } from 'lucide-react';
import { DashboardStats } from '@shared/schema';

interface SummaryCardsProps {
  stats: DashboardStats | undefined;
  isLoading: boolean;
}

export default function SummaryCards({ stats, isLoading }: SummaryCardsProps) {
  if (isLoading) {
    return (
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-up">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-muted p-6 neo-border animate-pulse">
            <div className="h-20 bg-border rounded"></div>
          </div>
        ))}
      </section>
    );
  }

  if (!stats) {
    return (
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-up">
        <div className="col-span-full bg-muted p-8 neo-border text-center">
          <p className="text-xl font-bold text-muted-foreground">
            Nenhum dado disponível. Faça upload de uma planilha para visualizar as estatísticas.
          </p>
        </div>
      </section>
    );
  }

  const cards = [
    {
      title: "Total Produtos",
      value: stats.totalProducts.toLocaleString('pt-BR'),
      icon: Package,
      bgColor: "bg-accent",
      textColor: "text-accent-foreground",
      delay: "0.1s",
      testId: "card-total-products"
    },
    {
      title: "Vencidos",
      value: stats.expiredProducts.toLocaleString('pt-BR'),
      icon: AlertTriangle,
      bgColor: "bg-destructive",
      textColor: "text-destructive-foreground",
      delay: "0.2s",
      testId: "card-expired-products"
    },
    {
      title: "Avariados",
      value: stats.damagedProducts.toLocaleString('pt-BR'),
      icon: ShoppingCart,
      bgColor: "bg-secondary",
      textColor: "text-secondary-foreground",
      delay: "0.3s",
      testId: "card-damaged-products"
    },
    {
      title: "Em Estoque",
      value: stats.totalStock.toLocaleString('pt-BR'),
      icon: Warehouse,
      bgColor: "bg-primary",
      textColor: "text-primary-foreground",
      delay: "0.4s",
      testId: "card-total-stock"
    }
  ];

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-up">
      {cards.map((card) => (
        <div 
          key={card.title}
          className={`${card.bgColor} p-6 neo-border neo-shadow hover-lift animate-bounce-in`}
          style={{ animationDelay: card.delay }}
          data-testid={card.testId}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-bold ${card.textColor} uppercase tracking-wide`}>
                {card.title}
              </p>
              <p className={`text-4xl font-black ${card.textColor}`} data-testid={`text-${card.testId}-value`}>
                {card.value}
              </p>
            </div>
            <card.icon className={`w-8 h-8 ${card.textColor}`} />
          </div>
        </div>
      ))}
    </section>
  );
}
