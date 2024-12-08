export const validateImage = (file) => {
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
  
    if (!ALLOWED_TYPES.includes(file.type)) {
      throw new Error('Please select a valid image file (JPEG, PNG, or WebP)');
    }
  
    if (file.size > MAX_FILE_SIZE) {
      throw new Error('Image size should be less than 5MB');
    }
  };