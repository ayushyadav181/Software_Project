
import { useState } from "react";
import { Link } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";

interface CategoryListProps {
  categories: string[];
  currentCategory?: string;
  className?: string;
}

export function CategoryList({ 
  categories, 
  currentCategory, 
  className 
}: CategoryListProps) {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Group categories for desktop view
  const groupedCategories = !isMobile 
    ? categories.reduce((acc, category, index) => {
        const groupIndex = Math.floor(index / Math.ceil(categories.length / 2));
        if (!acc[groupIndex]) acc[groupIndex] = [];
        acc[groupIndex].push(category);
        return acc;
      }, [] as string[][])
    : [categories];

  return (
    <div className={cn("bg-background rounded-lg border", className)}>
      <div className="p-4 border-b">
        <h3 className="font-semibold">Categories</h3>
      </div>
      
      <ScrollArea className={isMobile ? "h-[120px]" : "h-[500px]"}>
        <div className={cn(
          "p-4",
          !isMobile && "grid grid-cols-2 gap-x-4"
        )}>
          {isMobile ? (
            // Mobile view: single column
            <ul className="space-y-1">
              <li className="mb-1">
                <Link
                  to="/books"
                  className={cn(
                    "block px-2 py-1 rounded text-sm transition-colors",
                    !currentCategory 
                      ? "bg-primary/10 text-primary font-medium" 
                      : "hover:bg-muted"
                  )}
                >
                  All Books
                </Link>
              </li>
              {categories.map((category) => (
                <li key={category} className="mb-1">
                  <Link
                    to={`/category/${encodeURIComponent(category)}`}
                    className={cn(
                      "block px-2 py-1 rounded text-sm transition-colors",
                      category === currentCategory 
                        ? "bg-primary/10 text-primary font-medium" 
                        : "hover:bg-muted"
                    )}
                  >
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            // Desktop view: two columns
            groupedCategories.map((columnCategories, columnIndex) => (
              <ul key={columnIndex} className="space-y-1">
                {columnIndex === 0 && (
                  <li className="mb-1">
                    <Link
                      to="/books"
                      className={cn(
                        "block px-2 py-1 rounded text-sm transition-colors",
                        !currentCategory 
                          ? "bg-primary/10 text-primary font-medium" 
                          : "hover:bg-muted"
                      )}
                      onMouseEnter={() => setHoveredCategory("All")}
                      onMouseLeave={() => setHoveredCategory(null)}
                    >
                      All Books
                    </Link>
                  </li>
                )}
                {columnCategories.map((category) => (
                  <li key={category} className="mb-1">
                    <Link
                      to={`/category/${encodeURIComponent(category)}`}
                      className={cn(
                        "block px-2 py-1 rounded text-sm transition-colors",
                        category === currentCategory 
                          ? "bg-primary/10 text-primary font-medium" 
                          : "hover:bg-muted",
                        hoveredCategory === category && "bg-muted"
                      )}
                      onMouseEnter={() => setHoveredCategory(category)}
                      onMouseLeave={() => setHoveredCategory(null)}
                    >
                      {category}
                    </Link>
                  </li>
                ))}
              </ul>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

export default CategoryList;
