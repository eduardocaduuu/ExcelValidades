import { useEffect, useRef } from 'react';
import { Download } from 'lucide-react';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { DashboardStats } from '@shared/schema';
import { 
  createStatusChartData, 
  createBrandChartData, 
  createBrandStatusComparisonData,
  createBrandStockData,
  createBrandDamagedData,
  pieChartOptions, 
  chartOptions,
  barChartOptionsWithLegend
} from '@/lib/chartUtils';
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
  const brandStatusComparisonData = createBrandStatusComparisonData(stats.allBrandStats);
  const brandStockData = createBrandStockData(stats.allBrandStats);
  const brandDamagedData = createBrandDamagedData(stats.allBrandStats);

  return (
    <div className="space-y-8">
      {/* Original Charts Section */}
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

      {/* Enhanced Brand Analytics Section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Brand Status Comparison Chart */}
        <div className="bg-card p-8 neo-border neo-shadow-lg hover-lift animate-slide-up" data-testid="chart-brand-status-comparison">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-black text-foreground">COMPARAÇÃO DE STATUS POR MARCA</h3>
            <Button 
              variant="outline" 
              size="sm" 
              className="neo-border hover-lift neo-button"
              data-testid="button-export-brand-comparison"
            >
              <Download className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="relative h-80">
            <Bar data={brandStatusComparisonData} options={barChartOptionsWithLegend} />
          </div>
        </div>

        {/* Brand Stock Distribution */}
        <div className="bg-card p-8 neo-border neo-shadow-lg hover-lift animate-slide-up" data-testid="chart-brand-stock">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-black text-foreground">ESTOQUE POR MARCA</h3>
            <Button 
              variant="outline" 
              size="sm" 
              className="neo-border hover-lift neo-button"
              data-testid="button-export-brand-stock"
            >
              <Download className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="relative h-80">
            <Bar data={brandStockData} options={chartOptions} />
          </div>
        </div>

        {/* Damaged Products by Brand */}
        {brandDamagedData.labels.length > 0 && (
          <div className="bg-card p-8 neo-border neo-shadow-lg hover-lift animate-slide-up" data-testid="chart-brand-damaged">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-foreground">PRODUTOS AVARIADOS POR MARCA</h3>
              <Button 
                variant="outline" 
                size="sm" 
                className="neo-border hover-lift neo-button"
                data-testid="button-export-brand-damaged"
              >
                <Download className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="relative h-80">
              <Doughnut data={brandDamagedData} options={pieChartOptions} />
            </div>
          </div>
        )}
        
      </section>

      {/* Detailed Brand Statistics Table */}
      <section className="bg-card p-8 neo-border neo-shadow-lg animate-slide-up" data-testid="brand-stats-table">
        <h3 className="text-2xl font-black mb-6 text-foreground">ESTATÍSTICAS DETALHADAS DAS MARCAS</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full neo-border" data-testid="brands-table">
            <thead className="bg-primary text-primary-foreground">
              <tr>
                <th className="p-4 text-left font-black border-r-4 border-foreground">MARCA</th>
                <th className="p-4 text-left font-black border-r-4 border-foreground">TOTAL</th>
                <th className="p-4 text-left font-black border-r-4 border-foreground">VERDE</th>
                <th className="p-4 text-left font-black border-r-4 border-foreground">AMARELO</th>
                <th className="p-4 text-left font-black border-r-4 border-foreground">VERMELHO</th>
                <th className="p-4 text-left font-black border-r-4 border-foreground">AVARIADOS</th>
                <th className="p-4 text-left font-black">ESTOQUE TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {stats.allBrandStats.map((brand, index) => (
                <tr 
                  key={brand.marca}
                  className="border-b-4 border-foreground hover:bg-muted transition-colors"
                  data-testid={`brand-row-${index}`}
                >
                  <td className="p-4 font-bold border-r-2 border-border" data-testid={`brand-name-${index}`}>
                    {brand.marca}
                  </td>
                  <td className="p-4 font-bold border-r-2 border-border" data-testid={`brand-total-${index}`}>
                    {brand.total}
                  </td>
                  <td className="p-4 font-semibold border-r-2 border-border">
                    <span className="px-2 py-1 bg-green-status text-white font-black text-xs neo-border" data-testid={`brand-green-${index}`}>
                      {brand.green}
                    </span>
                  </td>
                  <td className="p-4 font-semibold border-r-2 border-border">
                    <span className="px-2 py-1 bg-yellow-status text-black font-black text-xs neo-border" data-testid={`brand-yellow-${index}`}>
                      {brand.yellow}
                    </span>
                  </td>
                  <td className="p-4 font-semibold border-r-2 border-border">
                    <span className="px-2 py-1 bg-red-status text-white font-black text-xs neo-border" data-testid={`brand-red-${index}`}>
                      {brand.red}
                    </span>
                  </td>
                  <td className="p-4 font-semibold border-r-2 border-border" data-testid={`brand-damaged-${index}`}>
                    <span className={`px-2 py-1 font-black text-xs neo-border ${
                      brand.damaged > 0 
                        ? 'bg-secondary text-secondary-foreground' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {brand.damaged}
                    </span>
                  </td>
                  <td className="p-4 font-bold" data-testid={`brand-stock-${index}`}>
                    {brand.totalStock.toLocaleString('pt-BR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
