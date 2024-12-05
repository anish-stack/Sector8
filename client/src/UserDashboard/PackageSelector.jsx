import React from 'react';

const PackageSelector = ({ packages, value, onChange })=> {
 
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">Listing Plan</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        >
        <option value="Free">Select Plans</option>
        {packages.map((pkg) => (
          <option key={pkg._id} value={pkg.packageName}>
            {pkg.packageName} - Rs:{pkg.packagePrice}
          </option>
        ))}
      </select>
    </div>
  );
}


export default PackageSelector