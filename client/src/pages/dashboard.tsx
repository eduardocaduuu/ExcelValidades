import { Trophy, AlertCircle, Hammer } from 'lucide-react';
import { useProducts, useDashboardStats } from '@/hooks/useExcelData';
import FileUpload from '@/components/FileUpload';
import SummaryCards from '@/components/SummaryCards';
import ChartsSection from '@/components/ChartsSection';
import DataTable from '@/components/DataTable';
import ExportSection from '@/components/ExportSection';

export default function Dashboard() {
  const { data: products = [], isLoading: productsLoading } = useProducts();
  const { data: stats, isLoading: statsLoading } = useDashboardStats();

  const isLoading = productsLoading || statsLoading;
  const hasData = products.length > 0;

  return (
    <div className="bg-background text-foreground font-sans min-h-screen">
      
      {/* Header */}
      <header className="bg-primary p-6 neo-border-thick border-b-0" data-testid="app-header">
        <div className="container mx-auto">
          <h1 className="text-4xl lg:text-6xl font-black text-primary-foreground tracking-tight">
            EXCEL VALIDADES
          </h1>
          <p className="text-xl font-bold text-primary-foreground mt-2 opacity-90">
            Dashboard de Controle de Validade
          </p>
        </div>
      </header>

      <main className="container mx-auto p-6 space-y-8">
        
        {/* File Upload */}
        <FileUpload />

        {/* Summary Cards */}
        <SummaryCards stats={stats} isLoading={isLoading} />

        {/* Charts Section */}
        <ChartsSection stats={stats} isLoading={isLoading} />

        {/* Quick Brand Summary */}
        {stats && (
          <section className="bg-card p-8 neo-border neo-shadow-lg animate-slide-up" data-testid="brand-analysis-section">
            <h2 className="text-3xl font-black mb-8 text-foreground">RESUMO DAS MARCAS</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Brands with Most Green Products */}
              <div className="text-center p-6 bg-muted neo-border hover:bg-accent hover:text-accent-foreground transition-colors hover-lift" data-testid="brand-most-green">
                <div className="w-16 h-16 mx-auto mb-4 bg-primary rounded-full flex items-center justify-center neo-border">
                  <Trophy className="w-8 h-8 text-primary-foreground" />
                </div>
                <h4 className="text-xl font-black mb-2">MAIS PRODUTOS VÁLIDOS</h4>
                <div className="space-y-2">
                  {stats.allBrandStats
                    .filter(brand => brand.green === Math.max(...stats.allBrandStats.map(b => b.green)))
                    .map((brand, index) => (
                      <div key={brand.marca} className="border-b pb-2" data-testid={`top-green-brand-${index}`}>
                        <p className="text-2xl font-black text-primary" data-testid={`text-top-green-brand-${index}`}>
                          {brand.marca}
                        </p>
                        <p className="text-lg font-bold" data-testid={`text-top-green-count-${index}`}>
                          {brand.green} produtos
                        </p>
                      </div>
                    ))
                  }
                </div>
              </div>

              {/* Brands with Most Red Products */}
              <div className="text-center p-6 bg-muted neo-border hover:bg-accent hover:text-accent-foreground transition-colors hover-lift" data-testid="brand-most-red">
                <div className="w-16 h-16 mx-auto mb-4 bg-destructive rounded-full flex items-center justify-center neo-border">
                  <AlertCircle className="w-8 h-8 text-destructive-foreground" />
                </div>
                <h4 className="text-xl font-black mb-2">MAIS PRODUTOS VENCIDOS</h4>
                <div className="space-y-2">
                  {stats.allBrandStats
                    .filter(brand => brand.red === Math.max(...stats.allBrandStats.map(b => b.red)))
                    .map((brand, index) => (
                      <div key={brand.marca} className="border-b pb-2" data-testid={`top-red-brand-${index}`}>
                        <p className="text-2xl font-black text-destructive" data-testid={`text-top-red-brand-${index}`}>
                          {brand.marca}
                        </p>
                        <p className="text-lg font-bold" data-testid={`text-top-red-count-${index}`}>
                          {brand.red} produtos
                        </p>
                      </div>
                    ))
                  }
                </div>
              </div>

              {/* Brands with Most Damaged Products */}
              <div className="text-center p-6 bg-muted neo-border hover:bg-accent hover:text-accent-foreground transition-colors hover-lift" data-testid="brand-most-damaged">
                <div className="w-16 h-16 mx-auto mb-4 bg-secondary rounded-full flex items-center justify-center neo-border">
                  <Hammer className="w-8 h-8 text-secondary-foreground" />
                </div>
                <h4 className="text-xl font-black mb-2">MAIS PRODUTOS AVARIADOS</h4>
                <div className="space-y-2">
                  {stats.allBrandStats
                    .filter(brand => brand.damaged === Math.max(...stats.allBrandStats.map(b => b.damaged)))
                    .map((brand, index) => (
                      <div key={brand.marca} className="border-b pb-2" data-testid={`top-damaged-brand-${index}`}>
                        <p className="text-2xl font-black text-secondary" data-testid={`text-top-damaged-brand-${index}`}>
                          {brand.marca}
                        </p>
                        <p className="text-lg font-bold" data-testid={`text-top-damaged-count-${index}`}>
                          {brand.damaged} produtos
                        </p>
                      </div>
                    ))
                  }
                </div>
              </div>
              
            </div>
          </section>
        )}

        {/* Critical Products Section */}
        {stats && stats.criticalProducts.length > 0 && (
          <section className="bg-card p-8 neo-border neo-shadow-lg hover-lift animate-slide-up" data-testid="critical-products-section">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-black text-foreground">PRODUTOS CRÍTICOS</h3>
            </div>
            
            <div className="space-y-4">
              {stats.criticalProducts.slice(0, 5).map((product, index) => (
                <div 
                  key={`${product.nome}-${index}`}
                  className="flex justify-between items-center p-4 bg-destructive text-destructive-foreground neo-border"
                  data-testid={`critical-product-${index}`}
                >
                  <div>
                    <p className="font-black text-lg" data-testid={`critical-product-name-${index}`}>{product.nome}</p>
                    <p className="font-semibold text-sm opacity-90" data-testid={`critical-product-brand-${index}`}>{product.marca}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-sm" data-testid={`critical-product-expiry-${index}`}>{product.validade}</p>
                    <p className="font-bold text-xs uppercase">VENCIDO</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Data Table */}
        <DataTable products={products} isLoading={productsLoading} />

        {/* Export Section */}
        <ExportSection hasData={hasData} />

      </main>

      {/* Footer */}
      <footer className="bg-foreground text-background p-6 mt-12 neo-border-thick border-t-0" data-testid="app-footer">
        <div className="container mx-auto text-center">
          <p className="text-lg font-black">
            EXCEL VALIDADES © 2024 - CONTROLE TOTAL DE VALIDADE
          </p>
        </div>
      </footer>

    </div>
  );
}
