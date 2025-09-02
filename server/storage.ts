import { type User, type InsertUser, type Product, type InsertProduct, type DashboardStats } from "@shared/schema";
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
    const brandStats = new Map<string, { green: number; red: number; yellow: number; damaged: number }>();
    
    allProducts.forEach(product => {
      if (!brandStats.has(product.marca)) {
        brandStats.set(product.marca, { green: 0, red: 0, yellow: 0, damaged: 0 });
      }
      
      const stats = brandStats.get(product.marca)!;
      
      if (product.statusValidade === 'verde') stats.green++;
      else if (product.statusValidade === 'vermelho') stats.red++;
      else if (product.statusValidade === 'amarelo') stats.yellow++;
      
      if (product.avariado) stats.damaged++;
    });

    let mostGreen = { name: '', count: 0 };
    let mostRed = { name: '', count: 0 };
    let mostDamaged = { name: '', count: 0 };

    brandStats.forEach((stats, brand) => {
      if (stats.green > mostGreen.count) {
        mostGreen = { name: brand, count: stats.green };
      }
      if (stats.red > mostRed.count) {
        mostRed = { name: brand, count: stats.red };
      }
      if (stats.damaged > mostDamaged.count) {
        mostDamaged = { name: brand, count: stats.damaged };
      }
    });

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
      topProductsByStock,
      criticalProducts
    };
  }
}

export const storage = new MemStorage();
