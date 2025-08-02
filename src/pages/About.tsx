import { Card, CardContent } from "@/components/ui/card";
import { Target, Users, TrendingUp, Shield, Award, Globe } from "lucide-react";
import teamPhoto from "@/assets/team-photo.jpg";
import fleetPhoto from "@/assets/fleet-photo.jpg";

const About = () => {
  const values = [
    {
      icon: <Shield className="h-12 w-12 text-accent" />,
      title: "Integrity",
      description: "We build trust through transparency, honesty, and ethical practices in every interaction."
    },
    {
      icon: <Target className="h-12 w-12 text-accent" />,
      title: "Opportunity",
      description: "We create pathways for growth and success, connecting talent with the right positions."
    },
    {
      icon: <TrendingUp className="h-12 w-12 text-accent" />,
      title: "Growth",
      description: "We're committed to the continuous development of our team members and partners."
    }
  ];

  const stats = [
    { number: "500+", label: "Successful Placements" },
    { number: "50+", label: "Partner Companies" },
    { number: "95%", label: "Client Satisfaction" },
    { number: "24/7", label: "Support Available" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-primary text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            About Zoomline
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Leading the future of transportation and logistics recruitment through 
            innovation, integrity, and unwavering commitment to excellence.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl font-bold text-primary mb-6">Our Mission</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  To revolutionize the transportation and logistics industry by connecting 
                  exceptional talent with outstanding opportunities. We bridge the gap between 
                  skilled professionals and forward-thinking companies, creating partnerships 
                  that drive mutual success and industry advancement.
                </p>
              </div>
              
              <div>
                <h2 className="text-4xl font-bold text-primary mb-6">Our Vision</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  To become the most trusted and innovative recruitment partner in the 
                  transportation and logistics sector, known for our commitment to quality, 
                  reliability, and transformative career solutions that shape the future 
                  of the industry.
                </p>
              </div>
            </div>

            <div className="relative">
              <img 
                src={teamPhoto} 
                alt="Zoomline team" 
                className="rounded-lg shadow-large w-full"
              />
              <div className="absolute inset-0 bg-gradient-primary opacity-10 rounded-lg"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
              Our Core Values
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              These principles guide everything we do and shape how we serve our 
              candidates and partners.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center shadow-medium hover:shadow-large transition-all duration-300">
                <CardContent className="p-8 space-y-6">
                  <div className="flex justify-center">
                    {value.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-primary">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Overview */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <img 
                src={fleetPhoto} 
                alt="Transportation fleet" 
                className="rounded-lg shadow-large w-full"
              />
              <div className="absolute inset-0 bg-gradient-primary opacity-10 rounded-lg"></div>
            </div>

            <div className="space-y-8">
              <h2 className="text-4xl font-bold text-primary">
                Industry Excellence
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                With years of experience in the transportation and logistics sector, 
                Zoomline has established itself as a premier recruitment agency. Our 
                deep industry knowledge and extensive network allow us to match the 
                right talent with the right opportunities.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Award className="h-6 w-6 text-accent" />
                  <span className="text-lg">Certified industry specialists</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="h-6 w-6 text-accent" />
                  <span className="text-lg">Dedicated account management</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Globe className="h-6 w-6 text-accent" />
                  <span className="text-lg">Nationwide coverage</span>
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
            <h2 className="text-4xl md:text-5xl font-bold">
              Ready to Join Our Success Story?
            </h2>
            <p className="text-xl text-white/90">
              Discover how Zoomline can help you achieve your career goals in 
              transportation and logistics.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;