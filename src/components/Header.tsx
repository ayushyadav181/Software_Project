
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { AvatarHoverCard } from "@/components/ui/avatar-hover-card";
import { Menu, ShoppingCart, Search, Book, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

const Header = () => {
  const { isAuthenticated } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  // Check if the device is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    
    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/books?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-xl items-center">
        <div className="mr-4 flex items-center">
          <Link to="/" className="flex items-center gap-2">
            <Book className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">BookVerse</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex flex-1 items-center gap-6 text-sm">
          <Link to="/" className="transition-colors hover:text-foreground/80">Home</Link>
          <Link to="/books" className="transition-colors hover:text-foreground/80">All Books</Link>
          <Link to="/categories" className="transition-colors hover:text-foreground/80">Categories</Link>
          <Link to="/new-releases" className="transition-colors hover:text-foreground/80">New Releases</Link>
          <Link to="/bestsellers" className="transition-colors hover:text-foreground/80">Bestsellers</Link>
        </nav>

        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="mr-2">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>BookVerse</SheetTitle>
              <SheetDescription>
                Explore our vast collection of books
              </SheetDescription>
            </SheetHeader>
            <nav className="flex flex-col gap-4 py-6">
              <SheetClose asChild>
                <Link to="/" className="block py-2 text-foreground hover:text-primary">Home</Link>
              </SheetClose>
              <SheetClose asChild>
                <Link to="/books" className="block py-2 text-foreground hover:text-primary">All Books</Link>
              </SheetClose>
              <SheetClose asChild>
                <Link to="/categories" className="block py-2 text-foreground hover:text-primary">Categories</Link>
              </SheetClose>
              <SheetClose asChild>
                <Link to="/new-releases" className="block py-2 text-foreground hover:text-primary">New Releases</Link>
              </SheetClose>
              <SheetClose asChild>
                <Link to="/bestsellers" className="block py-2 text-foreground hover:text-primary">Bestsellers</Link>
              </SheetClose>
            </nav>
          </SheetContent>
        </Sheet>

        {/* Search Bar - different styles for mobile vs desktop */}
        <div className={`${isMobile ? 'flex-1' : 'w-[250px] lg:w-[300px]'} mx-4`}>
          <form onSubmit={handleSearch} className="relative">
            <Input
              placeholder="Search books..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-2.5"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            )}
          </form>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                  {totalItems}
                </span>
              )}
            </Button>
          </Link>

          {isAuthenticated ? (
            <AvatarHoverCard />
          ) : (
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/signup">Sign up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
