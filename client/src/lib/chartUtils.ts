import { DashboardStats } from '@shared/schema';

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
          weight: 'bold'
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
          weight: 'bold'
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
