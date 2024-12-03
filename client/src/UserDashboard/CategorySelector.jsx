import React from 'react';

export default function CategorySelector({ categories, value, onChange }) {
    // console.log(categories)
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">Shop Category</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        >
        <option value="">Select a category</option>
        {categories.map((category) => (
          <option key={category._id} value={category._id}>
            {category.CategoriesName}
          </option>
        ))}
      </select>
    </div>
  );
}