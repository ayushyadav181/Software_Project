
import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface OrderSuccessState {
  orderId: string;
  totalAmount: number;
  paymentMethod: string;
}

const OrderSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as OrderSuccessState;
  
  useEffect(() => {
    // If no order state, redirect to home
    if (!state?.orderId) {
      navigate("/");
    }
  }, [state, navigate]);
  
  if (!state?.orderId) {
    return null;
  }
  
  const getPaymentMethodName = (method: string) => {
    switch (method) {
      case "card":
        return "Credit/Debit Card";
      case "qr":
        return "QR Code Payment";
      default:
        return "Online Payment";
    }
  };
  
  return (
    <div className="container max-w-2xl mx-auto py-16 px-4">
      <motion.div 
        className="text-center mb-6"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="inline-flex items-center justify-center p-4 bg-green-100 rounded-full mb-6">
          <CheckCircle className="h-12 w-12 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold">Thank You For Your Order!</h1>
        <p className="text-muted-foreground mt-2">
          Your order has been placed successfully.
        </p>
      </motion.div>
      
      <motion.div 
        className="bg-card rounded-lg border shadow-sm p-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Order Number</h3>
            <p className="font-semibold">{state.orderId}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Order Date</h3>
            <p className="font-semibold">{new Date().toLocaleDateString()}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Payment Method</h3>
            <p className="font-semibold">{getPaymentMethodName(state.paymentMethod)}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Total Amount</h3>
            <p className="font-semibold">${(state.totalAmount + state.totalAmount * 0.1).toFixed(2)}</p>
          </div>
        </div>
        
        <div className="border-t pt-6">
          <h3 className="font-semibold mb-4">Order Details</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>${state.totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tax</span>
              <span>${(state.totalAmount * 0.1).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span>Free</span>
            </div>
            <div className="flex justify-between font-semibold pt-2 border-t mt-2">
              <span>Total</span>
              <span>${(state.totalAmount + state.totalAmount * 0.1).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </motion.div>
      
      <motion.div 
        className="text-center space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <p className="text-muted-foreground">
          A confirmation has been sent to your email address.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild>
            <Link to="/">
              Continue Shopping
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/orders">
              View Your Orders
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default OrderSuccessPage;
