
import { Book } from "@/types";
import BookCard from "@/components/BookCard";

interface BookGridProps {
  books: Book[];
  emptyMessage?: string;
}

const BookGrid = ({ books, emptyMessage = "No books found" }: BookGridProps) => {
  if (books.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-lg text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
};

export default BookGrid;
