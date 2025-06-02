
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CustomerInfo {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface ShippingAddressFormProps {
  customerInfo: CustomerInfo;
  onInputChange: (field: string, value: string) => void;
}

export const ShippingAddressForm = ({ customerInfo, onInputChange }: ShippingAddressFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Shipping Address</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="address">Address *</Label>
          <Input
            id="address"
            value={customerInfo.address}
            onChange={(e) => onInputChange('address', e.target.value)}
            required
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="city">City *</Label>
            <Input
              id="city"
              value={customerInfo.city}
              onChange={(e) => onInputChange('city', e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="state">State *</Label>
            <Input
              id="state"
              value={customerInfo.state}
              onChange={(e) => onInputChange('state', e.target.value)}
              required
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="zipCode">ZIP Code *</Label>
          <Input
            id="zipCode"
            value={customerInfo.zipCode}
            onChange={(e) => onInputChange('zipCode', e.target.value)}
            required
          />
        </div>
      </CardContent>
    </Card>
  );
};
