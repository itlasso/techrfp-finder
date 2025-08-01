import { type User, type InsertUser, type Rfp, type InsertRfp } from "@shared/schema";
import { randomUUID } from "crypto";
import { SamGovService } from "./sam-gov-service";

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
  private samGovService: SamGovService | null;
  private apiKey: string | null;

  constructor() {
    this.users = new Map();
    this.rfps = new Map();
    
    // Initialize SAM.gov service if API key is available
    this.apiKey = process.env.SAM_GOV_API_KEY || 'apbgf5Mx5PMy5ONi8UqMwo8NB6jNua8EyQSIzHac';
    this.samGovService = this.apiKey ? new SamGovService(this.apiKey) : null;
    
    this.initializeRfps();
  }

  private initializeRfps() {
    console.log('Initializing RFP data...');
    console.log('SAM.gov service available:', !!this.samGovService);
    console.log('API key configured:', !!this.apiKey);
    
    // Start with immediate demo data, then load real data asynchronously
    this.seedDemoRfps();
    
    if (this.samGovService) {
      console.log('Starting real RFP data loading...');
      // Load real data in background and replace demo data when available
      this.loadRealRfps().catch(error => {
        console.error('Failed to load real RFP data, continuing with demo data:', error);
      });
    } else {
      console.log('SAM.gov service not available, using demo data only');
    }
  }

  private async loadRealRfps() {
    try {
      console.log('Loading real RFP data from SAM.gov...');
      
      // Test API connectivity first
      console.log('Testing SAM.gov API connectivity...');
      
      const testResponse = await this.samGovService!.searchOpportunities({
        title: 'software',
        postedFrom: '01/01/2024',
        postedTo: '08/01/2025',
        limit: 1,
      });
      
      console.log(`API test successful. Total records available: ${testResponse.totalRecords}`);
      
      // Search for technology-related opportunities in the last 6 months
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      
      const today = new Date();
      
      // Search for various technology-related opportunities
      const searches = [
        { title: 'website', limit: 15 },
        { title: 'software development', limit: 15 },
        { title: 'web application', limit: 10 },
        { title: 'information technology', limit: 10 },
        { ncode: '541511', limit: 15 }, // Custom Programming Services
        { ncode: '541512', limit: 15 }, // Computer Systems Design
      ];

      let totalLoaded = 0;
      
      // Clear existing demo data before loading real data
      this.rfps.clear();
      
      for (const search of searches) {
        try {
          const response = await this.samGovService!.searchOpportunities({
            ...search,
            postedFrom: this.formatDate(sixMonthsAgo),
            postedTo: this.formatDate(today),
          });

          console.log(`Found ${response.opportunitiesData.length} opportunities for search: ${JSON.stringify(search)}`);

          for (const opportunity of response.opportunitiesData) {
            if (opportunity.active === 'Yes' && opportunity.responseDeadLine) {
              const deadlineDate = new Date(opportunity.responseDeadLine);
              // Only include opportunities with future deadlines
              if (deadlineDate > new Date()) {
                const rfp = this.samGovService!.convertToRfp(opportunity);
                const rfpWithId: Rfp = {
                  id: randomUUID(),
                  ...rfp,
                };
                this.rfps.set(rfpWithId.id, rfpWithId);
                totalLoaded++;
              }
            }
          }

          // Add delay between requests to respect rate limits
          await new Promise(resolve => setTimeout(resolve, 1200));
          
        } catch (error) {
          console.warn(`Failed to load RFPs for search ${JSON.stringify(search)}:`, error);
        }
      }

      console.log(`Successfully loaded ${totalLoaded} real RFP opportunities from SAM.gov`);
      
      // If we didn't get enough real data, add some demo data for UI completeness
      if (totalLoaded < 5) {
        console.log('Supplementing with demo data for complete UI experience...');
        this.addSelectDemoRfps();
      }
      
    } catch (error) {
      console.error('Error loading real RFP data:', error);
      if (error instanceof Error) {
        console.error('Error details:', error.message);
        
        // Provide specific guidance based on error type
        if (error.message.includes('403')) {
          console.log('API access issue detected. The SAM.gov API key may need renewal or additional permissions.');
          console.log('Contact SAM.gov support for API access verification.');
        } else if (error.message.includes('401')) {
          console.log('Authentication failed. Please verify the SAM.gov API key is correct.');
        } else if (error.message.includes('rate limit')) {
          console.log('API rate limit reached. Will retry later with exponential backoff.');
        }
      }
      console.log('Using professional demo data while API access is resolved...');
    }
  }

  // Add a few high-quality demo RFPs to supplement real data
  private addSelectDemoRfps() {
    const supplementalRfps: InsertRfp[] = [
      {
        title: "State University CMS Migration to Drupal",
        organization: "California State University System",
        description: "Migration of existing legacy CMS to modern Drupal 10 platform. Includes content migration, custom module development, accessibility compliance (WCAG 2.1 AA), and staff training. Must integrate with existing student information systems and maintain SEO rankings during transition.",
        technology: "Drupal",
        budgetMin: 180000,
        budgetMax: 250000,
        deadline: new Date("2025-09-30"),
        location: "California, USA",
        organizationType: "Education",
        contactEmail: null,
        organizationWebsite: null,
        documentUrl: null,
        isDrupal: true,
        isActive: true,
      },
      {
        title: "Municipal Website Modernization",
        organization: "City of Austin Technology Services",
        description: "Complete redesign and development of city government website using modern CMS. Requirements include bilingual support, accessibility compliance, citizen service portals, and integration with existing municipal systems. WordPress or Drupal preferred.",
        technology: "WordPress",
        budgetMin: 120000,
        budgetMax: 180000,
        deadline: new Date("2025-08-15"),
        location: "Austin, Texas",
        organizationType: "Government",
        contactEmail: null,
        organizationWebsite: null,
        documentUrl: null,
        isDrupal: false,
        isActive: true,
      }
    ];

    for (const rfp of supplementalRfps) {
      const id = randomUUID();
      const fullRfp: Rfp = {
        ...rfp,
        id,
        postedDate: new Date(Date.now() - Math.random() * 15 * 24 * 60 * 60 * 1000), // Random date within last 15 days
        budgetMin: rfp.budgetMin ?? null,
        budgetMax: rfp.budgetMax ?? null,
        contactEmail: rfp.contactEmail ?? null,
        organizationWebsite: rfp.organizationWebsite ?? null,
        documentUrl: rfp.documentUrl ?? null,
        isDrupal: rfp.isDrupal ?? false,
        isActive: rfp.isActive ?? true,
      };
      this.rfps.set(id, fullRfp);
    }
  }

  private formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
  }

  private seedDemoRfps() {
    const mockRfps: InsertRfp[] = [
      {
        title: "University Website Redesign & Development",
        organization: "State University of Technology",
        description: "Seeking experienced Drupal developers to redesign and redevelop the university's main website. Requirements include custom module development, integration with student information systems, accessibility compliance, and responsive design. Must have experience with Drupal 10, custom theme development, and higher education requirements.",
        technology: "Drupal",
        budgetMin: 150000,
        budgetMax: 200000,
        deadline: new Date("2025-09-15"),
        location: "California, USA",
        organizationType: "Education",
        contactEmail: "procurement@statetech.edu",
        organizationWebsite: "https://www.statetech.edu",
        documentUrl: "https://www.statetech.edu/procurement/rfp-website-redesign.pdf",
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
        deadline: new Date("2025-08-20"),
        location: "New York, USA",
        organizationType: "Private",
        contactEmail: "tech@greenearthretailers.com",
        organizationWebsite: "https://www.greenearthretailers.com",
        documentUrl: "https://www.greenearthretailers.com/procurement/ecommerce-rfp.pdf",
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
        deadline: new Date("2025-08-30"),
        location: "Texas, USA",
        organizationType: "Private",
        contactEmail: "projects@techflow.com",
        organizationWebsite: "https://www.techflow.com",
        documentUrl: "https://www.techflow.com/rfp/customer-portal-requirements.pdf",
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
        deadline: new Date("2025-08-25"),
        location: "Florida, USA",
        organizationType: "Non-profit",
        contactEmail: "it@regionalmedical.org",
        organizationWebsite: "https://www.regionalmedical.org",
        documentUrl: "https://www.regionalmedical.org/procurement/healthcare-data-system-rfp.pdf",
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
        deadline: new Date("2025-09-10"),
        location: "Washington, USA",
        organizationType: "Government",
        contactEmail: "tech@cityplanning.gov",
        organizationWebsite: "https://www.cityplanning.gov",
        documentUrl: "https://www.cityplanning.gov/rfp/data-analytics-platform.pdf",
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
        deadline: new Date("2025-09-05"),
        location: "Illinois, USA",
        organizationType: "Government",
        contactEmail: "digital@metrolibraries.org",
        organizationWebsite: "https://www.metrolibraries.org",
        documentUrl: "https://www.metrolibraries.org/rfp/community-portal-enhancement.pdf",
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
        deadline: new Date("2025-08-15"),
        location: "Oregon, USA",
        organizationType: "Non-profit",
        contactEmail: "tech@globalclimate.org",
        organizationWebsite: "https://www.globalclimate.org",
        documentUrl: "https://www.globalclimate.org/rfp/fundraising-platform-requirements.pdf",
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
        deadline: new Date("2025-10-01"),
        location: "Michigan, USA",
        organizationType: "Private",
        contactEmail: "erp@mfgsolutions.com",
        organizationWebsite: "https://www.mfgsolutions.com",
        documentUrl: "https://www.mfgsolutions.com/procurement/erp-system-rfp.pdf",
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
        contactEmail: rfp.contactEmail ?? null,
        organizationWebsite: rfp.organizationWebsite ?? null,
        documentUrl: rfp.documentUrl ?? null,
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
      contactEmail: insertRfp.contactEmail ?? null,
      isDrupal: insertRfp.isDrupal ?? false,
      isActive: insertRfp.isActive ?? true,
    };
    this.rfps.set(id, rfp);
    return rfp;
  }
}

export const storage = new MemStorage();
