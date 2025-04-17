
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FilterSidebar from "@/components/FilterSidebar";
import BookGrid from "@/components/BookGrid";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Book } from "@/types";
import booksData from "@/data/books.json";
import PageTitle from "@/components/PageTitle";
import { SlidersHorizontal, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useMediaQuery } from "@/hooks/use-media-query";
import { motion } from "framer-motion";

const BooksPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [ratings, setRatings] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState("relevance");
  const [isLoading, setIsLoading] = useState(true);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  
  // Get categories from book data
  const categories = booksData.categories;
  
  // Find the max price for the price filter
  const maxPrice = Math.max(...booksData.books.map(book => Math.ceil(book.price)));
  
  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setBooks(booksData.books);
      setIsLoading(false);
      // Initialize price range based on actual data
      setPriceRange([0, maxPrice]);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [maxPrice]);
  
  // Parse search parameters from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchQuery = params.get("search");
    const category = params.get("category");
    
    if (searchQuery && books.length > 0) {
      const query = searchQuery.toLowerCase();
      const results = books.filter(
        book =>
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        book.description.toLowerCase().includes(query) ||
        book.categories.some(cat => cat.toLowerCase().includes(query))
      );
      setFilteredBooks(results);
    } else if (category && books.length > 0) {
      const results = books.filter(book =>
        book.categories.some(cat => cat.toLowerCase() === category.toLowerCase())
      );
      setSelectedCategories([category]);
      setFilteredBooks(results);
    } else {
      setFilteredBooks(books);
    }
  }, [location.search, books]);
  
  // Apply filters
  useEffect(() => {
    if (books.length === 0) return;
    
    let results = [...books];
    
    // Filter by search query if it exists
    const params = new URLSearchParams(location.search);
    const searchQuery = params.get("search");
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        book =>
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        book.description.toLowerCase().includes(query) ||
        book.categories.some(cat => cat.toLowerCase().includes(query))
      );
    }
    
    // Filter by categories
    if (selectedCategories.length > 0) {
      results = results.filter(book =>
        book.categories.some(category =>
          selectedCategories.includes(category)
        )
      );
    }
    
    // Filter by price
    results = results.filter(
      book => book.price >= priceRange[0] && book.price <= priceRange[1]
    );
    
    // Filter by rating
    if (ratings.length > 0) {
      results = results.filter(book =>
        ratings.some(rating => book.rating >= rating)
      );
    }
    
    // Sort the results
    results = sortBooks(results, sortBy);
    
    setFilteredBooks(results);
  }, [selectedCategories, priceRange, ratings, sortBy, books, location.search]);
  
  // Handle category filter changes
  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };
  
  // Handle price filter changes
  const handlePriceChange = (range: [number, number]) => {
    setPriceRange(range);
  };
  
  // Handle rating filter changes
  const handleRatingChange = (rating: number) => {
    setRatings(prev =>
      prev.includes(rating)
        ? prev.filter(r => r !== rating)
        : [...prev, rating]
    );
  };
  
  // Handle sorting changes
  const handleSortChange = (value: string) => {
    setSortBy(value);
  };
  
  // Sort the books based on selected option
  const sortBooks = (books: Book[], sortOption: string) => {
    switch (sortOption) {
      case "price-low-high":
        return [...books].sort((a, b) => a.price - b.price);
      case "price-high-low":
        return [...books].sort((a, b) => b.price - a.price);
      case "name-a-z":
        return [...books].sort((a, b) => a.title.localeCompare(b.title));
      case "name-z-a":
        return [...books].sort((a, b) => b.title.localeCompare(a.title));
      case "rating":
        return [...books].sort((a, b) => b.rating - a.rating);
      case "newest":
        return [...books].sort((a, b) => (a.newRelease === b.newRelease ? 0 : a.newRelease ? -1 : 1));
      default:
        return books; // Default to relevance/no sorting
    }
  };
  
  // Clear all filters
  const clearFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, maxPrice]);
    setRatings([]);
    setSortBy("relevance");
    
    // Remove search and category params from URL
    const params = new URLSearchParams(location.search);
    if (params.has("search") || params.has("category")) {
      navigate("/books");
    }
  };
  
  // Get page title based on current view
  const getPageTitle = () => {
    const params = new URLSearchParams(location.search);
    const searchQuery = params.get("search");
    
    if (searchQuery) {
      return `Search results for: "${searchQuery}"`;
    }
    
    return "Browse All Books";
  };
  
  const hasActiveFilters = selectedCategories.length > 0 || 
                           priceRange[0] > 0 || 
                           priceRange[1] < maxPrice || 
                           ratings.length > 0;
  
  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-32 bg-muted" />
        <div className="container max-w-screen-xl py-8">
          <div className="flex gap-6">
            <div className="hidden md:block w-60 h-96 bg-muted rounded" />
            <div className="flex-1 space-y-6">
              <div className="flex justify-between">
                <div className="h-10 w-36 bg-muted rounded" />
                <div className="h-10 w-48 bg-muted rounded" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {Array.from({ length: 12 }).map((_, index) => (
                  <div key={index} className="space-y-2">
                    <div className="aspect-[3/4] w-full bg-muted rounded-lg" />
                    <div className="h-4 w-full bg-muted rounded" />
                    <div className="h-4 w-2/3 bg-muted rounded" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <PageTitle title={getPageTitle()} />
      
      <div className="container max-w-screen-xl py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Desktop Sidebar */}
          <div className="hidden md:block">
            <FilterSidebar
              categories={categories}
              selectedCategories={selectedCategories}
              priceRange={priceRange}
              ratings={ratings}
              maxPrice={maxPrice}
              onCategoryChange={handleCategoryChange}
              onPriceChange={handlePriceChange}
              onRatingChange={handleRatingChange}
              onClearFilters={clearFilters}
            />
          </div>
          
          {/* Mobile Filter Sheet */}
          <Sheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen}>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
                <SheetDescription>
                  Refine your book search
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6">
                <FilterSidebar
                  categories={categories}
                  selectedCategories={selectedCategories}
                  priceRange={priceRange}
                  ratings={ratings}
                  maxPrice={maxPrice}
                  onCategoryChange={handleCategoryChange}
                  onPriceChange={handlePriceChange}
                  onRatingChange={handleRatingChange}
                  onClearFilters={clearFilters}
                />
              </div>
            </SheetContent>
          </Sheet>
          
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              {/* Mobile filter button */}
              <div className="flex items-center gap-2 md:hidden">
                <SheetTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-1"
                    onClick={() => setIsFilterSheetOpen(true)}
                  >
                    <SlidersHorizontal className="h-4 w-4" />
                    Filters
                    {hasActiveFilters && (
                      <span className="ml-1 flex h-2 w-2 rounded-full bg-primary" />
                    )}
                  </Button>
                </SheetTrigger>
                
                {hasActiveFilters && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={clearFilters}
                    className="h-8 px-2"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Clear
                  </Button>
                )}
              </div>
              
              <div className="text-sm text-muted-foreground">
                Showing {filteredBooks.length} {filteredBooks.length === 1 ? "book" : "books"}
              </div>
              
              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="price-low-high">Price: Low to High</SelectItem>
                  <SelectItem value="price-high-low">Price: High to Low</SelectItem>
                  <SelectItem value="name-a-z">Name: A to Z</SelectItem>
                  <SelectItem value="name-z-a">Name: Z to A</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <BookGrid
                books={filteredBooks}
                emptyMessage={
                  filteredBooks.length === 0 && books.length > 0
                    ? "No books match your filters. Try adjusting your criteria."
                    : "No books found."
                }
              />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BooksPage;
