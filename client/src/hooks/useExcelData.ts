import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DashboardStats, Product } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { parseExcelFile } from "@/lib/excelParser";

export function useProducts() {
  return useQuery<Product[]>({
    queryKey: ['/api/products'],
  });
}

export function useDashboardStats() {
  return useQuery<DashboardStats>({
    queryKey: ['/api/dashboard/stats'],
  });
}

export function useUploadExcel() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (file: File) => {
      // Parse Excel file on frontend
      const products = await parseExcelFile(file);
      
      // Send parsed data to backend
      const response = await apiRequest('POST', '/api/products/bulk', { products });
      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch data
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
    },
  });
}

export function useClearProducts() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      const response = await apiRequest('DELETE', '/api/products/clear');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
    },
  });
}
