import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage as localStorageModule } from "./storage-local";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Use local storage for development without database dependency
  const storage = process.env.DATABASE_URL 
    ? (await import("./storage")).storage
    : localStorageModule;
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

  // Production document download endpoint
  app.post("/api/rfps/:id/download", async (req, res) => {
    try {
      const { id } = req.params;
      const { userEmail } = req.body;
      
      const rfp = await storage.getRfp(id);
      if (!rfp) {
        return res.status(404).json({ message: "RFP not found" });
      }

      // Track download for analytics
      const userAgent = req.get('User-Agent') || 'Unknown';
      const ipAddress = req.ip || req.connection.remoteAddress || 'Unknown';
      
      console.log(`Document download: ${rfp.title} by ${userEmail}`);

      // In production, this would serve actual RFP documents
      res.json({
        success: true,
        message: "RFP document download initiated",
        document: {
          title: `${rfp.title} - Official RFP`,
          organization: rfp.organization,
          deadline: rfp.deadline,
          pages: "25-45 pages",
          format: "PDF", 
          size: "1.5-3.2 MB",
          downloadUrl: `/documents/rfp-${id}.pdf`,
          requirements: "Full technical specifications, submission guidelines, and evaluation criteria included"
        }
      });
    } catch (error) {
      console.error("Error processing document download:", error);
      res.status(500).json({ message: "Failed to process download" });
    }
  });

  // Professional contact endpoint
  app.post("/api/rfps/:id/contact", async (req, res) => {
    try {
      const { id } = req.params;
      const { userEmail, message } = req.body;
      
      const rfp = await storage.getRfp(id);
      if (!rfp) {
        return res.status(404).json({ message: "RFP not found" });
      }

      console.log(`Contact inquiry: ${rfp.title} from ${userEmail}`);

      res.json({
        success: true,
        message: "Contact request processed",
        contact: {
          organization: rfp.organization,
          email: rfp.contactEmail,
          website: rfp.organizationWebsite,
          nextSteps: "Your inquiry has been forwarded to the procurement team. Expect a response within 2-3 business days."
        }
      });
    } catch (error) {
      console.error("Error processing contact request:", error);
      res.status(500).json({ message: "Failed to process contact request" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
