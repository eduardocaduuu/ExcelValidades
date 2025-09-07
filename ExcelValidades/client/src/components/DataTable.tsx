import { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Product } from '@shared/schema';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface DataTableProps {
  products: Product[];
  isLoading: boolean;
}

interface FilterState {
  name: string;
  brand: string;
  quantityMin: string;
  quantityMax: string;
  status: string;
  damaged: string;
}

export default function DataTable({ products, isLoading }: DataTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    name: '',
    brand: '',
    quantityMin: '',
    quantityMax: '',
    status: '',
    damaged: ''
  });
  const itemsPerPage = 10;

  const filteredProducts = products.filter(product => {
    // Text search (works on all fields for general search)
    const matchesSearch = searchTerm === '' || 
      product.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.quantidade.toString().includes(searchTerm) ||
      product.statusValidade.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.avariado ? 'sim' : 'não').includes(searchTerm.toLowerCase());

    // Advanced filters
    const matchesName = filters.name === '' || 
      product.nome.toLowerCase().includes(filters.name.toLowerCase());
    
    const matchesBrand = filters.brand === '' || 
      product.marca.toLowerCase().includes(filters.brand.toLowerCase());
    
    const matchesQuantityMin = filters.quantityMin === '' || 
      product.quantidade >= parseInt(filters.quantityMin);
    
    const matchesQuantityMax = filters.quantityMax === '' || 
      product.quantidade <= parseInt(filters.quantityMax);
    
    const matchesStatus = filters.status === '' || 
      product.statusValidade === filters.status;
    
    const matchesDamaged = filters.damaged === '' || 
      (filters.damaged === 'sim' && product.avariado) ||
      (filters.damaged === 'nao' && !product.avariado);

    return matchesSearch && matchesName && matchesBrand && 
           matchesQuantityMin && matchesQuantityMax && 
           matchesStatus && matchesDamaged;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  const clearFilters = () => {
    setFilters({
      name: '',
      brand: '',
      quantityMin: '',
      quantityMax: '',
      status: '',
      damaged: ''
    });
    setSearchTerm('');
    setCurrentPage(1);
  };

  const hasActiveFilters = Object.values(filters).some(filter => filter !== '') || searchTerm !== '';

  // Get unique values for filter dropdowns
  const uniqueBrands = Array.from(new Set(products.map(p => p.marca))).sort();
  const uniqueStatuses = Array.from(new Set(products.map(p => p.statusValidade))).sort();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verde': return 'bg-green-status text-white';
      case 'amarelo': return 'bg-yellow-status text-black';
      case 'vermelho': return 'bg-red-status text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  if (isLoading) {
    return (
      <section className="bg-card p-8 neo-border neo-shadow-lg animate-slide-up">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-card p-8 neo-border neo-shadow-lg animate-slide-up" data-testid="data-table-section">
      <div className="mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
          <h3 className="text-2xl font-black text-foreground">LISTAGEM DE PRODUTOS</h3>
          <div className="flex gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:flex-none">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar em todos os campos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 px-4 py-2 bg-input border-2 border-foreground font-bold neo-shadow text-foreground placeholder-muted-foreground"
                data-testid="input-search-products"
              />
            </div>
            <Button 
              onClick={() => setShowFilters(!showFilters)}
              className={`px-6 py-2 font-black neo-border neo-shadow hover-lift neo-button ${
                showFilters ? 'bg-accent text-accent-foreground' : 'bg-primary text-primary-foreground'
              }`}
              data-testid="button-toggle-filters"
            >
              <Filter className="w-4 h-4 mr-2" />
              FILTROS
            </Button>
            {hasActiveFilters && (
              <Button 
                onClick={clearFilters}
                className="bg-secondary text-secondary-foreground px-4 py-2 font-black neo-border neo-shadow hover-lift neo-button"
                data-testid="button-clear-filters"
              >
                <X className="w-4 h-4 mr-2" />
                LIMPAR
              </Button>
            )}
          </div>
        </div>

        {/* Advanced Filters Panel */}
        {showFilters && (
          <div className="bg-muted p-6 neo-border animate-slide-down mb-4" data-testid="filters-panel">
            <h4 className="text-lg font-black mb-4 text-foreground">FILTROS AVANÇADOS</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              
              {/* Name Filter */}
              <div>
                <label className="block text-sm font-bold mb-2 text-foreground">NOME DO PRODUTO</label>
                <Input
                  type="text"
                  placeholder="Filtrar por nome..."
                  value={filters.name}
                  onChange={(e) => setFilters(prev => ({ ...prev, name: e.target.value }))}
                  className="bg-input border-2 border-foreground font-bold neo-shadow text-foreground"
                  data-testid="filter-name"
                />
              </div>

              {/* Brand Filter */}
              <div>
                <label className="block text-sm font-bold mb-2 text-foreground">MARCA</label>
                <Select 
                  value={filters.brand} 
                  onValueChange={(value) => setFilters(prev => ({ ...prev, brand: value }))}
                >
                  <SelectTrigger className="bg-input border-2 border-foreground font-bold neo-shadow text-foreground" data-testid="filter-brand">
                    <SelectValue placeholder="Todas as marcas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todas as marcas</SelectItem>
                    {uniqueBrands.map(brand => (
                      <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-bold mb-2 text-foreground">STATUS</label>
                <Select 
                  value={filters.status} 
                  onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
                >
                  <SelectTrigger className="bg-input border-2 border-foreground font-bold neo-shadow text-foreground" data-testid="filter-status">
                    <SelectValue placeholder="Todos os status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos os status</SelectItem>
                    <SelectItem value="verde">VERDE (Válido)</SelectItem>
                    <SelectItem value="amarelo">AMARELO (Atenção)</SelectItem>
                    <SelectItem value="vermelho">VERMELHO (Vencido)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Quantity Range */}
              <div>
                <label className="block text-sm font-bold mb-2 text-foreground">QUANTIDADE MÍNIMA</label>
                <Input
                  type="number"
                  placeholder="Mín..."
                  value={filters.quantityMin}
                  onChange={(e) => setFilters(prev => ({ ...prev, quantityMin: e.target.value }))}
                  className="bg-input border-2 border-foreground font-bold neo-shadow text-foreground"
                  data-testid="filter-quantity-min"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2 text-foreground">QUANTIDADE MÁXIMA</label>
                <Input
                  type="number"
                  placeholder="Máx..."
                  value={filters.quantityMax}
                  onChange={(e) => setFilters(prev => ({ ...prev, quantityMax: e.target.value }))}
                  className="bg-input border-2 border-foreground font-bold neo-shadow text-foreground"
                  data-testid="filter-quantity-max"
                />
              </div>

              {/* Damaged Filter */}
              <div>
                <label className="block text-sm font-bold mb-2 text-foreground">AVARIADO</label>
                <Select 
                  value={filters.damaged} 
                  onValueChange={(value) => setFilters(prev => ({ ...prev, damaged: value }))}
                >
                  <SelectTrigger className="bg-input border-2 border-foreground font-bold neo-shadow text-foreground" data-testid="filter-damaged">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos</SelectItem>
                    <SelectItem value="sim">SIM (Avariados)</SelectItem>
                    <SelectItem value="nao">NÃO (Não avariados)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

            </div>
          </div>
        )}
      </div>
      
      {products.length === 0 ? (
        <div className="text-center p-12 bg-muted neo-border">
          <p className="text-xl font-bold text-muted-foreground">
            Nenhum produto encontrado. Faça upload de uma planilha para começar.
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full neo-border" data-testid="products-table">
              <thead className="bg-primary text-primary-foreground">
                <tr>
                  <th className="p-4 text-left font-black border-r-4 border-foreground">NOME</th>
                  <th className="p-4 text-left font-black border-r-4 border-foreground">MARCA</th>
                  <th className="p-4 text-left font-black border-r-4 border-foreground">QUANTIDADE</th>
                  <th className="p-4 text-left font-black border-r-4 border-foreground">VALIDADE</th>
                  <th className="p-4 text-left font-black border-r-4 border-foreground">STATUS</th>
                  <th className="p-4 text-left font-black">AVARIADO</th>
                </tr>
              </thead>
              <tbody>
                {displayedProducts.map((product, index) => (
                  <tr 
                    key={product.id}
                    className="border-b-4 border-foreground hover:bg-muted transition-colors"
                    data-testid={`product-row-${index}`}
                  >
                    <td className="p-4 font-bold border-r-2 border-border" data-testid={`product-name-${index}`}>
                      {product.nome}
                    </td>
                    <td className="p-4 font-semibold border-r-2 border-border" data-testid={`product-brand-${index}`}>
                      {product.marca}
                    </td>
                    <td className="p-4 font-bold border-r-2 border-border" data-testid={`product-quantity-${index}`}>
                      {product.quantidade.toLocaleString('pt-BR')}
                    </td>
                    <td className="p-4 font-semibold border-r-2 border-border" data-testid={`product-expiry-${index}`}>
                      {product.validade}
                    </td>
                    <td className="p-4 border-r-2 border-border">
                      <span 
                        className={`px-3 py-1 font-black text-xs rounded-none neo-border ${getStatusColor(product.statusValidade)}`}
                        data-testid={`product-status-${index}`}
                      >
                        {product.statusValidade.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4">
                      <span 
                        className={`px-3 py-1 font-black text-xs rounded-none neo-border ${
                          product.avariado 
                            ? 'bg-secondary text-secondary-foreground' 
                            : 'bg-muted text-muted-foreground'
                        }`}
                        data-testid={`product-damaged-${index}`}
                      >
                        {product.avariado ? 'SIM' : 'NÃO'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4">
            <p className="font-bold text-muted-foreground" data-testid="pagination-info">
              Mostrando {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredProducts.length)} de {filteredProducts.length} produtos
            </p>
            <div className="flex gap-2">
              <Button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-muted text-muted-foreground font-black neo-border hover:bg-primary hover:text-primary-foreground transition-colors neo-button disabled:opacity-50"
                data-testid="button-previous-page"
              >
                ANTERIOR
              </Button>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = i + 1;
                const isActive = pageNum === currentPage;
                
                return (
                  <Button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-4 py-2 font-black neo-border transition-colors neo-button ${
                      isActive 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground'
                    }`}
                    data-testid={`button-page-${pageNum}`}
                  >
                    {pageNum}
                  </Button>
                );
              })}
              
              <Button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-muted text-muted-foreground font-black neo-border hover:bg-primary hover:text-primary-foreground transition-colors neo-button disabled:opacity-50"
                data-testid="button-next-page"
              >
                PRÓXIMO
              </Button>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
