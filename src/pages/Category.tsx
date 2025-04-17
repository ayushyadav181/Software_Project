
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BookGrid from "@/components/BookGrid";
import PageTitle from "@/components/PageTitle";
import { Book } from "@/types";
import booksData from "@/data/books.json";
import CategoryList from "@/components/CategoryList";
import { Separator } from "@/components/ui/separator";

const CategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      if (category) {
        const decodedCategory = decodeURIComponent(category);
        const filteredBooks = booksData.books.filter(book =>
          book.categories.some(c => c === decodedCategory)
        );
        setBooks(filteredBooks);
      }
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [category]);
  
  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-32 bg-muted" />
        <div className="container max-w-screen-xl py-8">
          <div className="flex gap-6">
            <div className="hidden md:block w-60 h-96 bg-muted rounded" />
            <div className="flex-1 space-y-6">
              <div className="h-10 w-36 bg-muted rounded" />
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, index) => (
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
  
  const decodedCategory = category ? decodeURIComponent(category) : "";
  
  return (
    <div>
      <PageTitle title={decodedCategory} subtitle={`Browse our collection of ${decodedCategory} books`} />
      
      <div className="container max-w-screen-xl py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-60 shrink-0">
            <CategoryList 
              categories={booksData.categories} 
              currentCategory={decodedCategory}
            />
          </div>
          
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-1">{decodedCategory}</h2>
            <p className="text-muted-foreground mb-6">
              {books.length} {books.length === 1 ? "book" : "books"} found
            </p>
            
            <Separator className="mb-6" />
            
            <BookGrid
              books={books}
              emptyMessage={`No books found in the ${decodedCategory} category.`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
