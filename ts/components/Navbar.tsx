import { Link, useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  Train, 
  User, 
  Briefcase, 
  Home, 
  LogIn, 
  LogOut,
  Menu,
  X,
  Info,
  Phone
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export function Navbar() {
  const [location] = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full border-b transition-all duration-300",
      scrolled 
        ? "bg-background/95 backdrop-blur-md shadow-sm supports-[backdrop-filter]:bg-background/80" 
        : "bg-background/70 backdrop-blur-sm supports-[backdrop-filter]:bg-background/60"
    )}>
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center">
          <Link href="/">
            <a className="flex items-center space-x-2 group">
              <div className="bg-gradient-to-r from-primary to-orange-400 text-white p-2 rounded-md shadow-sm transform transition-transform group-hover:scale-110">
                <Train className="h-5 w-5" />
              </div>
              <div className="hidden sm:block overflow-hidden">
                <div className="font-bold text-xl text-foreground relative">
                  <span className="logo-text text-primary inline-block">INKA</span>
                </div>
              </div>
            </a>
          </Link>

          {/* Animation styles injected in index.css */}
        </div>
        
        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          <Link href="/">
            <a className={cn(
              "flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors nav-item-animated",
              location === "/" 
                ? "bg-primary/10 text-primary" 
                : "text-foreground/80"
            )}>
              <Home className="h-4 w-4 mr-2" />
              Beranda
            </a>
          </Link>
          <Link href="/jobs">
            <a className={cn(
              "flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors nav-item-animated",
              location === "/jobs" || location.includes("/jobs/") 
                ? "bg-primary/10 text-primary" 
                : "text-foreground/80"
            )}>
              <Briefcase className="h-4 w-4 mr-2" />
              Lowongan
            </a>
          </Link>
          <Link href="/about">
            <a className={cn(
              "flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors nav-item-animated",
              location === "/about" 
                ? "bg-primary/10 text-primary" 
                : "text-foreground/80"
            )}>
              <Info className="h-4 w-4 mr-2" />
              Tentang Kami
            </a>
          </Link>
          <Link href="/contact">
            <a className={cn(
              "flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors nav-item-animated",
              location === "/contact" 
                ? "bg-primary/10 text-primary" 
                : "text-foreground/80"
            )}>
              <Phone className="h-4 w-4 mr-2" />
              Kontak
            </a>
          </Link>
        </nav>
        
        {/* Desktop authentication actions */}
        <div className="hidden md:flex items-center space-x-2">
          
          {isAuthenticated ? (
            <div className="flex items-center space-x-2">
              <Link href="/profile">
                <a className="flex items-center space-x-2 p-1.5 rounded-full hover:bg-accent transition-colors">
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium text-sm">
                      {user?.displayName?.charAt(0) || 'U'}
                    </div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full"></div>
                  </div>
                </a>
              </Link>
              <Button variant="outline" onClick={() => logout()} size="sm" className="h-9">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link href="/login">
                <Button variant="outline" size="sm" className="h-9">
                  Masuk
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="accent" size="sm" className="h-9">
                  Daftar
                </Button>
              </Link>
            </div>
          )}
        </div>
        
        {/* Mobile menu button */}
        <div className="flex md:hidden items-center space-x-2">
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleMobileMenu} 
            aria-label="Toggle menu"
            className="h-9 w-9"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
      
      {/* Mobile navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background/95 backdrop-blur-md animate-in slide-in-from-top-5 duration-300">
          <div className="container py-4 space-y-3">
            <Link href="/">
              <a className={cn(
                "flex items-center px-3 py-2.5 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors nav-item-animated",
                location === "/" 
                  ? "bg-primary/10 text-primary" 
                  : "text-foreground/80"
              )}>
                <Home className="h-4 w-4 mr-2" />
                Beranda
              </a>
            </Link>
            <Link href="/jobs">
              <a className={cn(
                "flex items-center px-3 py-2.5 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors nav-item-animated",
                location === "/jobs" || location.includes("/jobs/") 
                  ? "bg-primary/10 text-primary" 
                  : "text-foreground/80"
              )}>
                <Briefcase className="h-4 w-4 mr-2" />
                Lowongan
              </a>
            </Link>
            <Link href="/about">
              <a className={cn(
                "flex items-center px-3 py-2.5 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors nav-item-animated",
                location === "/about" 
                  ? "bg-primary/10 text-primary" 
                  : "text-foreground/80"
              )}>
                <Info className="h-4 w-4 mr-2" />
                Tentang Kami
              </a>
            </Link>
            <Link href="/contact">
              <a className={cn(
                "flex items-center px-3 py-2.5 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors nav-item-animated",
                location === "/contact" 
                  ? "bg-primary/10 text-primary" 
                  : "text-foreground/80"
              )}>
                <Phone className="h-4 w-4 mr-2" />
                Kontak
              </a>
            </Link>
            
            <div className="pt-2 border-t border-border/50">
              {isAuthenticated ? (
                <>
                  <Link href="/profile">
                    <a className={cn(
                      "flex items-center px-3 py-2.5 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors nav-item-animated",
                      location === "/profile" 
                        ? "bg-primary/10 text-primary" 
                        : "text-foreground/80"
                    )}>
                      <User className="h-4 w-4 mr-2" />
                      Profil
                    </a>
                  </Link>
                  <div className="px-3 pt-3">
                    <Button variant="outline" onClick={() => logout()} className="w-full justify-center">
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                </>
              ) : (
                <div className="px-3 pt-2 space-y-2">
                  <Link href="/login">
                    <Button variant="outline" className="w-full justify-center">
                      Masuk
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button variant="accent" className="w-full justify-center">
                      Daftar
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Mobile nav ends here */}
    </header>
  );
}