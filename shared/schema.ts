import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  nome: text("nome").notNull(),
  marca: text("marca").notNull(),
  quantidade: integer("quantidade").notNull(),
  validade: text("validade").notNull(),
  statusValidade: text("status_validade").notNull(), // vermelho, amarelo, verde
  avariado: boolean("avariado").notNull().default(false),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  uploadedAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

// Dashboard analytics types
export interface DashboardStats {
  totalProducts: number;
  expiredProducts: number;
  damagedProducts: number;
  totalStock: number;
  statusCounts: {
    vermelho: number;
    amarelo: number;
    verde: number;
  };
  topBrands: {
    mostGreen: { name: string; count: number };
    mostRed: { name: string; count: number };
    mostDamaged: { name: string; count: number };
  };
  topProductsByStock: Array<{
    nome: string;
    marca: string;
    quantidade: number;
  }>;
  criticalProducts: Array<{
    nome: string;
    marca: string;
    validade: string;
    statusValidade: string;
  }>;
}
