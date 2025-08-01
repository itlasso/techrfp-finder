import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get RFPs with optional filters
  app.get("/api/rfps", async (req, res) => {
    try {
      const filters = {
        search: req.query.search as string,
        technologies: req.query.technologies ? 
          (Array.isArray(req.query.technologies) ? req.query.technologies : [req.query.technologies]) as string[] : 
          undefined,
        deadlineFilter: req.query.deadlineFilter as string,
        budgetRange: req.query.budgetRange as string,
        organizationTypes: req.query.organizationTypes ? 
          (Array.isArray(req.query.organizationTypes) ? req.query.organizationTypes : [req.query.organizationTypes]) as string[] : 
          undefined,
      };

      const rfps = await storage.getRfps(filters);
      res.json(rfps);
    } catch (error) {
      console.error("Error fetching RFPs:", error);
      res.status(500).json({ message: "Failed to fetch RFPs" });
    }
  });

  // Get single RFP by ID
  app.get("/api/rfps/:id", async (req, res) => {
    try {
      const rfp = await storage.getRfp(req.params.id);
      if (!rfp) {
        return res.status(404).json({ message: "RFP not found" });
      }
      res.json(rfp);
    } catch (error) {
      console.error("Error fetching RFP:", error);
      res.status(500).json({ message: "Failed to fetch RFP" });
    }
  });

  // Get technology counts for filters
  app.get("/api/rfps/stats/technologies", async (req, res) => {
    try {
      const allRfps = await storage.getRfps();
      const techCounts: Record<string, number> = {};
      
      allRfps.forEach(rfp => {
        techCounts[rfp.technology] = (techCounts[rfp.technology] || 0) + 1;
      });

      res.json(techCounts);
    } catch (error) {
      console.error("Error fetching technology stats:", error);
      res.status(500).json({ message: "Failed to fetch technology statistics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
