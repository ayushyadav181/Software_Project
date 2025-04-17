
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { QrCode, X, Camera, QrCodeIcon } from "lucide-react";

interface QRCodeScannerProps {
  open: boolean;
  onClose: () => void;
  onScanSuccess: (data: string) => void;
}

const QRCodeScanner = ({ open, onClose, onScanSuccess }: QRCodeScannerProps) => {
  const [scanMessage, setScanMessage] = useState("Position QR code in the box");
  const [isScanning, setIsScanning] = useState(false);
  const [scanError, setScanError] = useState("");

  // In a real app, we'd use a library like jsQR or a React QR scanner component
  // For demo purposes, we'll simulate scanning after a delay
  useEffect(() => {
    if (open && !isScanning) {
      setIsScanning(true);
      setScanMessage("Scanning...");
      
      // Simulate a scanning process
      const timer = setTimeout(() => {
        // Generate a fake payment code
        const paymentData = JSON.stringify({
          method: "qr",
          id: "qr_" + Math.random().toString(36).substring(2, 10),
          amount: "35.99",
          timestamp: new Date().toISOString()
        });
        
        onScanSuccess(paymentData);
        setScanMessage("QR Code detected!");
        setIsScanning(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [open, isScanning, onScanSuccess]);

  const handleClose = () => {
    setIsScanning(false);
    setScanMessage("Position QR code in the box");
    setScanError("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <QrCode className="mr-2 h-4 w-4" />
            Scan QR Code
          </DialogTitle>
          <DialogDescription>
            Scan a QR code to complete your payment
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center justify-center p-4">
          <div className="relative w-64 h-64 bg-muted rounded-lg overflow-hidden mb-4">
            {/* This would be a live camera view in a real app */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Camera className="h-20 w-20 text-muted-foreground opacity-20" />
            </div>
            
            {/* Scanning indicator */}
            {isScanning && (
              <div className="absolute top-0 left-0 w-full h-1 bg-primary opacity-50">
                <div 
                  className="h-full w-full bg-primary animate-[scan_2s_ease-in-out_infinite]" 
                  style={{
                    animation: "scan 2s ease-in-out infinite",
                    background: "linear-gradient(90deg, transparent, currentColor, transparent)",
                    backgroundSize: "200% 100%",
                  }}
                />
              </div>
            )}
            
            {/* Scan frame */}
            <div className="absolute inset-8 border-2 border-dashed border-primary/70 rounded" />
            
            {/* Success overlay */}
            {scanMessage === "QR Code detected!" && (
              <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                <QrCodeIcon className="h-16 w-16 text-green-500" />
              </div>
            )}
          </div>
          
          <p className={`text-sm ${scanError ? "text-destructive" : ""}`}>
            {scanError || scanMessage}
          </p>
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-2">
          <Button variant="outline" type="button" onClick={handleClose}>
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          {/* In a real app, we might have manual entry as a fallback */}
          <Button type="button" onClick={() => setScanMessage("Scanning...")}>
            Try Again
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default QRCodeScanner;
