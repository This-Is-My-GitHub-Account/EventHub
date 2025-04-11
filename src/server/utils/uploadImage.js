const supabase = require("../config/email.config");


// Assume file.originalname is something like "image.png"
const generateUniqueFileName = (originalName) => {
    const timestamp = Date.now(); // current timestamp in milliseconds
    const nameParts = originalName.split('.');
    
    // Ensure there is an extension
    if (nameParts.length === 1) {
      return `${originalName}_${timestamp}`;
    }
    
    const extension = nameParts.pop(); // get the extension ("png")
    const baseName = nameParts.join('.'); // get the base name ("image")
    return `${baseName}_${timestamp}.${extension}`;
  };
  
async function uploadEventImage(file, fileName) {
    // Define file path inside the bucket, e.g., using the file name directly or with a folder structure.
    const uniqueFileName = generateUniqueFileName(fileName);

    const filePath = `events/${uniqueFileName}`;
    
    // Upload image to the "event-images" bucket.
    const { data, error } = await supabase
      .storage
      .from('event-images')
      .upload(filePath, file);
  
    if (error) {
      throw error;
    }
  
    // Get the public URL for the uploaded image.
    const { publicURL, error: urlError } = supabase
      .storage
      .from('event-images')
      .getPublicUrl(filePath);
  
    if (urlError) {
      throw urlError;
    }
  
    return publicURL; // This URL can now be stored in the events table.
  }

  module.exports = uploadEventImage;