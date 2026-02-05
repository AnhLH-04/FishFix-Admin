import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const STORAGE_BUCKETS = {
  ID_CARDS: 'id-cards',
  CERTIFICATES: 'certificates',
} as const;

/**
 * Upload file to Supabase Storage
 */
export async function uploadFile(
  bucket: string,
  path: string,
  file: File
): Promise<{ url: string | null; error: Error | null }> {
  const { data, error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: '3600',
    upsert: true,
  });

  if (error) {
    return { url: null, error };
  }

  const { data: publicUrl } = supabase.storage.from(bucket).getPublicUrl(data.path);
  return { url: publicUrl.publicUrl, error: null };
}

/**
 * Delete file from Supabase Storage
 */
export async function deleteFile(
  bucket: string,
  path: string
): Promise<{ success: boolean; error: Error | null }> {
  const { error } = await supabase.storage.from(bucket).remove([path]);
  return { success: !error, error };
}
