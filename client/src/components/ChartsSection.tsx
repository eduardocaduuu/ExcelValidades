import { useEffect, useRef } from 'react';
import { Download } from 'lucide-react';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { DashboardStats } from '@shared/schema';
import { createStatusChartData, createBrandChartData, pieChartOptions, chartOptions } from '@/lib/chartUtils';
import { Button } from '@/components/ui/button';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface ChartsSectionProps {
  stats: DashboardStats | undefined;
  isLoading: boolean;
}

export default function ChartsSection({ stats, isLoading }: ChartsSectionProps) {
  if (isLoading) {
    return (
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {[1, 2].map((i) => (
          <div key={i} className="bg-card p-8 neo-border neo-shadow-lg animate-pulse">
            <div className="h-6 bg-muted rounded mb-6"></div>
            <div className="h-80 bg-muted rounded"></div>
          </div>
        ))}
      </section>
    );
  }

  if (!stats) {
    return (
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="col-span-full bg-card p-8 neo-border neo-shadow-lg text-center">
          <p className="text-xl font-bold text-muted-foreground">
            Carregue uma planilha para visualizar os gráficos
          </p>
        </div>
      </section>
    );
  }

  const statusChartData = createStatusChartData(stats);
  const brandChartData = createBrandChartData(stats.topBrands);

  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      
      {/* Status Distribution Chart */}
      <div className="bg-card p-8 neo-border neo-shadow-lg hover-lift animate-slide-up" data-testid="chart-status-distribution">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-black text-foreground">STATUS DAS VALIDADES</h3>
          <Button 
            variant="outline" 
            size="sm" 
            className="neo-border hover-lift neo-button"
            data-testid="button-export-status-chart"
          >
            <Download className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="relative h-80">
          <Doughnut data={statusChartData} options={pieChartOptions} />
        </div>
        
        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-destructive text-destructive-foreground neo-border" data-testid="status-red-summary">
            <p className="font-black text-lg">{stats.statusCounts.vermelho}</p>
            <p className="font-bold text-sm">VERMELHO</p>
          </div>
          <div className="p-3 bg-accent text-accent-foreground neo-border" data-testid="status-yellow-summary">
            <p className="font-black text-lg">{stats.statusCounts.amarelo}</p>
            <p className="font-bold text-sm">AMARELO</p>
          </div>
          <div className="p-3 neo-border" style={{ backgroundColor: '#16A34A', color: 'white' }} data-testid="status-green-summary">
            <p className="font-black text-lg">{stats.statusCounts.verde}</p>
            <p className="font-bold text-sm">VERDE</p>
          </div>
        </div>
      </div>

      {/* Top Products by Stock */}
      <div className="bg-card p-8 neo-border neo-shadow-lg hover-lift animate-slide-up" data-testid="chart-top-products">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-black text-foreground">TOP PRODUTOS EM ESTOQUE</h3>
          <Button 
            variant="outline" 
            size="sm" 
            className="neo-border hover-lift neo-button"
            data-testid="button-export-products-chart"
          >
            <Download className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="space-y-4">
          {stats.topProductsByStock.slice(0, 5).map((product, index) => (
            <div 
              key={`${product.nome}-${index}`}
              className="flex justify-between items-center p-4 bg-muted neo-border hover:bg-accent hover:text-accent-foreground transition-colors"
              data-testid={`product-item-${index}`}
            >
              <div>
                <p className="font-black text-lg" data-testid={`product-name-${index}`}>{product.nome}</p>
                <p className="font-semibold text-sm text-muted-foreground" data-testid={`product-brand-${index}`}>{product.marca}</p>
              </div>
              <div className="text-right">
                <p className="font-black text-2xl text-primary" data-testid={`product-quantity-${index}`}>
                  {product.quantidade.toLocaleString('pt-BR')}
                </p>
                <p className="font-bold text-xs uppercase">Unidades</p>
              </div>
            </div>
          ))}
          
          {stats.topProductsByStock.length === 0 && (
            <div className="text-center p-8 text-muted-foreground">
              <p className="font-bold">Nenhum produto encontrado</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
