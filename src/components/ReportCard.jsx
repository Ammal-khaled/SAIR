import React from 'react';
import { Clock, Car, AlertCircle } from 'lucide-react';
import Badge from './ui/Badge';

export const ReportCard = ({ incident, isSelected, onClick, className = "", style = {} }) => {
  if (!incident) return null;

  return (
    <div 
      style={style}
      onClick={() => onClick && onClick(incident)}
      className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md ${
        isSelected 
          ? 'bg-white border-blue-400 shadow-sm ring-1 ring-blue-400' 
          : 'bg-white border-gray-100'
      } ${className}`}
    >
      <div className="flex justify-between items-start mb-2">
        <span className="text-xs font-bold text-blue-600 tracking-wide">
          ID: {incident.id || incident._id}
        </span>

        <span className="text-xs text-gray-400 flex items-center gap-1 font-medium">
          <Clock className="w-3 h-3" /> {incident.occurredAt
  ? new Date(incident.occurredAt).toLocaleString()
  : "—"}
        </span>
      </div>
      
      <h4 className="font-semibold text-gray-900 mb-3">
        {incident.accidentType || "Report"}
      </h4>
      
      <div className="flex justify-between items-center">
        <Badge
          variant={
            incident.status === 'submitted'
              ? 'gray'
              : incident.status === 'under_review'
              ? 'blue'
              : incident.status === 'resolved'
              ? 'green'
              : incident.status === 'rejected'
              ? 'red'
              : 'gray'
          }
        >
          {incident.status || 'Unknown'}
        </Badge>

        <div className="flex items-center gap-1.5">
          <Car className="w-4 h-4 text-gray-400" />
          {incident.urgent && (
            <AlertCircle className="w-4 h-4 text-red-500 animate-pulse" />
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportCard;