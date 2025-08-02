import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { 
  MapPin, 
  BookOpen, 
  Clock, 
  Globe,
  CheckCircle,
  Users,
  Target
} from "lucide-react";
import heroImage from "@/assets/hero-transport.jpg";

const Home = () => {
  const features = [
    {
      icon: <Globe className="h-8 w-8 text-accent" />,
      title: "Flexible Remote Jobs",
      description: "Work from anywhere with our remote-friendly positions"
    },
    {
      icon: <BookOpen className="h-8 w-8 text-accent" />,
      title: "Paid Training",
      description: "Comprehensive training programs to set you up for success"
    },
    {
      icon: <Clock className="h-8 w-8 text-accent" />,
      title: "Quick Application Process",
      description: "Simple, streamlined application that takes minutes"
    },
    {
      icon: <MapPin className="h-8 w-8 text-accent" />,
      title: "Nationwide Opportunities",
      description: "Opportunities across the country in transportation & logistics"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-hero text-white overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Transportation and logistics" 
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-hero opacity-80"></div>
        </div>
        
        <div className="relative container mx-auto px-4 py-24">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              Your Future in{" "}
              <span className="text-accent">Transport</span>{" "}
              Starts Here
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto">
              Join the leading transportation and logistics network. 
              Find your perfect role with competitive pay, comprehensive training, and growth opportunities.
            </p>
            <Link to="/careers">
              <Button variant="hero" size="xl" className="text-lg">
                Apply Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Zoomline Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
              Why Choose Zoomline?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We're committed to connecting exceptional talent with outstanding opportunities 
              in the transportation and logistics industry.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-medium hover:shadow-large transition-all duration-300 hover:scale-105">
                <CardContent className="p-8 text-center space-y-4">
                  <div className="flex justify-center">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-primary">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Visual Block / TikTok Section */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl md:text-5xl font-bold text-primary">
                See What Makes Us Different
              </h2>
              <p className="text-xl text-muted-foreground">
                Watch real stories from our team members and discover why Zoomline 
                is the preferred choice for transportation professionals.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-accent" />
                  <span className="text-lg">Real people, real opportunities</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-accent" />
                  <span className="text-lg">Transparent hiring process</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-accent" />
                  <span className="text-lg">Career growth guaranteed</span>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg p-8 shadow-large">
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="bg-accent/20 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                    <Users className="h-8 w-8 text-accent" />
                  </div>
                  <p className="text-muted-foreground">
                    TikTok embed or promotional video goes here
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <Target className="h-16 w-16 text-accent mx-auto" />
            <h2 className="text-4xl md:text-5xl font-bold">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-white/90">
              Join thousands of professionals who have found their perfect career 
              match through Zoomline. Your next opportunity is just one click away.
            </p>
            <Link to="/careers">
              <Button variant="hero" size="xl" className="text-lg">
                Explore Careers
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;