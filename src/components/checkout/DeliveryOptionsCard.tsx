
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { MapPin } from 'lucide-react';

interface LocalDeliveryInfo {
  isLocalDeliveryAvailable: boolean;
  deliveryMethod?: {
    name: string;
    cost: number;
    description: string;
    expectedDeliveryDate?: string;
  };
}

interface DeliveryOptionsCardProps {
  localDeliveryInfo: LocalDeliveryInfo;
  selectedDeliveryMethod: 'shipping' | 'local';
  onDeliveryMethodChange: (value: 'shipping' | 'local') => void;
  cartTotal: number;
  freeShippingThreshold: number;
}

export const DeliveryOptionsCard = ({
  localDeliveryInfo,
  selectedDeliveryMethod,
  onDeliveryMethodChange,
  cartTotal,
  freeShippingThreshold
}: DeliveryOptionsCardProps) => {
  if (!localDeliveryInfo.isLocalDeliveryAvailable) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          Delivery Options
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
          <p className="text-green-800 text-sm font-medium">
            🎉 Free Local Delivery available in San Angelo, TX!
          </p>
        </div>
        
        <RadioGroup 
          value={selectedDeliveryMethod} 
          onValueChange={(value: 'shipping' | 'local') => onDeliveryMethodChange(value)}
        >
          <div className="flex items-center space-x-2 p-3 border rounded-lg">
            <RadioGroupItem value="shipping" id="shipping" />
            <Label htmlFor="shipping" className="flex-1 cursor-pointer">
              <div>
                <div className="font-medium">Standard Shipping</div>
                <div className="text-sm text-gray-600">
                  {cartTotal >= freeShippingThreshold 
                    ? 'FREE shipping (order over $55)' 
                    : '$6.99 shipping fee'}
                </div>
              </div>
            </Label>
            <span className="font-medium">
              {cartTotal >= freeShippingThreshold ? 'FREE' : '$6.99'}
            </span>
          </div>
          
          <div className="flex items-center space-x-2 p-3 border rounded-lg border-primary bg-primary/5">
            <RadioGroupItem value="local" id="local" />
            <Label htmlFor="local" className="flex-1 cursor-pointer">
              <div>
                <div className="font-medium text-primary">Local Delivery (San Angelo Only) — FREE</div>
                <div className="text-sm text-gray-600">
                  Free local delivery within San Angelo, TX
                </div>
                {localDeliveryInfo.deliveryMethod?.expectedDeliveryDate && (
                  <div className="text-sm text-primary font-medium mt-1">
                    Expected delivery by {localDeliveryInfo.deliveryMethod.expectedDeliveryDate}
                  </div>
                )}
              </div>
            </Label>
            <span className="font-medium text-primary">FREE</span>
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
};
