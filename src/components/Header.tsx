import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { Truck } from "lucide-react";

const Header = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-background border-b shadow-soft sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-gradient-primary p-2 rounded-lg">
              <Truck className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-primary">Zoomline</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link
              to="/"
              className={`font-medium transition-colors duration-200 ${
                isActive("/")
                  ? "text-primary border-b-2 border-accent"
                  : "text-muted-foreground hover:text-primary"
              }`}
            >
              Home
            </Link>
            <Link
              to="/careers"
              className={`font-medium transition-colors duration-200 ${
                isActive("/careers")
                  ? "text-primary border-b-2 border-accent"
                  : "text-muted-foreground hover:text-primary"
              }`}
            >
              Careers
            </Link>
            <Link
              to="/about"
              className={`font-medium transition-colors duration-200 ${
                isActive("/about")
                  ? "text-primary border-b-2 border-accent"
                  : "text-muted-foreground hover:text-primary"
              }`}
            >
              About
            </Link>
            <Link
              to="/contact"
              className={`font-medium transition-colors duration-200 ${
                isActive("/contact")
                  ? "text-primary border-b-2 border-accent"
                  : "text-muted-foreground hover:text-primary"
              }`}
            >
              Contact
            </Link>
          </nav>

          {/* CTA Button */}
          <Link to="/careers">
            <Button variant="cta" size="lg">
              Apply Now
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;