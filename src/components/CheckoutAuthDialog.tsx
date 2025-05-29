
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { Link } from "react-router-dom";

interface CheckoutAuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onContinueAsGuest: () => void;
}

const CheckoutAuthDialog = ({ isOpen, onClose, onContinueAsGuest }: CheckoutAuthDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center space-y-4">
          <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-red-600" />
          </div>
          <DialogTitle className="text-2xl font-bold text-red-600">
            Sign in for a Faster Checkout
          </DialogTitle>
          <p className="text-gray-600 text-base">
            Save payment and address info, easily apply Rewards and review your
            online and in-store purchase history.
          </p>
        </DialogHeader>
        
        <div className="space-y-3 mt-6">
          <Button 
            asChild 
            className="w-full bg-black hover:bg-gray-800 text-white py-3 text-base font-medium"
          >
            <Link to="/auth" onClick={onClose}>
              SIGN IN / CREATE AN ACCOUNT
            </Link>
          </Button>
          
          <Button 
            variant="outline" 
            onClick={onContinueAsGuest}
            className="w-full py-3 text-base font-medium border-2 border-gray-300 hover:bg-gray-50"
          >
            CONTINUE AS GUEST
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutAuthDialog;
