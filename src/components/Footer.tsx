import { Link } from "react-router-dom";
import { Mail, Truck } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-zoomline-lime p-2 rounded-lg">
                <Truck className="h-6 w-6 text-zoomline-navy" />
              </div>
              <span className="text-2xl font-bold">Zoomline</span>
            </Link>
            <p className="text-primary-foreground/80">
              Leading transportation and logistics recruitment agency connecting talent with opportunity.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <div className="space-y-2">
              <Link to="/" className="block text-primary-foreground/80 hover:text-accent transition-colors">
                Home
              </Link>
              <Link to="/careers" className="block text-primary-foreground/80 hover:text-accent transition-colors">
                Careers
              </Link>
              <Link to="/about" className="block text-primary-foreground/80 hover:text-accent transition-colors">
                About
              </Link>
              <Link to="/contact" className="block text-primary-foreground/80 hover:text-accent transition-colors">
                Contact
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact</h3>
            <div className="space-y-2">
              <a 
                href="mailto:support@zoomlinetransport.com" 
                className="flex items-center space-x-2 text-primary-foreground/80 hover:text-accent transition-colors"
              >
                <Mail className="h-4 w-4" />
                <span>support@zoomlinetransport.com</span>
              </a>
            </div>
          </div>

          {/* Social Media */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Follow Us</h3>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="text-primary-foreground/80 hover:text-accent transition-colors"
                aria-label="TikTok"
              >
                TikTok
              </a>
              <a 
                href="#" 
                className="text-primary-foreground/80 hover:text-accent transition-colors"
                aria-label="Instagram"
              >
                Instagram
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center">
          <p className="text-primary-foreground/60">
            &copy; 2024 Zoomline. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;