import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Calendar, Clock, MapPin, DollarSign, Building, Users, Globe, FileText, Download, ExternalLink, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import type { Rfp } from "@shared/schema";

export default function RfpDetail() {
  const params = useParams();
  const [location, navigate] = useLocation();
  const rfpId = params.id;
  const [documentDialogOpen, setDocumentDialogOpen] = useState(false);
  const [websiteDialogOpen, setWebsiteDialogOpen] = useState(false);
  const [contactDialogOpen, setContactDialogOpen] = useState(false);

  const { data: rfp, isLoading, error } = useQuery<Rfp>({
    queryKey: ["/api/rfps", rfpId],
    queryFn: async () => {
      const response = await fetch(`/api/rfps/${rfpId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch RFP details");
      }
      return response.json();
    },
    enabled: !!rfpId,
  });

  const formatBudget = (min?: number | null, max?: number | null) => {
    if (!min && !max) return "Budget not specified";
    if (min && max) {
      return `$${(min / 1000).toFixed(0)}K - $${(max / 1000).toFixed(0)}K`;
    }
    if (min) return `$${(min / 1000).toFixed(0)}K+`;
    return `Up to $${(max! / 1000).toFixed(0)}K`;
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric"
    });
  };

  const getDaysUntilDeadline = (deadline: Date) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getTechnologyColor = (technology: string) => {
    switch (technology.toLowerCase()) {
      case "drupal": return "bg-brand-orange";
      case "wordpress": return "bg-blue-500";
      case "react": return "bg-cyan-500";
      case "angular": return "bg-red-500";
      case "python": return "bg-green-600";
      case "node.js": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  const handleDownloadDocument = () => {
    setDocumentDialogOpen(true);
  };

  const handleVisitWebsite = () => {
    setWebsiteDialogOpen(true);
  };

  const handleContactInfo = () => {
    setContactDialogOpen(true);
  };

  const getDeadlineColor = (daysUntil: number) => {
    if (daysUntil <= 7) return "bg-red-100 text-red-800";
    if (daysUntil <= 14) return "bg-yellow-100 text-yellow-800";
    return "bg-green-100 text-green-800";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center py-12">
            <div className="loading-spinner w-8 h-8 border-4 border-gray-200 border-t-brand-orange rounded-full"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !rfp) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">RFP Not Found</h2>
            <p className="text-gray-600 mb-6">The RFP you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate("/")} className="bg-brand-orange text-white hover:bg-brand-orange">
              Back to Search
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const daysUntilDeadline = getDaysUntilDeadline(rfp.deadline);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/")}
            className="text-brand-teal hover:text-brand-teal"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Search
          </Button>
        </div>

        {/* RFP Header */}
        <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8 ${
          rfp.isDrupal ? "border-l-4 border-l-brand-orange" : ""
        }`}>
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-6">
            <div className="flex-1">
              <div className="flex items-center mb-4">
                <Badge className={`${getTechnologyColor(rfp.technology)} text-white text-sm font-semibold mr-3`}>
                  {rfp.technology.toUpperCase()}
                </Badge>
                <Badge className={`text-sm font-medium ${getDeadlineColor(daysUntilDeadline)}`}>
                  Due in {daysUntilDeadline} days
                </Badge>
                {rfp.isDrupal && (
                  <Badge className="bg-brand-orange text-white text-sm font-semibold ml-2">
                    ⭐ DRUPAL PRIORITY
                  </Badge>
                )}
              </div>
              <h1 className="text-3xl font-bold text-black mb-3">{rfp.title}</h1>
              <p className="text-xl text-gray-600 mb-4">{rfp.organization}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 mb-1">Budget Range</p>
              <p className="text-2xl font-bold text-brand-teal">
                {formatBudget(rfp.budgetMin, rfp.budgetMax)}
              </p>
            </div>
          </div>

          {/* Key Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="flex items-center">
              <Calendar className="w-5 h-5 text-brand-teal mr-3" />
              <div>
                <p className="text-sm text-gray-500">Posted</p>
                <p className="font-medium">{formatDate(rfp.postedDate)}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Clock className="w-5 h-5 text-red-500 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Deadline</p>
                <p className="font-medium">{formatDate(rfp.deadline)}</p>
              </div>
            </div>
            <div className="flex items-center">
              <MapPin className="w-5 h-5 text-green-500 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium">{rfp.location}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Building className="w-5 h-5 text-blue-500 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Type</p>
                <p className="font-medium">{rfp.organizationType}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Dialog open={documentDialogOpen} onOpenChange={setDocumentDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-brand-orange text-white hover:bg-brand-orange/90 flex-1">
                  <FileText className="w-4 h-4 mr-2" />
                  Download RFP Document
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="flex items-center">
                    <Download className="w-5 h-5 mr-2" />
                    RFP Document Download
                  </DialogTitle>
                  <DialogDescription>
                    Download the official RFP document with detailed requirements and specifications.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-lg mb-2">{rfp?.title}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div><span className="font-medium">Organization:</span> {rfp?.organization}</div>
                      <div><span className="font-medium">Technology:</span> {rfp?.technology}</div>
                      <div><span className="font-medium">Budget:</span> {formatBudget(rfp?.budgetMin, rfp?.budgetMax)}</div>
                      <div><span className="font-medium">Deadline:</span> {rfp && formatDate(rfp.deadline)}</div>
                    </div>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-green-800 font-medium mb-2">Official RFP Documentation</p>
                    <p className="text-green-700 text-sm">
                      Complete RFP documentation including technical specifications, submission requirements, 
                      evaluation criteria, and procurement guidelines. Business email required for download access.
                    </p>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-800 font-medium mb-2">Local Development Notice</p>
                    <p className="text-blue-700 text-sm">
                      In production, clicking this button would download the actual RFP document. 
                      For local development, please contact the organization directly using the provided email address.
                    </p>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p><span className="font-medium">Contact Email:</span> {rfp?.contactEmail}</p>
                    <p><span className="font-medium">Organization Website:</span> {rfp?.organizationWebsite}</p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={websiteDialogOpen} onOpenChange={setWebsiteDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="border-brand-teal text-brand-teal hover:bg-brand-teal hover:text-white">
                  <Globe className="w-4 h-4 mr-2" />
                  Visit Organization Website
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="flex items-center">
                    <ExternalLink className="w-5 h-5 mr-2" />
                    Organization Website
                  </DialogTitle>
                  <DialogDescription>
                    Visit the organization's official website to learn more about their mission and projects.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-lg mb-3">{rfp?.organization}</h3>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium">Location:</span> {rfp?.location}</div>
                      <div><span className="font-medium">Type:</span> {rfp?.organizationType}</div>
                      {rfp?.contactEmail && (
                        <div><span className="font-medium">Email:</span> {rfp.contactEmail}</div>
                      )}
                    </div>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-800 font-medium mb-2">Organization Information</p>
                    <p className="text-blue-700 text-sm">
                      Visit the organization's official website to learn more about their mission, 
                      current projects, procurement processes, and vendor registration requirements.
                    </p>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p><span className="font-medium">Website:</span> {rfp?.organizationWebsite}</p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={contactDialogOpen} onOpenChange={setContactDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="border-gray-300">
                  <Users className="w-4 h-4 mr-2" />
                  Contact Information
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="flex items-center">
                    <Mail className="w-5 h-5 mr-2" />
                    Contact Information
                  </DialogTitle>
                  <DialogDescription>
                    Get in touch with the organization to express interest and ask questions about this RFP.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-lg mb-3">{rfp?.organization}</h3>
                    <div className="space-y-2">
                      <div><span className="font-medium">Location:</span> {rfp?.location}</div>
                      <div><span className="font-medium">Organization Type:</span> {rfp?.organizationType}</div>
                      {rfp?.contactEmail && (
                        <div className="flex items-center">
                          <span className="font-medium mr-2">Email:</span>
                          <a 
                            href={`mailto:${rfp.contactEmail}?subject=${encodeURIComponent(`Inquiry about RFP: ${rfp.title}`)}`}
                            className="text-brand-teal hover:underline"
                          >
                            {rfp.contactEmail}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-green-800 font-medium mb-2">Ready to Apply?</p>
                    <p className="text-green-700 text-sm mb-3">
                      Contact the organization directly to express your interest and get additional 
                      information about the RFP requirements and submission process.
                    </p>
                    {rfp?.contactEmail && (
                      <Button 
                        onClick={() => {
                          const subject = encodeURIComponent(`Inquiry about RFP: ${rfp.title}`);
                          const body = encodeURIComponent(`Hello,

I am interested in the RFP "${rfp.title}" and would like to get more information about the project requirements and submission process.

Organization: ${rfp.organization}
Technology: ${rfp.technology}
Deadline: ${formatDate(rfp.deadline)}

Please provide additional details or clarification as needed.

Best regards`);
                          window.location.href = `mailto:${rfp.contactEmail}?subject=${subject}&body=${body}`;
                        }}
                        className="bg-green-600 text-white hover:bg-green-700"
                        size="sm"
                      >
                        <Mail className="w-4 h-4 mr-2" />
                        Send Inquiry Email
                      </Button>
                    )}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Description Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-black mb-4">Project Description</h2>
          <div className="prose max-w-none">
            <p className="text-gray-700 leading-relaxed text-lg mb-6">
              {rfp.description}
            </p>
            
            {/* Additional project details */}
            <div className="bg-gray-50 rounded-lg p-6 mt-6">
              <h3 className="text-lg font-semibold text-black mb-3">Key Requirements</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Technology stack: {rfp.technology}</li>
                <li>• Organization type: {rfp.organizationType}</li>
                <li>• Project location: {rfp.location}</li>
                <li>• Submission deadline: {formatDate(rfp.deadline)}</li>
                {rfp.budgetMin && <li>• Minimum budget: ${(rfp.budgetMin / 1000).toFixed(0)}K</li>}
                {rfp.budgetMax && <li>• Maximum budget: ${(rfp.budgetMax / 1000).toFixed(0)}K</li>}
              </ul>
            </div>
          </div>
        </div>

        {/* Contact & Application Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-black mb-4">How to Apply</h2>
          <div className="bg-blue-50 rounded-lg p-6 mb-6">
            <p className="text-blue-800 font-medium mb-2">
              Application Deadline: {formatDate(rfp.deadline)} ({daysUntilDeadline} days remaining)
            </p>
            <p className="text-blue-700">
              Make sure to submit your proposal before the deadline to be considered for this opportunity.
            </p>
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-black mb-2">Organization Contact</h3>
              <p className="text-gray-700">{rfp.organization}</p>
              <p className="text-gray-600">{rfp.location}</p>
              {rfp.contactEmail && (
                <p className="text-brand-teal font-medium mt-1">
                  Email: <a 
                    href={`mailto:${rfp.contactEmail}?subject=${encodeURIComponent(`Inquiry about RFP: ${rfp.title}`)}`}
                    className="hover:underline cursor-pointer"
                  >
                    {rfp.contactEmail}
                  </a>
                </p>
              )}
              {rfp.organizationWebsite && (
                <p className="text-brand-teal font-medium">
                  Website: <a 
                    href={rfp.organizationWebsite} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="hover:underline cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      // Show organization info instead of broken demo links
                      alert(`🌐 Organization Website

${rfp.organization}
Location: ${rfp.location}
Type: ${rfp.organizationType}
${rfp.contactEmail ? `Email: ${rfp.contactEmail}` : ''}

In a real application, this would open their official website.

Website: ${rfp.organizationWebsite}`);
                    }}
                  >
                    {rfp.organizationWebsite.replace('https://', '').replace('http://', '')}
                  </a>
                </p>
              )}
            </div>
            
            <div>
              <h3 className="font-semibold text-black mb-2">Next Steps</h3>
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li>Download the complete RFP document using the button above</li>
                <li>Review all requirements and submission guidelines</li>
                <li>Prepare your proposal according to the specifications</li>
                <li>Submit your application before the deadline</li>
              </ol>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}