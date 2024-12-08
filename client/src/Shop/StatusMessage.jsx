import React from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

const StatusMessage = ({ type, message }) => {
  if (!message) return null;

  const isError = type === 'error';
  const bgColor = isError ? 'bg-red-50' : 'bg-green-50';
  const borderColor = isError ? 'border-red-200' : 'border-green-200';
  const textColor = isError ? 'text-red-600' : 'text-green-600';
  const Icon = isError ? AlertCircle : CheckCircle2;

  return (
    <div className={`mb-4 p-3 ${bgColor} border ${borderColor} rounded-lg flex items-center gap-2`}>
      <Icon className={`w-5 h-5 ${textColor}`} />
      <p className={textColor}>{message}</p>
    </div>
  );
};

export default StatusMessage;