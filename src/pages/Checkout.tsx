
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  CreditCard, 
  QrCode,
  ArrowRight,
  Shield,
  CheckCircle,
  CreditCardIcon
} from "lucide-react";
import { ShippingAddress, PaymentInfo } from "@/types";
import PageTitle from "@/components/PageTitle";
import QRCodeScanner from "@/components/QRCodeScanner";
import { motion } from "framer-motion";

const CheckoutPage = () => {
  const { user } = useAuth();
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  
  // Form state
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: user?.name || "",
    streetAddress: "",
    city: "",
    state: "",
    postalCode: "",
    country: "United States"
  });
  
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    cardNumber: "",
    cardHolder: user?.name || "",
    expiryDate: "",
    cvv: ""
  });
  const [savePaymentInfo, setSavePaymentInfo] = useState(false);
  
  // Form validation state
  const [shippingErrors, setShippingErrors] = useState<Record<string, string>>({});
  const [paymentErrors, setPaymentErrors] = useState<Record<string, string>>({});
  
  const validateShippingForm = () => {
    const errors: Record<string, string> = {};
    
    if (!shippingAddress.fullName) errors.fullName = "Full name is required";
    if (!shippingAddress.streetAddress) errors.streetAddress = "Street address is required";
    if (!shippingAddress.city) errors.city = "City is required";
    if (!shippingAddress.state) errors.state = "State is required";
    if (!shippingAddress.postalCode) errors.postalCode = "Postal code is required";
    if (!shippingAddress.country) errors.country = "Country is required";
    
    setShippingErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const validatePaymentForm = () => {
    if (paymentMethod === "qr") return true;
    
    const errors: Record<string, string> = {};
    
    // Basic card validation
    if (!paymentInfo.cardNumber) {
      errors.cardNumber = "Card number is required";
    } else if (!/^\d{16}$/.test(paymentInfo.cardNumber.replace(/\s/g, ""))) {
      errors.cardNumber = "Card number must be 16 digits";
    }
    
    if (!paymentInfo.cardHolder) errors.cardHolder = "Cardholder name is required";
    
    if (!paymentInfo.expiryDate) {
      errors.expiryDate = "Expiry date is required";
    } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(paymentInfo.expiryDate)) {
      errors.expiryDate = "Expiry date must be in MM/YY format";
    }
    
    if (!paymentInfo.cvv) {
      errors.cvv = "CVV is required";
    } else if (!/^\d{3,4}$/.test(paymentInfo.cvv)) {
      errors.cvv = "CVV must be 3 or 4 digits";
    }
    
    setPaymentErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateShippingForm()) {
      setStep(2);
      window.scrollTo(0, 0);
    }
  };
  
  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validatePaymentForm()) {
      setIsSubmitting(true);
      
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate order ID
      const orderId = `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      
      // Clear cart and redirect to success page
      clearCart();
      navigate("/order-success", { 
        state: { 
          orderId, 
          totalAmount: totalPrice,
          paymentMethod
        } 
      });
    }
  };
  
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(" ");
    } else {
      return value;
    }
  };
  
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setPaymentInfo({ ...paymentInfo, cardNumber: formatted });
  };
  
  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    value = value.replace(/[^\d]/g, "");
    
    if (value.length > 2) {
      value = value.slice(0, 2) + "/" + value.slice(2, 4);
    }
    
    setPaymentInfo({ ...paymentInfo, expiryDate: value });
  };
  
  const handleQRScanSuccess = (data: string) => {
    setShowQRScanner(false);
    
    try {
      const paymentData = JSON.parse(data);
      setPaymentInfo({
        ...paymentInfo,
        qrCodeData: data
      });
      
      // Auto-submit after QR code is scanned
      setTimeout(() => {
        setIsSubmitting(true);
        
        // Simulate payment processing
        setTimeout(() => {
          const orderId = `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
          clearCart();
          navigate("/order-success", { 
            state: { 
              orderId, 
              totalAmount: totalPrice,
              paymentMethod: "qr"
            } 
          });
        }, 2000);
      }, 1000);
      
    } catch (error) {
      setPaymentErrors({
        qr: "Invalid QR code data"
      });
    }
  };
  
  return (
    <div>
      <PageTitle title="Checkout" />
      <div className="container max-w-screen-xl py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Checkout Steps */}
            <div className="mb-8">
              <div className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  step >= 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}>
                  {step > 1 ? <CheckCircle className="h-5 w-5" /> : "1"}
                </div>
                <div className={`flex-1 h-0.5 mx-2 ${
                  step > 1 ? "bg-primary" : "bg-muted"
                }`}></div>
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  step >= 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}>
                  {step > 2 ? <CheckCircle className="h-5 w-5" /> : "2"}
                </div>
                <div className={`flex-1 h-0.5 mx-2 ${
                  step > 2 ? "bg-primary" : "bg-muted"
                }`}></div>
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  step >= 3 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}>
                  3
                </div>
              </div>
              <div className="flex justify-between mt-2 text-sm">
                <span className={step >= 1 ? "text-primary font-medium" : "text-muted-foreground"}>Shipping</span>
                <span className={step >= 2 ? "text-primary font-medium" : "text-muted-foreground"}>Payment</span>
                <span className={step >= 3 ? "text-primary font-medium" : "text-muted-foreground"}>Confirmation</span>
              </div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              {step === 1 && (
                /* Shipping Information Form */
                <div className="p-6 rounded-lg border shadow-sm bg-card">
                  <h2 className="text-xl font-semibold mb-6">Shipping Information</h2>
                  
                  <form onSubmit={handleShippingSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        value={shippingAddress.fullName}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                        className={shippingErrors.fullName ? "border-destructive" : ""}
                      />
                      {shippingErrors.fullName && (
                        <p className="text-xs text-destructive">{shippingErrors.fullName}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="streetAddress">Street Address</Label>
                      <Input
                        id="streetAddress"
                        value={shippingAddress.streetAddress}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, streetAddress: e.target.value })}
                        className={shippingErrors.streetAddress ? "border-destructive" : ""}
                      />
                      {shippingErrors.streetAddress && (
                        <p className="text-xs text-destructive">{shippingErrors.streetAddress}</p>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          value={shippingAddress.city}
                          onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                          className={shippingErrors.city ? "border-destructive" : ""}
                        />
                        {shippingErrors.city && (
                          <p className="text-xs text-destructive">{shippingErrors.city}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State/Province</Label>
                        <Input
                          id="state"
                          value={shippingAddress.state}
                          onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                          className={shippingErrors.state ? "border-destructive" : ""}
                        />
                        {shippingErrors.state && (
                          <p className="text-xs text-destructive">{shippingErrors.state}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="postalCode">Postal Code</Label>
                        <Input
                          id="postalCode"
                          value={shippingAddress.postalCode}
                          onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                          className={shippingErrors.postalCode ? "border-destructive"  : ""}
                        />
                        {shippingErrors.postalCode && (
                          <p className="text-xs text-destructive">{shippingErrors.postalCode}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="country">Country</Label>
                        <Input
                          id="country"
                          value={shippingAddress.country}
                          onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                          className={shippingErrors.country ? "border-destructive" : ""}
                        />
                        {shippingErrors.country && (
                          <p className="text-xs text-destructive">{shippingErrors.country}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <Button type="submit" className="w-full">
                        Continue to Payment
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </form>
                </div>
              )}
              
              {step === 2 && (
                /* Payment Information Form */
                <div className="p-6 rounded-lg border shadow-sm bg-card">
                  <h2 className="text-xl font-semibold mb-6">Payment Method</h2>
                  
                  <form onSubmit={handlePaymentSubmit} className="space-y-6">
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                      <div className="space-y-4">
                        <div className={`flex items-center space-x-3 rounded-md border p-4 ${
                          paymentMethod === "card" ? "border-primary bg-primary/5" : ""
                        }`}>
                          <RadioGroupItem value="card" id="card" />
                          <Label htmlFor="card" className="flex items-center flex-1 cursor-pointer">
                            <CreditCard className="mr-2 h-5 w-5" />
                            Credit/Debit Card
                          </Label>
                        </div>
                        
                        <div className={`flex items-center space-x-3 rounded-md border p-4 ${
                          paymentMethod === "qr" ? "border-primary bg-primary/5" : ""
                        }`}>
                          <RadioGroupItem value="qr" id="qr" />
                          <Label htmlFor="qr" className="flex items-center flex-1 cursor-pointer">
                            <QrCode className="mr-2 h-5 w-5" />
                            QR Code Payment
                          </Label>
                        </div>
                      </div>
                    </RadioGroup>
                    
                    {paymentMethod === "card" && (
                      <div className="space-y-4 pt-4">
                        <div className="space-y-2">
                          <Label htmlFor="cardNumber">Card Number</Label>
                          <div className="relative">
                            <Input
                              id="cardNumber"
                              placeholder="1234 5678 9012 3456"
                              value={paymentInfo.cardNumber}
                              onChange={handleCardNumberChange}
                              maxLength={19}
                              className={paymentErrors.cardNumber ? "border-destructive pl-10" : "pl-10"}
                            />
                            <CreditCardIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          </div>
                          {paymentErrors.cardNumber && (
                            <p className="text-xs text-destructive">{paymentErrors.cardNumber}</p>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="cardHolder">Cardholder Name</Label>
                          <Input
                            id="cardHolder"
                            placeholder="John Doe"
                            value={paymentInfo.cardHolder}
                            onChange={(e) => setPaymentInfo({ ...paymentInfo, cardHolder: e.target.value })}
                            className={paymentErrors.cardHolder ? "border-destructive" : ""}
                          />
                          {paymentErrors.cardHolder && (
                            <p className="text-xs text-destructive">{paymentErrors.cardHolder}</p>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="expiryDate">Expiry Date</Label>
                            <Input
                              id="expiryDate"
                              placeholder="MM/YY"
                              value={paymentInfo.expiryDate}
                              onChange={handleExpiryDateChange}
                              maxLength={5}
                              className={paymentErrors.expiryDate ? "border-destructive" : ""}
                            />
                            {paymentErrors.expiryDate && (
                              <p className="text-xs text-destructive">{paymentErrors.expiryDate}</p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="cvv">CVV</Label>
                            <Input
                              id="cvv"
                              placeholder="123"
                              value={paymentInfo.cvv}
                              onChange={(e) => setPaymentInfo({ ...paymentInfo, cvv: e.target.value })}
                              maxLength={4}
                              className={paymentErrors.cvv ? "border-destructive" : ""}
                            />
                            {paymentErrors.cvv && (
                              <p className="text-xs text-destructive">{paymentErrors.cvv}</p>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 pt-2">
                          <Checkbox
                            id="savePaymentInfo"
                            checked={savePaymentInfo}
                            onCheckedChange={(checked) => setSavePaymentInfo(checked === true)}
                          />
                          <Label htmlFor="savePaymentInfo" className="text-sm">
                            Save payment information for future purchases
                          </Label>
                        </div>
                      </div>
                    )}
                    
                    {paymentMethod === "qr" && (
                      <div className="space-y-4 pt-4 text-center">
                        <div className="p-6 bg-muted rounded-lg">
                          <QrCode className="mx-auto h-24 w-24 text-primary mb-4" />
                          <p className="mb-4">Scan a QR code to complete your payment</p>
                          <Button onClick={() => setShowQRScanner(true)}>
                            Open QR Scanner
                          </Button>
                          {paymentErrors.qr && (
                            <p className="text-xs text-destructive mt-2">{paymentErrors.qr}</p>
                          )}
                          {paymentInfo.qrCodeData && (
                            <p className="text-xs text-green-600 mt-2">
                              QR code scanned successfully! Ready to complete order.
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-3 pt-4">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setStep(1)}
                      >
                        Back
                      </Button>
                      <Button 
                        type="submit" 
                        className="flex-1"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Processing..." : "Complete Order"}
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-center text-xs text-muted-foreground pt-4">
                      <Shield className="h-3 w-3 mr-1" />
                      Secure, encrypted payment processing
                    </div>
                  </form>
                </div>
              )}
            </motion.div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="rounded-lg border shadow-sm bg-card overflow-hidden sticky top-20">
              <div className="bg-muted px-4 py-3 font-medium">
                <h2>Order Summary</h2>
              </div>
              
              <div className="p-4">
                <div className="max-h-80 overflow-y-auto space-y-3 mb-4">
                  {items.map((item) => (
                    <div key={item.book.id} className="flex gap-3">
                      <img
                        src={item.book.cover}
                        alt={item.book.title}
                        className="w-12 h-16 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{item.book.title}</p>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                        <p className="text-sm">${(item.book.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="space-y-1.5 pt-4 border-t">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax</span>
                    <span>${(totalPrice * 0.1).toFixed(2)}</span>
                  </div>
                  <div className="pt-4 mt-2 border-t flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${(totalPrice + totalPrice * 0.1).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <QRCodeScanner 
        open={showQRScanner} 
        onClose={() => setShowQRScanner(false)}
        onScanSuccess={handleQRScanSuccess}
      />
    </div>
  );
};

export default CheckoutPage;
