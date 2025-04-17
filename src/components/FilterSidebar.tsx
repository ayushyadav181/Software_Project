
import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

interface FilterSidebarProps {
  categories: string[];
  selectedCategories: string[];
  priceRange: [number, number];
  ratings: number[];
  maxPrice: number;
  onCategoryChange: (category: string) => void;
  onPriceChange: (range: [number, number]) => void;
  onRatingChange: (rating: number) => void;
  onClearFilters: () => void;
}

const FilterSidebar = ({
  categories,
  selectedCategories,
  priceRange,
  ratings,
  maxPrice,
  onCategoryChange,
  onPriceChange,
  onRatingChange,
  onClearFilters,
}: FilterSidebarProps) => {
  const [localPriceRange, setLocalPriceRange] = useState<[number, number]>(priceRange);
  const [minInputValue, setMinInputValue] = useState(priceRange[0].toString());
  const [maxInputValue, setMaxInputValue] = useState(priceRange[1].toString());

  const handleSliderChange = (value: number[]) => {
    const newRange: [number, number] = [value[0], value[1]];
    setLocalPriceRange(newRange);
    setMinInputValue(newRange[0].toString());
    setMaxInputValue(newRange[1].toString());
  };

  const handlePriceInputBlur = () => {
    const min = Math.max(0, Number(minInputValue) || 0);
    const max = Math.min(
      maxPrice,
      Math.max(min + 1, Number(maxInputValue) || maxPrice)
    );
    
    const newRange: [number, number] = [min, max];
    setMinInputValue(min.toString());
    setMaxInputValue(max.toString());
    setLocalPriceRange(newRange);
    onPriceChange(newRange);
  };

  const handleApplyPrice = () => {
    onPriceChange(localPriceRange);
  };

  return (
    <div className="w-full md:w-60 lg:w-72 shrink-0 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">Filters</h3>
        <Button size="sm" variant="ghost" onClick={onClearFilters}>
          <X className="mr-2 h-4 w-4" />
          Clear All
        </Button>
      </div>

      <Accordion type="multiple" defaultValue={["categories", "price", "rating"]}>
        <AccordionItem value="categories">
          <AccordionTrigger>Categories</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {categories.slice(0, 12).map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category}`}
                    checked={selectedCategories.includes(category)}
                    onCheckedChange={() => onCategoryChange(category)}
                  />
                  <Label
                    htmlFor={`category-${category}`}
                    className="text-sm cursor-pointer"
                  >
                    {category}
                  </Label>
                </div>
              ))}
              {categories.length > 12 && (
                <Button variant="link" className="h-auto p-0 text-sm">
                  Show more
                </Button>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="price">
          <AccordionTrigger>Price Range</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <Slider
                defaultValue={[0, maxPrice]}
                value={localPriceRange}
                max={maxPrice}
                step={1}
                onValueChange={handleSliderChange}
              />

              <div className="flex items-center space-x-2">
                <div className="grid flex-1 items-center gap-1.5">
                  <Label htmlFor="min-price" className="text-xs">
                    Min
                  </Label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-3 flex items-center text-sm">
                      $
                    </span>
                    <Input
                      id="min-price"
                      value={minInputValue}
                      onChange={(e) => setMinInputValue(e.target.value)}
                      onBlur={handlePriceInputBlur}
                      className="pl-7"
                    />
                  </div>
                </div>
                <div className="grid flex-1 items-center gap-1.5">
                  <Label htmlFor="max-price" className="text-xs">
                    Max
                  </Label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-3 flex items-center text-sm">
                      $
                    </span>
                    <Input
                      id="max-price"
                      value={maxInputValue}
                      onChange={(e) => setMaxInputValue(e.target.value)}
                      onBlur={handlePriceInputBlur}
                      className="pl-7"
                    />
                  </div>
                </div>
              </div>

              <Button size="sm" onClick={handleApplyPrice}>
                Apply
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="rating">
          <AccordionTrigger>Rating</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center space-x-2">
                  <Checkbox
                    id={`rating-${rating}`}
                    checked={ratings.includes(rating)}
                    onCheckedChange={() => onRatingChange(rating)}
                  />
                  <Label
                    htmlFor={`rating-${rating}`}
                    className="text-sm flex items-center cursor-pointer"
                  >
                    {Array.from({ length: 5 }).map((_, index) => (
                      <svg
                        key={index}
                        className={`h-4 w-4 ${
                          index < rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300 fill-gray-300"
                        }`}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                    <span className="ml-1">& Up</span>
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default FilterSidebar;
