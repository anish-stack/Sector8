import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MarqueeActions = () => {
  const [marquees, setMarquees] = useState([]);
  const [title, setTitle] = useState('');
  const [active, setActive] = useState(true);
  const [editingId, setEditingId] = useState(null);

  const API_URL = 'http://localhost:7485/api/v1';

  // Get all marquees
  const getAllMarquees = async () => {
    try {
      const response = await axios.get(`${API_URL}/get-all-marquees`);
      if (response.data.success) {
        setMarquees(response.data.data);
      } else {
        console.error("Failed to fetch marquees:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching marquees:", error);
    }
  };

  // Create a new marquee
  const createMarquee = async () => {
    try {
      const response = await axios.post(`${API_URL}/create-marquee`, { title, active });
      if (response.data.success) {
        setMarquees([...marquees, response.data.data]);
        setTitle('');
        setActive(true);
        console.log("Marquee created successfully");
      } else {
        console.error("Failed to create marquee:", response.data.message);
      }
    } catch (error) {
      console.error("Error creating marquee:", error);
    }
  };

  // Update an existing marquee
  const updateMarquee = async () => {
    try {
      const response = await axios.patch(`${API_URL}/update-marquee/${editingId}`, { title, active });
      if (response.data.success) {
        const updatedMarquees = marquees.map((marquee) =>
          marquee._id === editingId ? response.data.data : marquee
        );
        setMarquees(updatedMarquees);
        setTitle('');
        setActive(true);
        setEditingId(null);
        console.log("Marquee updated successfully");
      } else {
        console.error("Failed to update marquee:", response.data.message);
      }
    } catch (error) {
      console.error("Error updating marquee:", error.message);
    }
  };

  // Delete a marquee
  const deleteMarquee = async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/delete-marquee/${id}`);
      if (response.data.success) {
        setMarquees(marquees.filter((marquee) => marquee._id !== id));
        console.log("Marquee deleted successfully");
      } else {
        console.error("Failed to delete marquee:", response.data.message);
      }
    } catch (error) {
      console.error("Error deleting marquee:", error.message);
    }
  };

  // Handle form submission (either create or update)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      updateMarquee();
    } else {
      createMarquee();
    }
  };

  // Fetch marquees when the component mounts
  useEffect(() => {
    getAllMarquees();
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-3 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Manage Marquees</h2>

      {/* Create/Update Marquee Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter marquee title"
            required
            className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={active}
            onChange={(e) => setActive(e.target.checked)}
            className="mr-2"
          />
          <label className="text-gray-700">Active</label>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {editingId ? 'Update' : 'Create'} Marquee
        </button>
      </form>

      {/* Marquee List */}
      <h3 className="text-xl font-medium text-gray-700 mt-8 mb-4">Marquee List</h3>
      <ul className="space-y-4">
        {marquees.map((marquee) => (
          <li key={marquee._id} className="flex justify-between items-center bg-gray-100 p-1 rounded-lg shadow-sm">
            <span className="text-sm font-semibold text-gray-800">{marquee.title}</span>
            <span className={`text-sm ${marquee.active ? 'text-green-500' : 'text-red-500'}`}>
              {marquee.active ? '(Active)' : '(Inactive)'}
            </span>
            <div className="space-x-2">
              <button
                onClick={() => {
                  setTitle(marquee.title);
                  setActive(marquee.active);
                  setEditingId(marquee._id);
                }}
                className="bg-yellow-500 text-white py-1 px-2 rounded-lg hover:bg-yellow-600 focus:outline-none"
              >
                Edit
              </button>
              <button
                onClick={() => deleteMarquee(marquee._id)}
                className="bg-red-500 text-white py-1 px-2 rounded-lg hover:bg-red-600 focus:outline-none"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MarqueeActions;
