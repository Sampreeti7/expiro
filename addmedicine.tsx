import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { CameraCapture } from './CameraCapture';
import { Medicine } from '../App';
import { ArrowLeft, Plus, Camera } from 'lucide-react';

interface AddMedicineProps {
  onAdd: (medicine: Omit<Medicine, 'id' | 'addedDate'>) => void;
  onCancel: () => void;
}

export function AddMedicine({ onAdd, onCancel }: AddMedicineProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showCamera, setShowCamera] = useState<'medicine-name' | 'expiry-date' | null>(null);
  const [medicineName, setMedicineName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const medicine = {
      name: medicineName || (formData.get('name') as string),
      expiryDate: expiryDate || (formData.get('expiryDate') as string),
      dosage: formData.get('dosage') as string || undefined,
      quantity: formData.get('quantity') as string || undefined,
    };

    // Simulate API call
    setTimeout(() => {
      onAdd(medicine);
      setIsLoading(false);
    }, 500);
  };

  const handleCameraCapture = (text: string, type: 'medicine-name' | 'expiry-date') => {
    if (type === 'medicine-name') {
      setMedicineName(text);
    } else if (type === 'expiry-date') {
      setExpiryDate(text);
    }
    setShowCamera(null);
  };

  const handleCameraCancel = () => {
    setShowCamera(null);
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  if (showCamera) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={handleCameraCancel}
            className="flex items-center gap-2 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Form
          </Button>
        </div>
        <CameraCapture
          type={showCamera}
          onCapture={(text) => handleCameraCapture(text, showCamera)}
          onCancel={handleCameraCancel}
        />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={onCancel}
          className="flex items-center gap-2 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add New Medicine
          </CardTitle>
          <CardDescription>
            Enter the details of your medicine to track its expiry date and receive timely alerts.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Medicine Name *</Label>
              <div className="flex gap-2">
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="e.g., Aspirin, Tylenol, Vitamin D"
                  value={medicineName}
                  onChange={(e) => setMedicineName(e.target.value)}
                  required
                  className="bg-input-background flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCamera('medicine-name')}
                  className="px-3"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-gray-600">
                Enter the full name or use the camera to scan from the package.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiryDate">Expiry Date *</Label>
              <div className="flex gap-2">
                <Input
                  id="expiryDate"
                  name="expiryDate"
                  type="date"
                  min={getTodayDate()}
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  required
                  className="bg-input-background flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCamera('expiry-date')}
                  className="px-3"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-gray-600">
                Select the expiration date or use the camera to scan from the package.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dosage">Dosage (Optional)</Label>
                <Input
                  id="dosage"
                  name="dosage"
                  type="text"
                  placeholder="e.g., 500mg, 2 tablets"
                  className="bg-input-background"
                />
                <p className="text-sm text-gray-600">
                  Typical dosage amount per use.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity (Optional)</Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="text"
                  placeholder="e.g., 30 tablets, 100ml"
                  className="bg-input-background"
                />
                <p className="text-sm text-gray-600">
                  Total quantity in the package.
                </p>
              </div>
          
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-medium text-green-900 mb-2">Expiry Alerts</h4>
                <div className="text-sm text-green-800 space-y-1">
                  <p>• <strong>Critical:</strong> ≤7 days until expiry</p>
                  <p>• <strong>Warning:</strong> ≤30 days until expiry</p>
                  <p>• <strong>Expired:</strong> Past the expiry date</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? 'Adding Medicine...' : 'Add Medicine'}
              </Button>
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
