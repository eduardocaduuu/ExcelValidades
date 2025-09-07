import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProductSchema } from "@shared/schema";
import { z } from "zod";
import multer from "multer";

// Configure multer for file uploads
const upload = multer({ 
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      cb(null, true);
    } else {
      cb(new Error('Only .xlsx files are allowed'));
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get all products
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getAllProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  // Get dashboard statistics
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  // Upload Excel file and process products
  app.post("/api/upload-excel", upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // The file buffer will be processed on the frontend using SheetJS
      // This endpoint just confirms the file was received
      res.json({ 
        message: "File uploaded successfully",
        filename: req.file.originalname,
        size: req.file.size
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to upload file" });
    }
  });

  // Bulk create products from Excel data
  app.post("/api/products/bulk", async (req, res) => {
    try {
      const productsData = req.body.products;
      
      if (!Array.isArray(productsData)) {
        return res.status(400).json({ message: "Products data must be an array" });
      }

      // Validate each product
      const validatedProducts = productsData.map(product => {
        const result = insertProductSchema.safeParse(product);
        if (!result.success) {
          throw new Error(`Invalid product data: ${result.error.message}`);
        }
        return result.data;
      });

      // Clear existing products and insert new ones
      await storage.clearAllProducts();
      const createdProducts = await storage.createManyProducts(validatedProducts);
      
      res.json({ 
        message: "Products imported successfully",
        count: createdProducts.length
      });
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Failed to import products" });
    }
  });

  // Clear all products
  app.delete("/api/products/clear", async (req, res) => {
    try {
      await storage.clearAllProducts();
      res.json({ message: "All products cleared successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to clear products" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
