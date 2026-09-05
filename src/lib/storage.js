import { supabase, isSupabaseConfigured } from './supabase';

/**
 * Uploads a file to a Supabase Storage bucket and returns its public URL.
 * @param {File} file - The File object selected by user input
 * @param {'product-images' | 'product-brochures'} bucketName - Target storage bucket
 * @returns {Promise<string>} Public URL of uploaded file
 */
export async function uploadProductFile(file, bucketName) {
  if (!file) return '';

  // Sanitized unique filename
  const timestamp = Date.now();
  const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const filePath = `${timestamp}_${safeName}`;

  if (!isSupabaseConfigured) {
    console.warn('Supabase credentials not configured. Returning dummy preview object URL.');
    return URL.createObjectURL(file);
  }

  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true,
    });

  if (error) {
    console.error(`Error uploading to ${bucketName}:`, error);
    throw new Error(`Failed to upload ${file.name}: ${error.message}`);
  }

  const { data: publicUrlData } = supabase.storage
    .from(bucketName)
    .getPublicUrl(filePath);

  return publicUrlData.publicUrl;
}
