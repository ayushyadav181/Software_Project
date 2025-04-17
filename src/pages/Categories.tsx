
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageTitle from "@/components/PageTitle";
import booksData from "@/data/books.json";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const CategoriesPage = () => {
  const [categoriesWithCount, setcategoriesWithCount] = useState<{ name: string; count: number }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      // Count books in each category
      const counts = booksData.categories.map(category => ({
        name: category,
        count: booksData.books.filter(book => 
          book.categories.some(c => c === category)
        ).length
      }));
      
      // Sort by count (most books first)
      const sorted = counts.sort((a, b) => b.count - a.count);
      
      setcategoriesWithCount(sorted);
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-32 bg-muted" />
        <div className="container max-w-screen-xl py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 20 }).map((_, index) => (
              <div key={index} className="h-32 bg-muted rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <PageTitle 
        title="Browse by Category" 
        subtitle="Explore our books by your favorite genres and topics" 
      />
      
      <div className="container max-w-screen-xl py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categoriesWithCount.map((category, index) => (
            <motion.div 
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Link 
                to={`/category/${encodeURIComponent(category.name)}`}
                className="group block p-4 rounded-lg border hover:border-primary hover:bg-primary/5 transition-colors"
              >
                <h3 className="font-medium">{category.name}</h3>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-sm text-muted-foreground">
                    {category.count} {category.count === 1 ? "book" : "books"}
                  </span>
                  <ArrowRight className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;
