export const validateForm = (formData) => {
    const errors = {};
  
    if (!formData.Title.trim()) {
      errors.Title = 'Title is required';
    }
  
    if (!formData.Details.trim()) {
      errors.Details = 'Details are required';
    }
  
    if (!formData.Items.length) {
      errors.Items = 'At least one item is required';
    }
  
    formData.Items.forEach((item, index) => {
      if (!item.itemName.trim()) {
        errors[`item${index}`] = 'Item name is required';
      }
      if (!item.MrpPrice.trim()) {
        errors[`price${index}`] = 'Price is required';
      }
    });
  
    return errors;
  };