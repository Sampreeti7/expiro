import React, { useState } from 'react';
import { Medicine } from '../App';
import { MedicineCard } from './MedicineCard';
import { EditMedicineDialog } from './EditMedicineDialog';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { AlertTriangle, CheckCircle, Clock, Pill } from 'lucide-react';

interface DashboardProps {
  medicines: Medicine[];
  onDelete: (id: string) => void;
  onUpdate: (id: string, medicine: Omit<Medicine, 'id' | 'addedDate'>) => void;
}

export function Dashboard({ medicines, onDelete, onUpdate }: DashboardProps) {
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);

  const getDaysUntilExpiry = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getExpiryStatus = (expiryDate: string) => {
    const daysUntilExpiry = getDaysUntilExpiry(expiryDate);
    
    if (daysUntilExpiry < 0) return 'expired';
    if (daysUntilExpiry <= 7) return 'critical';
    if (daysUntilExpiry <= 30) return 'warning';
    return 'safe';
  };

  const sortedMedicines = medicines.sort((a, b) => {
    const statusOrder = { expired: 0, critical: 1, warning: 2, safe: 3 };
    const aStatus = getExpiryStatus(a.expiryDate);
    const bStatus = getExpiryStatus(b.expiryDate);
    
    if (statusOrder[aStatus] !== statusOrder[bStatus]) {
      return statusOrder[aStatus] - statusOrder[bStatus];
    }
    
    return new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime();
  });

  const expiredCount = medicines.filter(med => getExpiryStatus(med.expiryDate) === 'expired').length;
  const criticalCount = medicines.filter(med => getExpiryStatus(med.expiryDate) === 'critical').length;
  const warningCount = medicines.filter(med => getExpiryStatus(med.expiryDate) === 'warning').length;
  const safeCount = medicines.filter(med => getExpiryStatus(med.expiryDate) === 'safe').length;

  const handleEdit = (medicine: Medicine) => {
    setEditingMedicine(medicine);
  };

  const handleUpdate = (updatedMedicine: Omit<Medicine, 'id' | 'addedDate'>) => {
    if (editingMedicine) {
      onUpdate(editingMedicine.id, updatedMedicine);
      setEditingMedicine(null);
    }
  };

  if (medicines.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Pill className="w-12 h-12 text-gray-400" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">No medicines tracked yet</h2>
        <p className="text-gray-600 mb-6">Start by adding your first medicine to track its expiry date.</p>
        <Button onClick={() => window.location.reload()}>Add Your First Medicine</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm text-gray-600">Expired</p>
                <p className="text-2xl font-bold text-red-600">{expiredCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm text-gray-600">Critical (≤7 days)</p>
                <p className="text-2xl font-bold text-orange-600">{criticalCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm text-gray-600">Warning (≤30 days)</p>
                <p className="text-2xl font-bold text-yellow-600">{warningCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Safe</p>
                <p className="text-2xl font-bold text-green-600">{safeCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Medicine List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Medicines</CardTitle>
          <CardDescription>
            Medicines are sorted by expiry status and date. Keep track of expiring medications.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {sortedMedicines.map((medicine) => (
            <MedicineCard
              key={medicine.id}
              medicine={medicine}
              onDelete={onDelete}
              onEdit={handleEdit}
              expiryStatus={getExpiryStatus(medicine.expiryDate)}
              daysUntilExpiry={getDaysUntilExpiry(medicine.expiryDate)}
            />
          ))}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      {editingMedicine && (
        <EditMedicineDialog
          medicine={editingMedicine}
          onSave={handleUpdate}
          onCancel={() => setEditingMedicine(null)}
        />
      )}
    </div>
  );
}
