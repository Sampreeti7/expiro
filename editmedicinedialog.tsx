import React, { useState } from 'react';
import { Medicine } from '../App';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Edit2 } from 'lucide-react';

interface EditMedicineDialogProps {
  medicine: Medicine;
  onSave: (medicine: Omit<Medicine, 'id' | 'addedDate'>) => void;
  onCancel: () => void;
}

export function EditMedicineDialog({ medicine, onSave, onCancel }: EditMedicineDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const updatedMedicine = {
      name: formData.get('name') as string,
      expiryDate: formData.get('expiryDate') as string,
      dosage: formData.get('dosage') as string || undefined,
      quantity: formData.get('quantity') as string || undefined,
    };

    // Simulate API call
    setTimeout(() => {
      onSave(updatedMedicine);
      setIsLoading(false);
    }, 500);
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit2 className="h-5 w-5" />
            Edit Medicine
          </DialogTitle>
          <DialogDescription>
            Update the details of your medicine. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Medicine Name *</Label>
            <Input
              id="edit-name"
              name="name"
              type="text"
              defaultValue={medicine.name}
              required
              className="bg-input-background"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-expiryDate">Expiry Date *</Label>
            <Input
              id="edit-expiryDate"
              name="expiryDate"
              type="date"
              defaultValue={medicine.expiryDate}
              min={getTodayDate()}
              required
              className="bg-input-background"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-dosage">Dosage</Label>
              <Input
                id="edit-dosage"
                name="dosage"
                type="text"
                defaultValue={medicine.dosage || ''}
                placeholder="e.g., 500mg"
                className="bg-input-background"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-quantity">Quantity</Label>
              <Input
                id="edit-quantity"
                name="quantity"
                type="text"
                defaultValue={medicine.quantity || ''}
                placeholder="e.g., 30 tablets"
                className="bg-input-background"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
