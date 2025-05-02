// uploadImage.js
const supabase = require("../config/supabase.config");

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
}

async function uploadEventImage(file) {
  // file.buffer is a Buffer, file.originalname a string, 
  // and file.mimetype the detected mime type
  const uniqueFileName = generateUniqueFileName(file.originalname);
  const filePath = `events/${uniqueFileName}`;

  // tell Supabase exactly what type this is:
  const { data, error: uploadError } = await supabase
    .storage
    .from("event-images")
    .upload(filePath, file.buffer, {
      contentType: file.mimetype,
    });

  if (uploadError) throw uploadError;

  const { data: { publicUrl }, error } = await supabase
  .storage
  .from('event-images')
  .getPublicUrl(filePath);

  if (error) throw error;
  return publicUrl;
}

module.exports = uploadEventImage;
