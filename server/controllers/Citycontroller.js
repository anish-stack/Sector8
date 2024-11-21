const City = require('../models/CityModel')

exports.createCity = async (req, res) => {
    try {
        const { cityName } = req.body;
        const newCity = new City({ cityName });
        const savedCity = await newCity.save();
        res.status(201).json(savedCity);
    } catch (error) {
        console.error('Error creating city:', error);
        res.status(500).json({ error: 'Failed to create city' });
    }
};


exports.updateCity = async (req, res) => {
    try {
        const { id } = req.params;
        const { cityName } = req.body;

        const updatedCity = await City.findByIdAndUpdate(id, { cityName }, {
            new: true, // Return the updated document
            runValidators: true, // Run Mongoose validators for updates
        });

        if (!updatedCity) {
            return res.status(404).json({ error: 'City not found' });
        }

        res.json(updatedCity);
    } catch (error) {
        console.error('Error updating city:', error);
        res.status(500).json({ error: 'Failed to update city' });
    }
};


exports.deleteCity = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCity = await City.findByIdAndDelete(id);

        if (!deletedCity) {
            return res.status(404).json({ error: 'City not found' });
        }

        res.json(deletedCity);
    } catch (error) {
        console.error('Error deleting city:', error);
        res.status(500).json({ error: 'Failed to delete city' });
    }
};


exports.getAllCities = async (req, res) => {
    try {
        const cities = await City.find({});
        res.json(cities);
    } catch (error) {
        console.error('Error fetching cities:', error);
        res.status(500).json({ error: 'Failed to fetch cities' });
    }
};
