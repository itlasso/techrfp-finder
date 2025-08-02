import type { Rfp, InsertRfp } from "@shared/schema";

export interface SamGovOpportunity {
  noticeId: string;
  title: string;
  solicitationNumber: string;
  fullParentPathName: string;
  postedDate: string;
  type: string;
  responseDeadLine: string;
  naicsCode: string;
  description: string;
  active: string;
  data?: {
    pointOfContact?: Array<{
      email?: string;
      fullname?: string;
      title?: string;
      phone?: string;
    }>;
    placeOfPerformance?: {
      city?: { name?: string };
      state?: { name?: string };
    };
    officeAddress?: {
      city?: string;
      state?: string;
    };
  };
  uiLink?: string;
  resourceLinks?: string[];
}

export interface SamGovResponse {
  totalRecords: number;
  limit: number;
  offset: number;
  opportunitiesData: SamGovOpportunity[];
}

export class SamGovService {
  private readonly apiKey: string;
  private readonly baseUrl = 'https://api.sam.gov/prod/opportunities/v2/search';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async searchOpportunities(params: {
    keywords?: string[];
    limit?: number;
    offset?: number;
  }): Promise<Rfp[]> {
    // Set date range for recent opportunities (last 30 days to next 120 days)
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + 120);

    // SAM.gov v2 API requires MM/dd/yyyy date format
    const formatDate = (date: Date) => {
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${month}/${day}/${year}`;
    };

    const searchParams = new URLSearchParams({
      postedFrom: formatDate(thirtyDaysAgo),
      postedTo: formatDate(futureDate),
      limit: (params.limit || 50).toString(),
      offset: (params.offset || 0).toString(),
    });

    // Add technology-related keywords to find relevant opportunities
    if (params.keywords?.length) {
      searchParams.append('title', params.keywords.join(' OR '));
    }

    // Add API key as required URL parameter for v2 API
    searchParams.append('api_key', this.apiKey);
    const url = `${this.baseUrl}?${searchParams.toString()}`;
    
    try {
      const headers: Record<string, string> = {
        'Accept': 'application/json',
        'User-Agent': 'TechRFP-Finder/1.0',
      };

      console.log(`Testing SAM.gov API with URL: ${url}`);
      console.log(`Using API key: ${this.apiKey.substring(0, 8)}...`);
      
      const response = await fetch(url, { headers });
      
      console.log(`SAM.gov API response status: ${response.status}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`SAM.gov API error response: ${errorText}`);
        throw new Error(`SAM.gov API error: ${response.status} ${response.statusText}`);
      }
      
      const data: SamGovResponse = await response.json();
      console.log(`SAM.gov API success: Retrieved ${data.opportunitiesData?.length || 0} opportunities`);
      
      // Convert SAM.gov opportunities to our RFP format
      const rfps: Rfp[] = data.opportunitiesData?.map(opp => ({
        id: opp.noticeId,
        ...this.convertToRfp(opp)
      })) || [];
      
      return rfps;
    } catch (error) {
      console.error('Error fetching from SAM.gov API:', error);
      throw error;
    }
  }

  // Convert SAM.gov opportunity to our RFP format
  convertToRfp(opportunity: SamGovOpportunity): Omit<Rfp, 'id'> {
    // Extract technology from title and NAICS code
    const technology = this.extractTechnology(opportunity.title, opportunity.naicsCode);
    
    // Determine organization type from the parent path
    const organizationType = this.determineOrgType(opportunity.fullParentPathName);
    
    // Extract location from place of performance or office address
    const location = this.extractLocation(opportunity);
    
    // Extract contact email from point of contact
    const contactEmail = opportunity.data?.pointOfContact?.[0]?.email || '';
    
    // Create organization website from government domain
    const organizationWebsite = this.generateGovWebsite(opportunity.fullParentPathName);
    
    // Generate authentic government document URL
    const documentUrl = opportunity.uiLink || 
      `https://sam.gov/opp/${opportunity.noticeId}/view` ||
      opportunity.resourceLinks?.[0];

    return {
      title: opportunity.title,
      organization: this.extractOrganization(opportunity.fullParentPathName),
      description: `Federal procurement opportunity: ${opportunity.title}. Solicitation Number: ${opportunity.solicitationNumber}. Posted on ${opportunity.postedDate}. This is an active federal contracting opportunity. Please review the full solicitation documents for detailed requirements and submission instructions.`,
      technology,
      budgetMin: this.estimateBudget(opportunity.naicsCode, 'min'),
      budgetMax: this.estimateBudget(opportunity.naicsCode, 'max'),
      deadline: new Date(opportunity.responseDeadLine || this.addDays(new Date(), 30)),
      postedDate: new Date(opportunity.postedDate),
      location,
      organizationType,
      contactEmail: contactEmail || null,
      organizationWebsite: organizationWebsite || null,
      documentUrl: documentUrl || null,
      isDrupal: technology.toLowerCase().includes('drupal'),
      isActive: opportunity.active === 'Yes',
    };
  }

  private extractTechnology(title: string, naicsCode: string): string {
    const titleLower = title.toLowerCase();
    
    // Technology keyword mapping
    if (titleLower.includes('drupal')) return 'Drupal';
    if (titleLower.includes('wordpress')) return 'WordPress';
    if (titleLower.includes('react') || titleLower.includes('javascript') || titleLower.includes('web app')) return 'React';
    if (titleLower.includes('python') || titleLower.includes('django')) return 'Python';
    if (titleLower.includes('java') || titleLower.includes('spring')) return 'Java';
    if (titleLower.includes('php') || titleLower.includes('laravel')) return 'PHP';
    if (titleLower.includes('angular')) return 'Angular';
    if (titleLower.includes('vue')) return 'Vue.js';
    if (titleLower.includes('.net') || titleLower.includes('c#')) return '.NET';
    
    // NAICS code-based technology mapping
    if (naicsCode?.startsWith('541511')) return 'Software Development'; // Custom Computer Programming Services
    if (naicsCode?.startsWith('541512')) return 'System Design'; // Computer Systems Design Services
    if (naicsCode?.startsWith('518210')) return 'Web Services'; // Data Processing, Hosting, and Related Services
    
    // Default based on common web development terms
    if (titleLower.includes('website') || titleLower.includes('web') || titleLower.includes('portal')) {
      return 'Web Development';
    }
    
    return 'Technology Services';
  }

  private determineOrgType(fullParentPathName: string): string {
    const orgPath = fullParentPathName.toLowerCase();
    
    if (orgPath.includes('education') || orgPath.includes('university') || orgPath.includes('school')) {
      return 'Education';
    }
    if (orgPath.includes('health') || orgPath.includes('medical') || orgPath.includes('hospital')) {
      return 'Healthcare';
    }
    if (orgPath.includes('defense') || orgPath.includes('army') || orgPath.includes('navy') || orgPath.includes('air force')) {
      return 'Defense';
    }
    
    return 'Government';
  }

  private extractLocation(opportunity: SamGovOpportunity): string {
    const pop = opportunity.data?.placeOfPerformance;
    const office = opportunity.data?.officeAddress;
    
    if (pop?.city?.name && pop?.state?.name) {
      return `${pop.city.name}, ${pop.state.name}`;
    }
    if (office?.city && office?.state) {
      return `${office.city}, ${office.state}`;
    }
    
    return 'Washington, DC'; // Default for federal opportunities
  }

  private extractOrganization(fullParentPathName: string): string {
    // Extract the main department/agency name
    const parts = fullParentPathName.split('.');
    return parts[0]?.trim() || 'Federal Agency';
  }

  private generateGovWebsite(fullParentPathName: string): string {
    const orgName = this.extractOrganization(fullParentPathName).toLowerCase();
    
    // Common government website patterns
    if (orgName.includes('education')) return 'https://www.ed.gov';
    if (orgName.includes('health')) return 'https://www.hhs.gov';
    if (orgName.includes('defense')) return 'https://www.defense.gov';
    if (orgName.includes('homeland')) return 'https://www.dhs.gov';
    if (orgName.includes('commerce')) return 'https://www.commerce.gov';
    if (orgName.includes('agriculture')) return 'https://www.usda.gov';
    if (orgName.includes('interior')) return 'https://www.doi.gov';
    if (orgName.includes('justice')) return 'https://www.justice.gov';
    if (orgName.includes('labor')) return 'https://www.dol.gov';
    if (orgName.includes('state')) return 'https://www.state.gov';
    if (orgName.includes('treasury')) return 'https://www.treasury.gov';
    if (orgName.includes('veterans')) return 'https://www.va.gov';
    if (orgName.includes('transportation')) return 'https://www.transportation.gov';
    if (orgName.includes('energy')) return 'https://www.energy.gov';
    if (orgName.includes('housing')) return 'https://www.hud.gov';
    if (orgName.includes('gsa') || orgName.includes('general services')) return 'https://www.gsa.gov';
    
    return 'https://www.usa.gov'; // Default government website
  }

  private estimateBudget(naicsCode: string, type: 'min' | 'max'): number {
    // Budget estimation based on NAICS codes and typical government contract values
    const baseAmounts: Record<string, { min: number; max: number }> = {
      '541511': { min: 100000, max: 500000 }, // Custom Programming
      '541512': { min: 200000, max: 1000000 }, // Systems Design
      '518210': { min: 150000, max: 750000 }, // Web Services
      'default': { min: 75000, max: 300000 }
    };

    const amounts = baseAmounts[naicsCode] || baseAmounts['default'];
    return amounts[type];
  }

  private addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
}