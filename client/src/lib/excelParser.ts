import * as XLSX from 'xlsx';
import { InsertProduct } from '@shared/schema';

export interface ExcelRow {
  Id?: string | number;
  Nome?: string;
  Marca?: string;
  Quantidade?: string | number;
  Validade?: string;
  'Status Validade'?: string;
  Avariado?: string;
}

export function parseExcelFile(file: File): Promise<InsertProduct[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        if (workbook.SheetNames.length === 0) {
          throw new Error('No sheets found in the Excel file');
        }
        
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData: ExcelRow[] = XLSX.utils.sheet_to_json(worksheet);
        
        if (jsonData.length === 0) {
          throw new Error('No data found in the Excel file');
        }
        
        const products: InsertProduct[] = [];
        
        for (let i = 0; i < jsonData.length; i++) {
          const row = jsonData[i];
          
          try {
            // Validate required fields
            if (!row.Nome || !row.Marca || !row.Quantidade || !row.Validade || !row['Status Validade']) {
              console.warn(`Skipping row ${i + 1}: Missing required fields`);
              continue;
            }
            
            // Parse and validate data
            const quantidade = typeof row.Quantidade === 'number' 
              ? row.Quantidade 
              : parseInt(String(row.Quantidade).replace(/[^\d]/g, ''), 10);
              
            if (isNaN(quantidade) || quantidade < 0) {
              console.warn(`Skipping row ${i + 1}: Invalid quantity`);
              continue;
            }
            
            const statusValidade = String(row['Status Validade']).toLowerCase().trim();
            if (!['vermelho', 'amarelo', 'verde'].includes(statusValidade)) {
              console.warn(`Skipping row ${i + 1}: Invalid status validade`);
              continue;
            }
            
            const avariado = String(row.Avariado || 'não').toLowerCase().trim() === 'sim';
            
            const product: InsertProduct = {
              nome: String(row.Nome).trim(),
              marca: String(row.Marca).trim(),
              quantidade,
              validade: String(row.Validade).trim(),
              statusValidade,
              avariado
            };
            
            products.push(product);
          } catch (error) {
            console.warn(`Error parsing row ${i + 1}:`, error);
          }
        }
        
        if (products.length === 0) {
          throw new Error('No valid products found in the Excel file');
        }
        
        resolve(products);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read the file'));
    };
    
    reader.readAsArrayBuffer(file);
  });
}
