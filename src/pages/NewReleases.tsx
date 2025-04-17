
import { useEffect, useState } from "react";
import { Book } from "@/types";
import booksData from "@/data/books.json";
import BookGrid from "@/components/BookGrid";
import PageTitle from "@/components/PageTitle";

const NewReleasesPage = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      const newReleases = booksData.books.filter(book => book.newRelease);
      setBooks(newReleases);
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-32 bg-muted" />
        <div className="container max-w-screen-xl py-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {Array.from({ length: 10 }).map((_, index) => (
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
      <PageTitle 
        title="New Releases" 
        subtitle="Fresh from the press and just arrived" 
      />
      
      <div className="container max-w-screen-xl py-8">
        <BookGrid 
          books={books} 
          emptyMessage="No new releases available at the moment." 
        />
      </div>
    </div>
  );
};

export default NewReleasesPage;
