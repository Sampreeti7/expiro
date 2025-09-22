import React from 'react';
import { Medicine } from '../App';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { AlertTriangle, Calendar, Edit2, Pill, Trash2 } from 'lucide-react';

interface MedicineCardProps {
  medicine: Medicine;
  onDelete: (id: string) => void;
  onEdit: (medicine: Medicine) => void;
  expiryStatus: 'expired' | 'critical' | 'warning' | 'safe';
  daysUntilExpiry: number;
}

export function MedicineCard({ medicine, onDelete, onEdit, expiryStatus, daysUntilExpiry }: MedicineCardProps) {
  const getStatusConfig = () => {
    switch (expiryStatus) {
      case 'expired':
        return {
          badge: 'destructive',
          text: 'Expired',
          bgColor: 'bg-red-50 border-red-200',
          icon: <AlertTriangle className="h-4 w-4 text-red-500" />
        };
      case 'critical':
        return {
          badge: 'destructive',
          text: `${daysUntilExpiry} day${daysUntilExpiry === 1 ? '' : 's'} left`,
          bgColor: 'bg-orange-50 border-orange-200',
          icon: <AlertTriangle className="h-4 w-4 text-orange-500" />
        };
      case 'warning':
        return {
          badge: 'secondary',
          text: `${daysUntilExpiry} days left`,
          bgColor: 'bg-yellow-50 border-yellow-200',
          icon: <Calendar className="h-4 w-4 text-yellow-600" />
        };
      default:
        return {
          badge: 'secondary',
          text: `${daysUntilExpiry} days left`,
          bgColor: 'bg-green-50 border-green-200',
          icon: <Calendar className="h-4 w-4 text-green-600" />
        };
    }
  };

  const statusConfig = getStatusConfig();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card className={`transition-all hover:shadow-md ${statusConfig.bgColor}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <div className="bg-white rounded-full p-2 shadow-sm">
              <Pill className="h-5 w-5 text-primary" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-gray-900 truncate">{medicine.name}</h3>
                <Badge variant={statusConfig.badge as any} className="flex items-center gap-1">
                  {statusConfig.icon}
                  {statusConfig.text}
                </Badge>
              </div>
              
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar className="h-3 w-3" />
                  <span>Expires: {formatDate(medicine.expiryDate)}</span>
                </div>
                
                {medicine.dosage && (
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-blue-400 rounded-full flex-shrink-0"></span>
                    <span>Dosage: {medicine.dosage}</span>
                  </div>
                )}
                
                {medicine.quantity && (
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-purple-400 rounded-full flex-shrink-0"></span>
                    <span>Quantity: {medicine.quantity}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-1 ml-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(medicine)}
              className="h-8 w-8 p-0"
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(medicine.id)}
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
