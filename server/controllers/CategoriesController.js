const Categories = require('../models/CategoreiesModel');
const Cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv')
const result = dotenv.config();

if (result.error) {
    console.error(result.error);
    throw new Error('Failed to load environment variables');
}


Cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY
});

const uploadImage = (file) => {
    return new Promise((resolve, reject) => {
        const stream = Cloudinary.uploader.upload_stream((error, result) => {
            if (result) {
                resolve({ public_id: result.public_id, imageUrl: result.secure_url });
            } else {
                reject(error || "Failed to upload image");
            }
        });
        stream.end(file.buffer);
    });
};



// Create a new category
exports.createCategory = async (req, res) => {
    try {
        const { CategoriesName } = req.body;

        // Check if CategoriesName is provided
        if (!CategoriesName) {
            return res.status(400).json({
                success: false,
                msg: "Please fill in all fields"
            });
        }

        // Check if file is uploaded
        const uploadImage = (file) => {
            return new Promise((resolve, reject) => {
                const stream = Cloudinary.uploader.upload_stream((error, result) => {
                    if (result) {
                        resolve({ public_id: result.public_id, imageUrl: result.secure_url });
                    } else {
                        reject(error || "Failed to upload image");
                    }
                });
                stream.end(file.buffer);
            });
        };
        console.log("Uplaod Image",uploadImage)
        // Assuming req.files contains uploaded files, adjust if using a different middleware
        const uploadedImages = await Promise.all(req.files.map(file => uploadImage(file)));
        console.log("Uplaod Images",uploadedImages)
        // Create new category object
        const newCategory = new Categories({
            CategoriesName,
            CategoriesImage:{
                imageUrl:uploadedImages[0].imageUrl,
                public_id:uploadedImages[0].public_id
            }// Assuming you want to store multiple images
        });

        // Save category to database
        const savedCategory = await newCategory.save();
        
        // Respond with success message and saved category data
        res.status(201).json({
            success: true,
            data: savedCategory
        });
    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).json({ error: 'Failed to create category' });
    }
};

const uploadImages = (fileBuffer) => {
    return new Promise((resolve, reject) => {
      const stream = Cloudinary.uploader.upload_stream((error, result) => {
        if (result) {
          resolve({ public_id: result.public_id, imageUrl: result.secure_url })
        } else {
          reject(error || "Failed to upload image")
        }
      })
      stream.end(fileBuffer)
    })
  }
  
  exports.updateCategory = async (req, res) => {
    try {
      const categoryId = req.params.id
      const { CategoriesName } = req.body
      const file = req.files[0]
  
      // Check if CategoriesName is provided
      if (!CategoriesName) {
        return res.status(400).json({
          success: false,
          msg: "Please provide a category name"
        })
      }
  
      // Check if file is uploaded
      let uploadedImage = {}
      if (file) {
        uploadedImage = await uploadImages(file.buffer)
      }
  
      // Find category by ID
      let category = await Categories.findById(categoryId)
  
      if (!category) {
        return res.status(404).json({
          success: false,
          msg: "Category not found"
        })
      }
  
      // Update category fields
      category.CategoriesName = CategoriesName
      if (file) {
        category.CategoriesImage = {
          imageUrl: uploadedImage.imageUrl,
          public_id: uploadedImage.public_id
        }
      }
  
      // Save updated category
      const updatedCategory = await category.save()
  
      // Respond with success message and updated category data
      res.status(200).json({
        success: true,
        data: updatedCategory
      })
    } catch (error) {
      console.error('Error updating category:', error)
      res.status(500).json({ error: 'Failed to update category' })
    }
  }

// Delete a category by ID
exports.deleteCategory = async (req, res) => {
    try {
        const categoryId = req.params.id; // Assuming ID is passed in URL params

        // Find category by ID and delete it
        const deletedCategory = await Categories.findById(categoryId);
        
        if (!deletedCategory) {
            return res.status(404).json({
                success: false,
                msg: "Category not found"
            });
        }
        await deletedCategory.deleteOne()

        // Respond with success message and deleted category data
        res.status(200).json({
            success: true,
            data: deletedCategory
        });
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({ error: 'Failed to delete category' });
    }
};


exports.getAllCategories = async (req, res) => {
    try {
        // Find all categories
        const categories = await Categories.find();

        // Respond with success message and category data
        res.status(200).json({
            success: true,
            data: categories
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
}