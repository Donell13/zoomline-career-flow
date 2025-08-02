import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, DollarSign, Shield } from "lucide-react";
import { useState } from "react";
import JobApplicationModal from "@/components/JobApplicationModal";

const Careers = () => {
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const jobs = [
    {
      id: "remote-driver",
      title: "Remote Driver",
      location: "Nationwide",
      type: "Full-time",
      salary: "$55,000 - $75,000",
      description: "Seeking experienced drivers for long-haul routes with flexible scheduling and excellent benefits.",
      requirements: [
        "Valid CDL Class A license",
        "2+ years driving experience",
        "Clean driving record",
        "DOT medical certification"
      ],
      benefits: [
        "Health insurance",
        "401(k) matching",
        "Paid time off",
        "Performance bonuses"
      ]
    },
    {
      id: "dispatch-assistant",
      title: "Dispatch Assistant",
      location: "Remote",
      type: "Full-time",
      salary: "$40,000 - $50,000",
      description: "Support our dispatch team in coordinating routes, managing schedules, and ensuring efficient operations.",
      requirements: [
        "High school diploma or equivalent",
        "Strong communication skills",
        "Computer proficiency",
        "Attention to detail"
      ],
      benefits: [
        "Remote work opportunity",
        "Health insurance",
        "Paid training",
        "Career advancement"
      ]
    }
  ];

  const handleApplyClick = (jobId: string) => {
    setSelectedJob(jobId);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <section className="bg-gradient-primary text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Join the Zoomline Team
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Discover your next career opportunity in transportation and logistics. 
            We offer competitive packages, comprehensive training, and real growth potential.
          </p>
        </div>
      </section>

      {/* Job Listings */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            {jobs.map((job) => (
              <Card key={job.id} className="shadow-medium hover:shadow-large transition-all duration-300">
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <CardTitle className="text-2xl text-primary mb-2">
                        {job.title}
                      </CardTitle>
                      <div className="flex flex-wrap gap-4 text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{job.type}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <DollarSign className="h-4 w-4" />
                          <span>{job.salary}</span>
                        </div>
                      </div>
                    </div>
                    <Button 
                      variant="cta" 
                      size="lg"
                      onClick={() => handleApplyClick(job.id)}
                    >
                      Apply Now
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  <p className="text-lg text-muted-foreground">
                    {job.description}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-primary mb-3">Requirements:</h4>
                      <ul className="space-y-2">
                        {job.requirements.map((req, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <Badge variant="outline" className="mt-0.5">•</Badge>
                            <span className="text-muted-foreground">{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-primary mb-3">Benefits:</h4>
                      <ul className="space-y-2">
                        {job.benefits.map((benefit, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <Badge variant="outline" className="mt-0.5">✓</Badge>
                            <span className="text-muted-foreground">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* ID Verification Notice */}
          <div className="max-w-4xl mx-auto mt-12">
            <Card className="border-accent/20 bg-accent/5">
              <CardContent className="p-8">
                <div className="flex items-start space-x-4">
                  <Shield className="h-8 w-8 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold text-primary mb-2">
                      Identity Verification Required
                    </h3>
                    <p className="text-muted-foreground">
                      After applying, you'll be prompted to verify your identity as part of our 
                      secure hiring process. This helps us ensure the safety and security of all 
                      our team members and partners.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <JobApplicationModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        jobId={selectedJob}
        jobTitle={jobs.find(job => job.id === selectedJob)?.title || ""}
      />
    </div>
  );
};

export default Careers;