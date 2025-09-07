import { DashboardStats, BrandStats } from '@shared/schema';

export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor: string | string[];
  borderColor: string | string[];
  borderWidth: number;
}

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export function createStatusChartData(stats: DashboardStats): ChartData {
  return {
    labels: ['Vermelho', 'Amarelo', 'Verde'],
    datasets: [{
      label: 'Status',
      data: [stats.statusCounts.vermelho, stats.statusCounts.amarelo, stats.statusCounts.verde],
      backgroundColor: ['#DC2626', '#EAB308', '#16A34A'],
      borderColor: '#000000',
      borderWidth: 4
    }]
  };
}

export function createBrandChartData(topBrands: DashboardStats['topBrands']): ChartData {
  const brands = [topBrands.mostGreen.name, topBrands.mostRed.name, topBrands.mostDamaged.name];
  const counts = [topBrands.mostGreen.count, topBrands.mostRed.count, topBrands.mostDamaged.count];
  
  return {
    labels: brands,
    datasets: [{
      label: 'Produtos',
      data: counts,
      backgroundColor: '#3B82F6',
      borderColor: '#000000',
      borderWidth: 3
    }]
  };
}

export const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    }
  },
  animation: {
    duration: 1000,
    easing: 'easeOutBounce' as const
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: '#000000',
        lineWidth: 2
      },
      ticks: {
        font: {
          weight: 'bold' as const
        }
      }
    },
    x: {
      grid: {
        color: '#000000',
        lineWidth: 2
      },
      ticks: {
        font: {
          weight: 'bold' as const
        }
      }
    }
  }
};

export const pieChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    }
  },
  animation: {
    animateScale: true,
    duration: 1000
  }
};

// Create chart data for all brands status comparison
export function createBrandStatusComparisonData(allBrandStats: BrandStats[]): ChartData {
  const brands = allBrandStats.map(b => b.marca);
  const greenData = allBrandStats.map(b => b.green);
  const yellowData = allBrandStats.map(b => b.yellow);
  const redData = allBrandStats.map(b => b.red);
  
  return {
    labels: brands,
    datasets: [
      {
        label: 'Verde',
        data: greenData,
        backgroundColor: '#16A34A',
        borderColor: '#000000',
        borderWidth: 3
      },
      {
        label: 'Amarelo',
        data: yellowData,
        backgroundColor: '#EAB308',
        borderColor: '#000000',
        borderWidth: 3
      },
      {
        label: 'Vermelho',
        data: redData,
        backgroundColor: '#DC2626',
        borderColor: '#000000',
        borderWidth: 3
      }
    ]
  };
}

// Create chart data for brand stock distribution
export function createBrandStockData(allBrandStats: BrandStats[]): ChartData {
  const sortedBrands = [...allBrandStats].sort((a, b) => b.totalStock - a.totalStock).slice(0, 8);
  
  return {
    labels: sortedBrands.map(b => b.marca),
    datasets: [{
      label: 'Estoque Total',
      data: sortedBrands.map(b => b.totalStock),
      backgroundColor: '#3B82F6',
      borderColor: '#000000',
      borderWidth: 3
    }]
  };
}

// Create doughnut chart for damaged products by brand
export function createBrandDamagedData(allBrandStats: BrandStats[]): ChartData {
  const brandsWithDamaged = allBrandStats.filter(b => b.damaged > 0);
  const colors = ['#DC2626', '#F97316', '#EAB308', '#84CC16', '#10B981', '#06B6D4', '#3B82F6', '#8B5CF6'];
  
  return {
    labels: brandsWithDamaged.map(b => b.marca),
    datasets: [{
      label: 'Produtos Avariados',
      data: brandsWithDamaged.map(b => b.damaged),
      backgroundColor: colors.slice(0, brandsWithDamaged.length),
      borderColor: '#000000',
      borderWidth: 4
    }]
  };
}

// Enhanced chart options for bar charts with legend
export const barChartOptionsWithLegend = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'top' as const,
      labels: {
        usePointStyle: true,
        font: {
          weight: 'bold' as const,
          size: 12
        },
        padding: 20
      }
    }
  },
  animation: {
    duration: 1000,
    easing: 'easeOutBounce' as const
  },
  scales: {
    y: {
      beginAtZero: true,
      stacked: true,
      grid: {
        color: '#000000',
        lineWidth: 2
      },
      ticks: {
        font: {
          weight: 'bold' as const
        }
      }
    },
    x: {
      stacked: true,
      grid: {
        color: '#000000',
        lineWidth: 2
      },
      ticks: {
        font: {
          weight: 'bold' as const
        },
        maxRotation: 45
      }
    }
  }
};
