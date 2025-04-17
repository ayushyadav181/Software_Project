
import { useEffect, useState } from "react";
import HeroSection from "@/components/HeroSection";
import FeaturedBooks from "@/components/FeaturedBooks";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Book } from "@/types";
import booksData from "@/data/books.json";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const HomePage = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setBooks(booksData.books);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const newReleases = books.filter((book) => book.newRelease);
  const bestsellers = books.filter((book) => book.bestSeller);
  
  // Get some random books for the featured section
  const shuffle = (array: Book[]) => [...array].sort(() => Math.random() - 0.5);
  const featuredBooks = shuffle(books).slice(0, 5);

  // Categories showcase
  const popularCategories = [
    { name: "Fiction", image: "https://images.unsplash.com/photo-1476275466078-4007374efbbe?q=80&w=2129&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { name: "Self-help", image: "https://images.unsplash.com/photo-1571425046056-2d0500c021e1?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { name: "Science Fiction", image: "https://images.unsplash.com/photo-1447069387593-a5de0862481e?q=80&w=2669&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { name: "Mystery", image: "https://images.unsplash.com/photo-1431608660976-4fe5bcc2112c?q=80&w=2573&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" }
  ];

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-[400px] md:h-[500px] bg-muted" />
        <div className="container max-w-screen-xl py-12">
          <div className="h-8 w-48 bg-muted rounded mb-8" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <div className="aspect-[3/4] w-full bg-muted rounded-lg" />
                <div className="h-4 w-full bg-muted rounded" />
                <div className="h-4 w-2/3 bg-muted rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <HeroSection />
      
      {bestsellers.length > 0 && (
        <FeaturedBooks
          title="Bestsellers"
          subtitle="Our most popular books right now"
          books={bestsellers}
          viewAllLink="/bestsellers"
        />
      )}
      
      {/* Categories Showcase */}
      <section className="py-12 bg-muted/30">
        <div className="container max-w-screen-xl">
          <motion.h2 
            className="text-2xl md:text-3xl font-bold tracking-tight mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Browse By Category
          </motion.h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {popularCategories.map((category, index) => (
              <motion.div 
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-lg"
              >
                <Link to={`/category/${encodeURIComponent(category.name)}`}>
                  <div className="aspect-[16/9] overflow-hidden">
                    <img 
                      src={category.image} 
                      alt={category.name} 
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-white font-semibold text-lg">{category.name}</h3>
                      <span className="text-white/80 text-sm">Explore →</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-8 text-center">
            <Button asChild>
              <Link to="/categories" className="flex items-center gap-1">
                View All Categories
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      {newReleases.length > 0 && (
        <FeaturedBooks
          title="New Releases"
          subtitle="The latest books to hit our shelves"
          books={newReleases}
          viewAllLink="/new-releases"
        />
      )}
      
      {featuredBooks.length > 0 && (
        <FeaturedBooks
          title="Staff Picks"
          subtitle="Handpicked favorites from our team"
          books={featuredBooks}
          viewAllLink="/books"
        />
      )}
      
      {/* Newsletter Section */}
      <section className="py-16 bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="container max-w-screen-xl">
          <div className="max-w-2xl mx-auto text-center">
            <motion.h2 
              className="text-2xl md:text-3xl font-bold tracking-tight mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Stay Updated with BookVerse
            </motion.h2>
            <motion.p 
              className="text-muted-foreground mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Subscribe to our newsletter for exclusive deals and reading recommendations.
            </motion.p>
            
            <motion.form 
              className="flex flex-col sm:flex-row gap-2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              onSubmit={(e) => e.preventDefault()}
            >
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-1"
              />
              <Button type="submit">Subscribe</Button>
            </motion.form>
            <motion.p 
              className="text-xs text-muted-foreground mt-2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              By subscribing, you agree to our Privacy Policy.
            </motion.p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
