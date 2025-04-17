
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, Minus, ArrowRight, ShoppingCart, ArrowLeft } from "lucide-react";
import PageTitle from "@/components/PageTitle";
import { motion, AnimatePresence } from "framer-motion";

const CartPage = () => {
  const { items, updateQuantity, removeFromCart, totalPrice, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [promoCode, setPromoCode] = useState("");
  const [promoError, setPromoError] = useState("");
  const [promoSuccess, setPromoSuccess] = useState("");
  const [discount, setDiscount] = useState(0);
  
  const handleQuantityChange = (id: number, newQuantity: number) => {
    if (newQuantity > 0) {
      updateQuantity(id, newQuantity);
    }
  };
  
  const applyPromoCode = () => {
    // Reset previous messages
    setPromoError("");
    setPromoSuccess("");
    
    // Simple promo code validation
    if (!promoCode) {
      setPromoError("Please enter a promo code");
      return;
    }
    
    // Simulate promo code validation
    if (promoCode.toUpperCase() === "BOOKVERSE10") {
      const discountAmount = totalPrice * 0.1; // 10% discount
      setDiscount(discountAmount);
      setPromoSuccess("10% discount applied successfully!");
    } else if (promoCode.toUpperCase() === "WELCOME20") {
      const discountAmount = totalPrice * 0.2; // 20% discount
      setDiscount(discountAmount);
      setPromoSuccess("20% discount applied successfully!");
    } else {
      setPromoError("Invalid promo code");
    }
  };
  
  const proceedToCheckout = () => {
    if (isAuthenticated) {
      navigate("/checkout");
    } else {
      navigate("/login", { state: { from: "/checkout" } });
    }
  };
  
  // Calculate final price with discount applied
  const finalPrice = totalPrice - discount;
  
  // Cart is empty
  if (items.length === 0) {
    return (
      <div>
        <PageTitle title="Your Cart" />
        <div className="container max-w-screen-xl py-16 text-center">
          <div className="mx-auto max-w-md">
            <ShoppingCart className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
            <p className="mb-8 text-muted-foreground">
              Looks like you haven't added any books to your cart yet.
            </p>
            <Button asChild>
              <Link to="/books" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Continue Shopping
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <PageTitle title="Your Cart" />
      <div className="container max-w-screen-xl py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="rounded-lg border shadow-sm bg-card overflow-hidden">
              <div className="bg-muted px-4 py-3 font-medium">
                <div className="flex justify-between items-center">
                  <h2>Cart Items ({items.length})</h2>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={clearCart}
                    className="h-8 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Clear Cart
                  </Button>
                </div>
              </div>
              
              <div className="divide-y">
                <AnimatePresence>
                  {items.map((item) => (
                    <motion.div 
                      key={item.book.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-4 flex"
                    >
                      <Link to={`/book/${item.book.id}`} className="w-20 h-28 flex-shrink-0">
                        <img
                          src={item.book.cover}
                          alt={item.book.title}
                          className="w-full h-full object-cover rounded"
                        />
                      </Link>
                      
                      <div className="ml-4 flex-1 flex flex-col">
                        <div className="flex justify-between">
                          <div>
                            <Link 
                              to={`/book/${item.book.id}`}
                              className="font-medium hover:underline"
                            >
                              {item.book.title}
                            </Link>
                            <p className="text-sm text-muted-foreground">
                              by {item.book.author}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">
                              ${(item.book.price * item.quantity).toFixed(2)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              ${item.book.price.toFixed(2)} each
                            </p>
                          </div>
                        </div>
                        
                        <div className="mt-auto flex items-center justify-between">
                          <div className="flex items-center border rounded-md">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-none"
                              onClick={() => handleQuantityChange(item.book.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-3 w-3" />
                              <span className="sr-only">Decrease quantity</span>
                            </Button>
                            <span className="w-10 text-center text-sm">
                              {item.quantity}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-none"
                              onClick={() => handleQuantityChange(item.book.id, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                              <span className="sr-only">Increase quantity</span>
                            </Button>
                          </div>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromCart(item.book.id)}
                            className="h-8 text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="rounded-lg border shadow-sm bg-card overflow-hidden sticky top-20">
              <div className="bg-muted px-4 py-3 font-medium">
                <h2>Order Summary</h2>
              </div>
              
              <div className="p-4">
                <div className="space-y-1.5 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  
                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>Free</span>
                  </div>
                  
                  <div className="pt-4 mt-4 border-t flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${finalPrice.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Promo code"
                        value={promoCode}
                        onChange={e => setPromoCode(e.target.value)}
                      />
                      <Button onClick={applyPromoCode}>Apply</Button>
                    </div>
                    {promoError && (
                      <p className="text-xs text-destructive">{promoError}</p>
                    )}
                    {promoSuccess && (
                      <p className="text-xs text-green-600">{promoSuccess}</p>
                    )}
                  </div>
                  
                  <Button 
                    className="w-full" 
                    onClick={proceedToCheckout}
                  >
                    Proceed to Checkout
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  
                  <div className="text-center">
                    <Link 
                      to="/books" 
                      className="text-sm text-primary hover:underline inline-flex items-center"
                    >
                      <ArrowLeft className="mr-1 h-3 w-3" />
                      Continue Shopping
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
