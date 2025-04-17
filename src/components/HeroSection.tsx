
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, BookOpen } from "lucide-react";

const heroSlides = [
  {
    id: 1,
    title: "Find Your Next Favorite Book",
    description: "Discover books from all genres, curated for every reader.",
    cta: "Browse Books",
    link: "/books",
    image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    color: "from-blue-500/30 to-purple-500/30"
  },
  {
    id: 2,
    title: "New Releases Every Week",
    description: "Stay updated with the latest books from your favorite authors.",
    cta: "View New Releases",
    link: "/new-releases",
    image: "https://images.unsplash.com/photo-1535905557558-afc4877a26fc?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    color: "from-green-500/30 to-teal-500/30"
  },
  {
    id: 3,
    title: "Top Bestsellers",
    description: "Explore our collection of award-winning and bestselling titles.",
    cta: "Shop Bestsellers",
    link: "/bestsellers",
    image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=3390&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    color: "from-orange-500/30 to-red-500/30"
  }
];

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  return (
    <div className="relative overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={heroSlides[currentSlide].id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="relative h-[400px] md:h-[500px]"
        >
          <div 
            className="absolute inset-0 bg-cover bg-center" 
            style={{ 
              backgroundImage: `url(${heroSlides[currentSlide].image})`,
              filter: "brightness(0.65)"
            }}
          />
          
          <div className={`absolute inset-0 bg-gradient-to-r ${heroSlides[currentSlide].color} mix-blend-multiply`} />
          
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="max-w-2xl space-y-4"
            >
              <BookOpen className="mx-auto h-12 w-12 text-white mb-4" />
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
                {heroSlides[currentSlide].title}
              </h1>
              <p className="text-lg md:text-xl text-white/90">
                {heroSlides[currentSlide].description}
              </p>
              <Button asChild size="lg" className="mt-6">
                <Link to={heroSlides[currentSlide].link}>
                  {heroSlides[currentSlide].cta}
                </Link>
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation buttons */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/20 text-white hover:bg-background/40"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-6 w-6" />
        <span className="sr-only">Previous slide</span>
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/20 text-white hover:bg-background/40"
        onClick={nextSlide}
      >
        <ChevronRight className="h-6 w-6" />
        <span className="sr-only">Next slide</span>
      </Button>

      {/* Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            className={`h-2 w-2 rounded-full transition-all ${
              index === currentSlide ? "bg-white w-6" : "bg-white/50"
            }`}
            onClick={() => setCurrentSlide(index)}
          >
            <span className="sr-only">Go to slide {index + 1}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default HeroSection;
