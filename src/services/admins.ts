import { supabase } from '@/lib/supabase';
import type { Admin } from '@/types/admin'; // Admin 타입을 정의한 파일 경로

export const fetchAdmins = async (): Promise<Admin[]> => {
  const { data, error } = await supabase.rpc('get_admins');
  if (error) {
    throw new Error(error.message);
  }
  return data as Admin[];
}; 