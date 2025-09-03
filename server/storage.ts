import { type User, type InsertUser, type Product, type InsertProduct, type DashboardStats, type BrandStats } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Product methods
  getAllProducts(): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  createManyProducts(products: InsertProduct[]): Promise<Product[]>;
  clearAllProducts(): Promise<void>;
  getDashboardStats(): Promise<DashboardStats>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private products: Map<string, Product>;

  constructor() {
    this.users = new Map();
    this.products = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAllProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const product: Product = { 
      ...insertProduct, 
      id,
      avariado: insertProduct.avariado ?? false,
      uploadedAt: new Date()
    };
    this.products.set(id, product);
    return product;
  }

  async createManyProducts(insertProducts: InsertProduct[]): Promise<Product[]> {
    const products: Product[] = [];
    for (const insertProduct of insertProducts) {
      const product = await this.createProduct(insertProduct);
      products.push(product);
    }
    return products;
  }

  async clearAllProducts(): Promise<void> {
    this.products.clear();
  }

  async getDashboardStats(): Promise<DashboardStats> {
    const allProducts = Array.from(this.products.values());
    
    const totalProducts = allProducts.length;
    const expiredProducts = allProducts.filter(p => p.statusValidade === 'vermelho').length;
    const damagedProducts = allProducts.filter(p => p.avariado).length;
    const totalStock = allProducts.reduce((sum, p) => sum + p.quantidade, 0);

    const statusCounts = {
      vermelho: allProducts.filter(p => p.statusValidade === 'vermelho').length,
      amarelo: allProducts.filter(p => p.statusValidade === 'amarelo').length,
      verde: allProducts.filter(p => p.statusValidade === 'verde').length,
    };

    // Brand analysis
    const brandStatsMap = new Map<string, { green: number; red: number; yellow: number; damaged: number; total: number; totalStock: number }>();
    
    allProducts.forEach(product => {
      if (!brandStatsMap.has(product.marca)) {
        brandStatsMap.set(product.marca, { green: 0, red: 0, yellow: 0, damaged: 0, total: 0, totalStock: 0 });
      }
      
      const stats = brandStatsMap.get(product.marca)!;
      stats.total++;
      stats.totalStock += product.quantidade;
      
      if (product.statusValidade === 'verde') stats.green++;
      else if (product.statusValidade === 'vermelho') stats.red++;
      else if (product.statusValidade === 'amarelo') stats.yellow++;
      
      if (product.avariado) stats.damaged++;
    });

    // Convert to array and sort
    const allBrandStats: BrandStats[] = Array.from(brandStatsMap.entries()).map(([marca, stats]) => ({
      marca,
      green: stats.green,
      red: stats.red,
      yellow: stats.yellow,
      damaged: stats.damaged,
      total: stats.total,
      totalStock: stats.totalStock
    }));

    // Find top brands (handling ties by showing all brands with the same count)
    const maxGreen = Math.max(...allBrandStats.map(b => b.green));
    const maxRed = Math.max(...allBrandStats.map(b => b.red));
    const maxDamaged = Math.max(...allBrandStats.map(b => b.damaged));

    const mostGreenBrands = allBrandStats.filter(b => b.green === maxGreen);
    const mostRedBrands = allBrandStats.filter(b => b.red === maxRed);
    const mostDamagedBrands = allBrandStats.filter(b => b.damaged === maxDamaged);

    // For backward compatibility, pick the first one but now we have the full list
    const mostGreen = mostGreenBrands.length > 0 ? { name: mostGreenBrands[0].marca, count: maxGreen } : { name: '', count: 0 };
    const mostRed = mostRedBrands.length > 0 ? { name: mostRedBrands[0].marca, count: maxRed } : { name: '', count: 0 };
    const mostDamaged = mostDamagedBrands.length > 0 ? { name: mostDamagedBrands[0].marca, count: maxDamaged } : { name: '', count: 0 };

    const topProductsByStock = allProducts
      .sort((a, b) => b.quantidade - a.quantidade)
      .slice(0, 10)
      .map(p => ({
        nome: p.nome,
        marca: p.marca,
        quantidade: p.quantidade
      }));

    const criticalProducts = allProducts
      .filter(p => p.statusValidade === 'vermelho')
      .slice(0, 10)
      .map(p => ({
        nome: p.nome,
        marca: p.marca,
        validade: p.validade,
        statusValidade: p.statusValidade
      }));

    return {
      totalProducts,
      expiredProducts,
      damagedProducts,
      totalStock,
      statusCounts,
      topBrands: {
        mostGreen,
        mostRed,
        mostDamaged
      },
      allBrandStats,
      topProductsByStock,
      criticalProducts
    };
  }
}

export const storage = new MemStorage();
