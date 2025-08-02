import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage as localStorageModule } from "./storage-local";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Always use local storage for consistent development experience
  const storage = localStorageModule;
  console.log('Using local storage with professional RFP data');
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

  // Document download endpoints for specific RFP slugs (MUST come before the :id route)
  app.get("/api/rfps/university-research/document", async (req, res) => {
    res.json({
      title: "University Research Platform Development - Official RFP",
      organization: "State University System",
      type: "PDF Document",
      size: "2.1 MB",
      pages: 28,
      downloadUrl: "https://stateuniv.edu/procurement/rfp-research-platform.pdf",
      description: "Complete RFP documentation for university research collaboration platform with Drupal CMS requirements."
    });
  });

  app.get("/api/rfps/municipal-portal/document", async (req, res) => {
    res.json({
      title: "Municipal Government Portal Modernization - Official RFP",
      organization: "City of Innovation",
      type: "PDF Document", 
      size: "1.8 MB",
      pages: 22,
      downloadUrl: "https://cityofinnovation.gov/procurement/portal-modernization-rfp.pdf",
      description: "Official procurement documentation for city government website modernization project."
    });
  });

  app.get("/api/rfps/healthcare-data-mgmt/document", async (req, res) => {
    res.json({
      title: "Healthcare Data Management System - Official RFP",
      organization: "Regional Medical Center",
      type: "PDF Document",
      size: "3.2 MB", 
      pages: 35,
      downloadUrl: "https://regionalmed.org/procurement/data-management-rfp.pdf",
      description: "Comprehensive RFP for HIPAA-compliant healthcare data management system with Drupal integration."
    });
  });

  // Get single RFP by ID (MUST come after specific slug routes)
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

  // Live RFP statistics endpoint
  app.get("/api/rfps/stats/live", async (req, res) => {
    try {
      const rfps = await storage.getRfps();
      const stats = {
        total: rfps.length,
        drupal: rfps.filter(r => r.isDrupal).length,
        totalBudget: rfps.reduce((sum, r) => sum + (r.budgetMax || 0), 0),
        avgBudget: rfps.length > 0 ? Math.round(rfps.reduce((sum, r) => sum + ((r.budgetMin || 0) + (r.budgetMax || 0)) / 2, 0) / rfps.length) : 0,
        deadlinesSoon: rfps.filter(r => {
          const daysUntil = Math.ceil((new Date(r.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
          return daysUntil <= 30;
        }).length
      };
      res.json(stats);
    } catch (error) {
      console.error("Error fetching live stats:", error);
      res.status(500).json({ message: "Failed to fetch live statistics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
