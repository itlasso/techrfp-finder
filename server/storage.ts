import { type User, type InsertUser, type Rfp, type InsertRfp } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getRfps(filters?: {
    search?: string;
    technologies?: string[];
    deadlineFilter?: string;
    budgetRange?: string;
    organizationTypes?: string[];
  }): Promise<Rfp[]>;
  getRfp(id: string): Promise<Rfp | undefined>;
  createRfp(rfp: InsertRfp): Promise<Rfp>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private rfps: Map<string, Rfp>;

  constructor() {
    this.users = new Map();
    this.rfps = new Map();
    this.seedRfps();
  }

  private seedRfps() {
    const mockRfps: InsertRfp[] = [
      {
        title: "University Website Redesign & Development",
        organization: "State University of Technology",
        description: "Seeking experienced Drupal developers to redesign and redevelop the university's main website. Requirements include custom module development, integration with student information systems, accessibility compliance, and responsive design. Must have experience with Drupal 10, custom theme development, and higher education requirements.",
        technology: "Drupal",
        budgetMin: 150000,
        budgetMax: 200000,
        deadline: new Date("2024-12-28"),
        location: "California, USA",
        organizationType: "Education",
        contactEmail: "procurement@statetech.edu",
        isDrupal: true,
        isActive: true,
      },
      {
        title: "E-commerce Platform Development",
        organization: "Green Earth Retailers",
        description: "WordPress-based e-commerce solution with WooCommerce integration. Need custom theme development, payment gateway integration, inventory management system, and mobile optimization. Experience with sustainable retail and eco-friendly business practices preferred.",
        technology: "WordPress",
        budgetMin: 75000,
        budgetMax: 100000,
        deadline: new Date("2025-01-05"),
        location: "New York, USA",
        organizationType: "Private",
        contactEmail: "tech@greenearthretailers.com",
        isDrupal: false,
        isActive: true,
      },
      {
        title: "Customer Portal Web Application",
        organization: "TechFlow Solutions Inc.",
        description: "React-based customer portal with real-time data visualization, user authentication, and integration with existing APIs. Modern UI/UX design required. Must include dashboard functionality, reporting tools, and mobile responsiveness.",
        technology: "React",
        budgetMin: 200000,
        budgetMax: 300000,
        deadline: new Date("2025-01-14"),
        location: "Texas, USA",
        organizationType: "Private",
        contactEmail: "projects@techflow.com",
        isDrupal: false,
        isActive: true,
      },
      {
        title: "Healthcare Data Management System",
        organization: "Regional Medical Center",
        description: "Drupal-based patient data management system with HIPAA compliance, custom workflows, and integration with electronic health records. Requires expertise in healthcare data standards, security protocols, and patient privacy regulations.",
        technology: "Drupal",
        budgetMin: 400000,
        budgetMax: 500000,
        deadline: new Date("2025-01-11"),
        location: "Florida, USA",
        organizationType: "Non-profit",
        contactEmail: "it@regionalmedical.org",
        isDrupal: true,
        isActive: true,
      },
      {
        title: "Data Analytics Platform",
        organization: "City Planning Department",
        description: "Python-based data analytics platform for urban planning insights. Machine learning integration, data visualization, and reporting tools required. Must handle large datasets and provide predictive analytics for city development projects.",
        technology: "Python",
        budgetMin: 120000,
        budgetMax: 180000,
        deadline: new Date("2025-01-18"),
        location: "Washington, USA",
        organizationType: "Government",
        contactEmail: "tech@cityplanning.gov",
        isDrupal: false,
        isActive: true,
      },
      {
        title: "Community Portal Enhancement",
        organization: "Metropolitan Library System",
        description: "Drupal 10 upgrade and enhancement project for community library portal. Features include event management, digital resource access, user registration system, and multi-location support. Must integrate with existing library management systems.",
        technology: "Drupal",
        budgetMin: 80000,
        budgetMax: 120000,
        deadline: new Date("2025-01-25"),
        location: "Illinois, USA",
        organizationType: "Government",
        contactEmail: "digital@metrolibraries.org",
        isDrupal: true,
        isActive: true,
      },
      {
        title: "Non-profit Fundraising Platform",
        organization: "Global Climate Initiative",
        description: "WordPress-based fundraising and donor management platform. Features include online donations, campaign management, volunteer coordination, and impact reporting. Must be optimized for mobile and social media integration.",
        technology: "WordPress",
        budgetMin: 45000,
        budgetMax: 70000,
        deadline: new Date("2025-02-01"),
        location: "Oregon, USA",
        organizationType: "Non-profit",
        contactEmail: "tech@globalclimate.org",
        isDrupal: false,
        isActive: true,
      },
      {
        title: "Enterprise Resource Planning System",
        organization: "Manufacturing Solutions Corp",
        description: "Angular-based ERP system for manufacturing operations. Includes inventory management, production scheduling, quality control, and reporting modules. Must integrate with existing manufacturing equipment and databases.",
        technology: "Angular",
        budgetMin: 350000,
        budgetMax: 450000,
        deadline: new Date("2025-02-15"),
        location: "Michigan, USA",
        organizationType: "Private",
        contactEmail: "erp@mfgsolutions.com",
        isDrupal: false,
        isActive: true,
      }
    ];

    mockRfps.forEach(rfp => {
      const id = randomUUID();
      const fullRfp: Rfp = {
        ...rfp,
        id,
        postedDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date within last 30 days
        budgetMin: rfp.budgetMin ?? null,
        budgetMax: rfp.budgetMax ?? null,
        isDrupal: rfp.isDrupal ?? false,
        isActive: rfp.isActive ?? true,
      };
      this.rfps.set(id, fullRfp);
    });
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

  async getRfps(filters?: {
    search?: string;
    technologies?: string[];
    deadlineFilter?: string;
    budgetRange?: string;
    organizationTypes?: string[];
  }): Promise<Rfp[]> {
    let rfps = Array.from(this.rfps.values()).filter(rfp => rfp.isActive);

    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      rfps = rfps.filter(rfp => 
        rfp.title.toLowerCase().includes(searchLower) ||
        rfp.organization.toLowerCase().includes(searchLower) ||
        rfp.description.toLowerCase().includes(searchLower) ||
        rfp.technology.toLowerCase().includes(searchLower)
      );
    }

    if (filters?.technologies && filters.technologies.length > 0) {
      rfps = rfps.filter(rfp => 
        filters.technologies!.includes(rfp.technology)
      );
    }

    if (filters?.deadlineFilter && filters.deadlineFilter !== "all" && filters.deadlineFilter !== "") {
      const now = new Date();
      const filterDays = {
        "7": 7,
        "30": 30,
        "90": 90
      }[filters.deadlineFilter];

      if (filterDays) {
        const cutoffDate = new Date(now.getTime() + filterDays * 24 * 60 * 60 * 1000);
        rfps = rfps.filter(rfp => rfp.deadline <= cutoffDate);
      }
    }

    if (filters?.budgetRange && filters.budgetRange !== "any" && filters.budgetRange !== "") {
      const ranges = {
        "0-50000": [0, 50000],
        "50000-100000": [50000, 100000],
        "100000-500000": [100000, 500000],
        "500000+": [500000, Infinity]
      }[filters.budgetRange];

      if (ranges) {
        rfps = rfps.filter(rfp => {
          const minBudget = rfp.budgetMin || 0;
          const maxBudget = rfp.budgetMax || minBudget;
          return maxBudget >= ranges[0] && minBudget <= ranges[1];
        });
      }
    }

    if (filters?.organizationTypes && filters.organizationTypes.length > 0) {
      rfps = rfps.filter(rfp => 
        filters.organizationTypes!.includes(rfp.organizationType)
      );
    }

    // Sort by deadline (nearest first), then by Drupal priority
    return rfps.sort((a, b) => {
      if (a.isDrupal && !b.isDrupal) return -1;
      if (!a.isDrupal && b.isDrupal) return 1;
      return a.deadline.getTime() - b.deadline.getTime();
    });
  }

  async getRfp(id: string): Promise<Rfp | undefined> {
    return this.rfps.get(id);
  }

  async createRfp(insertRfp: InsertRfp): Promise<Rfp> {
    const id = randomUUID();
    const rfp: Rfp = {
      ...insertRfp,
      id,
      postedDate: new Date(),
      budgetMin: insertRfp.budgetMin ?? null,
      budgetMax: insertRfp.budgetMax ?? null,
      isDrupal: insertRfp.isDrupal ?? false,
      isActive: insertRfp.isActive ?? true,
    };
    this.rfps.set(id, rfp);
    return rfp;
  }
}

export const storage = new MemStorage();
