
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Book } from "@/types";
import booksData from "@/data/books.json";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ShoppingCart, 
  Heart, 
  Star, 
  ArrowLeft, 
  Share, 
  BookOpen 
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import Breadcrumbs from "@/components/Breadcrumbs";
import BookDetailsSkeleton from "@/components/BookDetailsSkeleton";
import BookGrid from "@/components/BookGrid";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

const BookDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const [book, setBook] = useState<Book | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [relatedBooks, setRelatedBooks] = useState<Book[]>([]);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      if (id) {
        const foundBook = booksData.books.find(b => b.id === parseInt(id));
        setBook(foundBook || null);
        
        // Get related books (same category)
        if (foundBook) {
          const related = booksData.books
            .filter(b => 
              b.id !== foundBook.id && 
              b.categories.some(c => foundBook.categories.includes(c))
            )
            .slice(0, 5);
          setRelatedBooks(related);
        }
      }
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [id]);

  const handleAddToCart = () => {
    if (book) {
      addToCart(book, quantity);
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    } else {
      setQuantity(1);
    }
  };

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    // In a real app, this would update a wishlist in the database
  };

  if (isLoading) {
    return <BookDetailsSkeleton />;
  }

  if (!book) {
    return (
      <div className="container max-w-screen-xl py-12 text-center">
        <div className="mx-auto max-w-md">
          <h1 className="text-2xl font-bold mb-4">Book Not Found</h1>
          <p className="mb-6 text-muted-foreground">
            We couldn't find the book you're looking for.
          </p>
          <Button asChild>
            <Link to="/books" className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Books
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-screen-xl py-8">
      <Breadcrumbs
        items={[
          { label: "Books", href: "/books" },
          { label: book.title }
        ]}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-4">
        <motion.div 
          className="md:col-span-1"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="aspect-[3/4] overflow-hidden rounded-lg border bg-muted relative">
            <img
              src={book.cover}
              alt={book.title}
              className="h-full w-full object-cover"
            />
            {book.bestSeller && (
              <Badge className="absolute left-2 top-2 bg-yellow-500 hover:bg-yellow-600">
                Bestseller
              </Badge>
            )}
            {book.newRelease && (
              <Badge className="absolute left-2 top-2 bg-green-500 hover:bg-green-600">
                New Release
              </Badge>
            )}
          </div>
        </motion.div>
        
        <motion.div 
          className="md:col-span-2 space-y-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h1 className="text-3xl font-bold">{book.title}</h1>
            <p className="text-lg text-muted-foreground mt-1">by {book.author}</p>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={index}
                  className={`h-5 w-5 ${
                    index < Math.floor(book.rating)
                      ? "text-yellow-400 fill-yellow-400"
                      : index < book.rating
                      ? "text-yellow-400 fill-yellow-400 opacity-50"
                      : "text-gray-300 fill-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="font-medium">{book.rating.toFixed(1)}</span>
          </div>
          
          <div>
            <span className="text-2xl font-bold">${book.price.toFixed(2)}</span>
            {book.inStock ? (
              <span className="ml-3 text-sm text-green-600 bg-green-50 px-2 py-1 rounded-full">
                In Stock
              </span>
            ) : (
              <span className="ml-3 text-sm text-red-600 bg-red-50 px-2 py-1 rounded-full">
                Out of Stock
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center">
              <Input
                type="number"
                min="1"
                value={quantity}
                onChange={handleQuantityChange}
                className="w-16 text-center"
              />
            </div>
            <Button 
              onClick={handleAddToCart} 
              className="flex-1 md:flex-none md:min-w-[180px]"
              disabled={!book.inStock}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </Button>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={toggleWishlist}
                    className={isWishlisted ? "text-red-500" : ""}
                  >
                    <Heart className={`h-4 w-4 ${isWishlisted ? "fill-red-500" : ""}`} />
                    <span className="sr-only">Add to wishlist</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isWishlisted ? "Remove from wishlist" : "Add to wishlist"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Share className="h-4 w-4" />
                    <span className="sr-only">Share</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Share this book</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <div>
            <h2 className="font-semibold text-lg mb-2">About the Book</h2>
            <p className="text-muted-foreground">{book.description}</p>
          </div>
          
          <div>
            <h2 className="font-semibold text-lg mb-2">Categories</h2>
            <div className="flex flex-wrap gap-2">
              {book.categories.map((category) => (
                <Link key={category} to={`/category/${encodeURIComponent(category)}`}>
                  <Badge variant="secondary">{category}</Badge>
                </Link>
              ))}
            </div>
          </div>
          
          <div className="pt-4">
            <Button variant="outline" asChild>
              <Link to="/sample" className="flex items-center">
                <BookOpen className="mr-2 h-4 w-4" />
                Read Sample
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
      
      {relatedBooks.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
          <BookGrid books={relatedBooks} />
        </div>
      )}
    </div>
  );
};

export default BookDetailsPage;
