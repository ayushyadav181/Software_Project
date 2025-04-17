
import { Book } from "@/types";
import { Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Star } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

interface BookCardProps {
  book: Book;
}

const BookCard = ({ book }: BookCardProps) => {
  const { addToCart } = useCart();

  return (
    <motion.div 
      className="group relative flex flex-col overflow-hidden rounded-lg border bg-background"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-foreground/5">
        <Link to={`/book/${book.id}`}>
          <img
            src={book.cover}
            alt={book.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
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
      
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-semibold leading-none tracking-tight line-clamp-1 hover:underline">
          <Link to={`/book/${book.id}`}>{book.title}</Link>
        </h3>
        <p className="text-sm text-muted-foreground mt-1 mb-2">{book.author}</p>
        
        <div className="flex items-center gap-1 mt-auto mb-2">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-medium">{book.rating.toFixed(1)}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="font-semibold">${book.price.toFixed(2)}</span>
          <Button
            variant="secondary"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => addToCart(book)}
          >
            <ShoppingCart className="h-4 w-4" />
            <span className="sr-only">Add to cart</span>
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default BookCard;
