import React from 'react';

export function ServiceCard({ icon: Icon, title, description, iconColor }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${iconColor}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
